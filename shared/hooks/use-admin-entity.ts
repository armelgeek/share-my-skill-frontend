import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AdminConfig, CrudService } from '@/shared/lib/admin/admin-generator';

interface UseAdminEntityOptions<T extends Record<string, unknown>> {
  config: AdminConfig;
  apiEndpoint?: string;
  queryKey: string[];
  onSuccess?: {
    create?: (data: T) => void;
    update?: (data: T) => void;
    delete?: (id: string) => void;
  };
  onError?: {
    create?: (error: Error) => void;
    update?: (error: Error) => void;
    delete?: (error: Error) => void;
    fetch?: (error: Error) => void;
  };
  customServices?: CrudService<T>;
  filters?: Record<string, string | number | undefined>;
  parentId?: string;
}

interface AdminEntityService<T> {
  fetchItems: (filters?: Record<string, unknown>) => Promise<{ data: T[]; meta?: { total: number; totalPages: number } }>;
  createItem: (data: T) => Promise<T>;
  updateItem: (id: string, data: Partial<T>) => Promise<T>;
  deleteItem: (id: string) => Promise<void>;
}

function createAdminService<T>(endpoint: string): AdminEntityService<T> {
  // Ajout d'un prefix global si défini (ex: process.env.NEXT_PUBLIC_API_URL)
  const API_PREFIX = process.env.NEXT_PUBLIC_API_URL || '';
  const fullEndpoint = endpoint.startsWith('http') ? endpoint : `${API_PREFIX}${endpoint}`;

  return {
    async fetchItems(filters?: Record<string, unknown>) {
      let url = fullEndpoint;
      console.log('url', url);
      if (filters && Object.keys(filters).length > 0) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
        url += `?${params.toString()}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
      }
      return response.json();
    },

    async createItem(data: T) {
      const response = await fetch(fullEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to create item`);
      }
      return response.json();
    },

    async updateItem(id: string, data: Partial<T>) {
      const response = await fetch(`${fullEndpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to update item`);
      }
      return response.json();
    },

    async deleteItem(id: string) {
      await fetch(`${fullEndpoint}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    },
  };
}

export function useAdminEntity<T extends Record<string, unknown>>(
  options: UseAdminEntityOptions<T>
) {
  const queryClient = useQueryClient();
  const service = options.customServices
    ? wrapParentService(options.customServices, options.parentId, options.filters)
    : createAdminService<T>(options.apiEndpoint || '');

  // Clé de query complète avec les filtres
  const query = useQuery({
    queryKey: options.filters && Object.keys(options.filters).length > 0
      ? [...options.queryKey, options.filters]
      : options.queryKey,
    queryFn: async () => {
      try {
        const result = await service.fetchItems(options.filters as Record<string, string | number | undefined>);
        return result;
      } catch (error) {
        console.error('[useAdminEntity] queryFn error:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0, // Toujours stale, refetch immédiat après mutation
  });

  const createMutation = useMutation({
    mutationFn: service.createItem,
    onSuccess: (data) => {
      // Invalider toutes les queries qui commencent par la queryKey de base
      queryClient.invalidateQueries({ queryKey: options.queryKey });
      toast.success(`${options.config.title} créé avec succès`);
      options.onSuccess?.create?.(data);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création : ${error.message}`);
      options.onError?.create?.(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
      service.updateItem(id, data),
    onSuccess: (data) => {
      // Invalider toutes les queries qui commencent par la queryKey de base
      queryClient.invalidateQueries({ queryKey: options.queryKey });
      toast.success(`${options.config.title} modifié avec succès`);
      options.onSuccess?.update?.(data);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la modification : ${error.message}`);
      options.onError?.update?.(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: service.deleteItem,
    onSuccess: (_, id) => {
      // Invalider toutes les queries qui commencent par la queryKey de base
      queryClient.invalidateQueries({ queryKey: options.queryKey });
      toast.success(`${options.config.title} supprimé avec succès`);
      options.onSuccess?.delete?.(id);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression : ${error.message}`);
      options.onError?.delete?.(error);
    },
  });
  return {
    data: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    create: createMutation.mutateAsync,
    update: (id: string, data: Partial<T>) => {
      console.log('useAdminEntity.update called with:', id, data);
      return updateMutation.mutateAsync({ id, data });
    },
    delete: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: options.queryKey }),
  };
}

function wrapParentService<T extends Record<string, unknown>>(service: CrudService<T>, parentId?: string, globalFilters?: Record<string, unknown>): CrudService<T> {
  function castFilters(input?: Record<string, unknown>): Record<string, string | number | undefined> | undefined {
    if (!input) return undefined;
    const result: Record<string, string | number | undefined> = {};
    for (const [key, value] of Object.entries(input)) {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'undefined'
      ) {
        result[key] = value;
      } else if (value !== null && typeof value !== 'object') {
        result[key] = String(value);
      } else if (value === null) {
        result[key] = undefined;
      }
    }
    return result;
  }
  return {
    fetchItems: async (dynamicFilters?: Record<string, string | number | undefined>) => {
      // Combine les filtres globaux et dynamiques
      const castedGlobalFilters = castFilters(globalFilters);
      const combinedFilters = { ...castedGlobalFilters, ...dynamicFilters };
      
      let result;
      if (parentId && service.fetchItems.length > 0) {
        result = await service.fetchItems({ ...combinedFilters, parentId });
      } else {
        result = await service.fetchItems(combinedFilters);
      }
      
      return result;
    },
    createItem: (data: T) => {
      if (parentId && service.createItem.length > 0) {
        return service.createItem({ ...data, parentId });
      }
      return service.createItem(data);
    },
    updateItem: (id: string, data: Partial<T>) => {
      if (parentId && service.updateItem.length > 1) {
        return service.updateItem(id, { ...data, parentId });
      }
      return service.updateItem(id, data);
    },
    deleteItem: (id: string) => {
      if (parentId && service.deleteItem.length > 1) {
        // On ignore le second argument si la méthode n'en attend qu'un
        return (service.deleteItem as (id: string, params?: { parentId?: string }) => Promise<void>)(id, { parentId });
      }
      return service.deleteItem(id);
    },
  };
}

export function useSimpleAdminEntity<T extends Record<string, unknown>>(
  entityName: string,
  config: AdminConfig
) {
  const kebabName = entityName.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');

  return useAdminEntity<T>({
    config,
    queryKey: [kebabName],
    apiEndpoint: `/api/${kebabName}s`,
  });
}

export type { AdminEntityService, UseAdminEntityOptions };
export { createAdminService };