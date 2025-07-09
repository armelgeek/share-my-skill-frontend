import { z, ZodSchema, ZodObject } from 'zod';
import { BaseServiceImpl, ResourceEndpoints } from '@/shared/domain/base.service';
import { Filter } from '@/shared/lib/types/filter';
import { Badge } from '@/shared/components/atoms/ui/badge';
import * as React from 'react';
import { Icons } from '@/shared/components/atoms/ui/icons';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'date' | 'email' | 'url' | 'rich-text' | 'image' | 'file' | 'relation' | 'list' | 'array' | 'time';
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
  placeholder?: string;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  readOnly?: boolean; // Champ non éditable dans le formulaire
  computed?: (item: Record<string, unknown>) => unknown; // Valeur calculée dynamiquement
  display?: {
    showInTable?: boolean;
    showInForm?: boolean;
    showInDetail?: boolean;
    order?: number;
    widget?: 'select' | 'tag' | 'radio';
    arrayDisplayField?: string; // Champ à exposer pour un tableau d'objets
    prefix?: string;
    suffix?: string;
    format?: (value: unknown) => string;
    visibleIf?: (item: Record<string, unknown>) => boolean; // Visibilité conditionnelle
    customComponent?: React.ComponentType<Record<string, unknown>>;
  };
  relation?: {
    entity: string;
    displayField: string;
    multiple?: boolean;
  };
}

export interface BulkAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (ids: string[]) => Promise<void> | void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
}

export interface AdminConfig<T = Record<string, unknown>> {
  title: string;
  description?: string;
  icon?: string;
  fields: FieldConfig[];
  actions: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    bulk?: boolean;
  
  };
  ui?: {
    table?: {
      defaultSort?: string;
      defaultFilters?: Record<string, unknown>;
      pageSize?: number;
    };
    form?: {
      layout?: 'sections' | 'simple'| 'two-cols' | 'horizontal' | 'steps';
      sections?: {
        title: string;
        fields: string[];
      }[];
      steps?: {
        title: string;
        description?: string;
        layout?: 'simple' | 'two-cols' | 'horizontal' | 'sections';
        fields: string[];
      }[];
      createTitle?: string;
      createSubtitle?: string;
      editTitle?: string;
      editSubtitle?: string;
      autoStepsThreshold?: number; // Nombre de champs au-delà duquel on active automatiquement le mode steps
    };
    toolbarActions?: React.ReactNode | ((selectedRows: T[]) => React.ReactNode);
    searchEnabled?: boolean;
  };
  bulkActions?: BulkAction[];
}

export interface AdminConfigWithAccessor extends AdminConfig {
  accessor: DynamicFieldAccess;
  bulkActions?: BulkAction[];
}

export type ChildConfig = {
  route: string;
  label?: string;
  icon?: string;
  [key: string]: unknown;
};

export interface AdminConfigWithServices<T extends Record<string, unknown>> extends AdminConfigWithAccessor {
   parent?: {
    key: string;
    routeParam: string;
    parentEntity?: string;
    parentLabel?: string;
  };
  services?: CrudService<T>;
  queryKey?: string[];
  parseEditItem?: (item: Partial<T>) => Partial<T> | T;
  formFields?: string[];
  bulkActions?: BulkAction[];
  children?: ChildConfig[];
}

export interface AdminConfigWithParent<T extends Record<string, unknown>> extends AdminConfigWithServices<T> {
  parent?: {
    key: string;
    routeParam: string;
    parentEntity?: string;
    parentLabel?: string;
  };
  bulkActions?: BulkAction[];
}

export interface AdminConfigWithChild<T extends Record<string, unknown>> extends AdminConfigWithParent<T> {
  children?: ChildConfig[];
  bulkActions?: BulkAction[];
}

interface ZodMetadata {
  label?: string;
  description?: string;
  placeholder?: string;
  type?: FieldConfig['type'];
  display?: FieldConfig['display'];
  relation?: FieldConfig['relation'];
  options?: string[] | { value: string; label: string }[];
  readOnly?: boolean;
  computed?: (item: Record<string, unknown>) => unknown;
}

export function getNestedProperty<T = unknown>(obj: Record<string, unknown>, path: string): T | undefined {
  return path.split('.').reduce<Record<string, unknown> | undefined>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      const next = (current as Record<string, unknown>)[key];
      return typeof next === 'object' && next !== null
        ? (next as Record<string, unknown>)
        : next as Record<string, unknown> | undefined;
    }
    return undefined;
  }, obj) as T | undefined;
}

export function setNestedProperty(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  const lastKey = keys.pop();

  if (!lastKey) return;

  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key] as Record<string, unknown>;
  }, obj);

  target[lastKey] = value;
}

export function hasNestedProperty(obj: Record<string, unknown>, path: string): boolean {
  return getNestedProperty(obj, path) !== undefined;
}

export interface DynamicFieldAccess {
  getValue: <T = unknown>(obj: Record<string, unknown>, field: string) => T | undefined;
  setValue: (obj: Record<string, unknown>, field: string, value: unknown) => void;
  hasValue: (obj: Record<string, unknown>, field: string) => boolean;
}

export function createDynamicAccessor(): DynamicFieldAccess {
  return {
    getValue: <T = unknown>(obj: Record<string, unknown>, field: string): T | undefined => {
      if (field.includes('.')) {
        return getNestedProperty<T>(obj, field);
      }
      return obj[field] as T | undefined;
    },

    setValue: (obj: Record<string, unknown>, field: string, value: unknown): void => {
      if (field.includes('.')) {
        setNestedProperty(obj, field, value);
      } else {
        obj[field] = value;
      }
    },

    hasValue: (obj: Record<string, unknown>, field: string): boolean => {
      if (field.includes('.')) {
        return hasNestedProperty(obj, field);
      }
      return field in obj;
    }
  };
}

export interface AdminConfigWithAccessor extends AdminConfig {
  accessor: DynamicFieldAccess;
}

export function withMeta<T extends ZodSchema>(schema: T, metadata: ZodMetadata): T & { _metadata: ZodMetadata } {
  return Object.assign(schema, { _metadata: metadata });
}

export const createField = {
  string: (metadata?: ZodMetadata) =>
    withMeta(z.string(), { type: 'text', ...metadata }),

  email: (metadata?: ZodMetadata) =>
    withMeta(z.string().email(), { type: 'email', ...metadata }),

  url: (metadata?: ZodMetadata) =>
    withMeta(z.string().url(), { type: 'url', ...metadata }),

  textarea: (metadata?: ZodMetadata) =>
    withMeta(z.string(), { type: 'textarea', ...metadata }),

  richText: (metadata?: ZodMetadata) =>
    withMeta(z.string(), { type: 'rich-text', ...metadata }),

  number: (metadata?: ZodMetadata) =>
    withMeta(z.number(), { type: 'number', ...metadata }),

  boolean: (metadata?: ZodMetadata) =>
    withMeta(z.boolean(), { type: 'boolean', ...metadata }),

  date: (metadata?: ZodMetadata) =>
    withMeta(z.date(), { type: 'date', ...metadata }),

  select: (options: string[] | { value: string; label: string }[], metadata?: ZodMetadata) =>
    withMeta(z.string(), { type: 'select', options, ...metadata }),

  relation: (entity: string, displayField: string = 'name', multiple: boolean = false, metadata?: ZodMetadata) =>
    withMeta(multiple ? z.array(z.string()) : z.string(), {
      type: 'relation',
      relation: { entity, displayField, multiple },
      ...metadata
    }),

  image: (metadata?: ZodMetadata) =>
    withMeta(z.string(), { type: 'image', ...metadata }),

  file: (metadata?: ZodMetadata) =>
    withMeta(z.string(), { type: 'file', ...metadata }),

  radio: (options: string[] | { value: string; label: string }[], metadata?: ZodMetadata) =>
    withMeta(z.string(), { type: 'select', options, display: { widget: 'radio', ...(metadata?.display || {}) }, ...metadata }),
  tag: (options: string[] | { value: string; label: string }[], metadata?: ZodMetadata) =>
    withMeta(z.string(), { type: 'select', options, display: { widget: 'tag', ...(metadata?.display || {}) }, ...metadata }),
  list: (metadata?: ZodMetadata) =>
    withMeta(z.preprocess(
      (val) => {
        // Autorise string (CSV) ou array en entrée, convertit toujours en string CSV pour la valeur retournée
        if (typeof val === 'string') {
          return val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .join(',');
        }
        if (Array.isArray(val)) {
          return val.map((s) => String(s)).filter(Boolean).join(',');
        }
        return '';
      },
      z.string()
    ), { type: 'list', ...metadata }),
};

export function generateAdminConfig(schema: ZodObject<z.ZodRawShape>, title: string): AdminConfigWithAccessor {
  const fields: FieldConfig[] = [];
  const accessor = createDynamicAccessor();

  if (!(schema instanceof z.ZodObject)) {
    throw new Error('[generateAdminConfig] Le schéma fourni n\'est pas un ZodObject.');
  }

  let shape: Record<string, z.ZodTypeAny>;
  const s = schema as unknown as { shape?: () => Record<string, z.ZodTypeAny>; _def?: { shape?: () => Record<string, z.ZodTypeAny> | Record<string, z.ZodTypeAny> } };
  if (typeof s.shape === 'function') {
    shape = s.shape();
  } else if (typeof s._def?.shape === 'function') {
    shape = s._def.shape();
  } else if (s._def?.shape && typeof s._def.shape === 'object') {
    shape = s._def.shape;
  } else {
    throw new Error('[generateAdminConfig] Impossible de récupérer la shape du schéma ZodObject.');
  }

  Object.entries(shape).forEach(([key, zodField]) => {
    let metadata: ZodMetadata = {};
    let actualField = zodField;
    if (zodField instanceof z.ZodOptional) {
      actualField = zodField._def.innerType;
    }
    if ((actualField as { _metadata?: ZodMetadata })._metadata) {
      metadata = (actualField as { _metadata?: ZodMetadata })._metadata || {};
    } else if ((zodField as { _metadata?: ZodMetadata })._metadata) {
      metadata = (zodField as { _metadata?: ZodMetadata })._metadata || {};
    }

    const field: FieldConfig = {
      key,
      label: metadata.label || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      type: metadata.type || 'text',
      required: !zodField.isOptional(),
      placeholder: metadata.placeholder,
      description: metadata.description,
      readOnly: metadata.readOnly,
      computed: metadata.computed,
      display: {
        showInTable: !['textarea', 'rich-text', 'image', 'file'].includes(metadata.type || 'text'),
        showInForm: true,
        showInDetail: true,
        ...metadata.display,
      },
      relation: metadata.relation,
    };

    if (!metadata.type) {
      if (actualField instanceof z.ZodString) {
        if (key.toLowerCase().includes('email')) field.type = 'email';
        else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('website')) field.type = 'url';
        else if (key.toLowerCase().includes('description') || key.toLowerCase().includes('comment') || key.toLowerCase().includes('content')) field.type = 'textarea';
        else if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('avatar')) field.type = 'image';
        else if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time') || key === 'createdAt' || key === 'updatedAt') field.type = 'date';
        else if (key.toLowerCase().includes('status') || key.toLowerCase().includes('type') || key.toLowerCase().includes('state')) {
          field.type = 'select';
          if (metadata.options) field.options = metadata.options;
        }
        else field.type = 'text';
      } else if (actualField instanceof z.ZodNumber) {
        field.type = 'number';
      } else if (actualField instanceof z.ZodBoolean) {
        field.type = 'boolean';
      } else if (actualField instanceof z.ZodEnum) {
        field.type = 'select';
        field.options = actualField.options;
      } else if (actualField instanceof z.ZodDate) {
        field.type = 'date';
      }
    }

    if (metadata.options) {
      field.options = metadata.options;
    }

    if (key === 'id') {
      field.display = {
        ...field.display,
        showInForm: false,
        showInTable: false,
        showInDetail: true,
      };
    }
    if (key === 'updatedAt') {
      field.display = {
        ...field.display,
        showInForm: false,
        showInTable: false,
        showInDetail: true,
      };
    }

    fields.push(field);
  });

  // Logique pour décider du layout selon le nombre de champs
  const formFieldsCount = fields.filter(f => f.display?.showInForm !== false).length;
  const shouldUseSteps = formFieldsCount > 8; // Seuil par défaut
  
  // Génération automatique des steps si nombreux champs
  const baseFormConfig = {
    layout: shouldUseSteps ? 'steps' as const : 'simple' as const,
    autoStepsThreshold: 8
  };

  let formConfig: typeof baseFormConfig & { steps?: Array<{ title: string; description: string; fields: string[] }> } = baseFormConfig;

  if (shouldUseSteps) {
    const formFields = fields.filter(f => f.display?.showInForm !== false);
    const fieldsPerStep = Math.ceil(formFields.length / 3); // 3 étapes maximum
    
    const steps = [];
    for (let i = 0; i < formFields.length; i += fieldsPerStep) {
      const stepFields = formFields.slice(i, i + fieldsPerStep);
      const stepNumber = Math.floor(i / fieldsPerStep) + 1;
      
      steps.push({
        title: `Étape ${stepNumber}`,
        description: stepNumber === 1 ? 'Informations générales' : 
                     stepNumber === 2 ? 'Détails complémentaires' : 
                     'Finalisation',
        layout: stepNumber === 1 ? 'two-cols' : 'simple', // Premier step en 2 colonnes, autres en simple
        fields: stepFields.map(f => f.key)
      });
    }
    formConfig = { ...baseFormConfig, steps };
  }

  // Limite les colonnes du tableau si trop de champs
  const shouldLimitTableColumns = fields.length > 7;
  if (shouldLimitTableColumns) {
    // Priorité : id, name/title, status/type, date, puis autres champs courts
    const priorityFields = ['id', 'name', 'title', 'status', 'type', 'isActive', 'createdAt', 'updatedAt'];
    fields.forEach(field => {
      if (field.display?.showInTable !== false) {
        const isPriority = priorityFields.some(pf => field.key.toLowerCase().includes(pf.toLowerCase()));
        const isLongContent = ['textarea', 'rich-text', 'image', 'file', 'list'].includes(field.type);
        
        if (!isPriority || isLongContent) {
          field.display = { ...field.display, showInTable: false };
        }
      }
    });
  }

  return {
    title,
    fields,
    accessor,
    actions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      bulk: true
    },
    ui: {
      table: {
        defaultSort: 'createdAt',
        pageSize: 10,
      },
      form: formConfig,
    }
  };
}

export function detectContentType(value: unknown): 'number' | 'date' | 'boolean' | 'string' {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (value === null || value === undefined) return 'string';
  const str = String(value).trim();
  if (/^-?\d+(?:[.,]\d+)?$/.test(str)) return 'number';
  if (/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?/.test(str)) return 'date';
  if (/^(true|false|oui|non|yes|no|0|1)$/i.test(str)) return 'boolean';
  return 'string';
}

// Fonction pour créer des colonnes React Table dynamiquement
export function createDynamicColumns(fields: FieldConfig[], accessor: DynamicFieldAccess) {
  return fields
    .filter(field => field.display?.showInTable !== false)
    .map(field => {
      return {
        accessorKey: field.key,
        header: field.label,
        cell: ({ row }: { row: { original: Record<string, unknown> } }) => {
          const value = accessor.getValue(row.original, field.key);
          const detected = detectContentType(value);

          if (field.display?.format) {
            return field.display.format(value);
          }

          if (detected === 'number') {
            if (value !== undefined && value !== null) {
              const str = String(value);
              return `${field.display?.prefix ?? ''}${str}${field.display?.suffix ?? ''}`;
            }
            return '';
          }
          if (detected === 'date') {
            if (!value) return '';
            const date = new Date(value as string);
            return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('fr-FR');
          }
          if (detected === 'boolean') {
            if (typeof value === 'boolean') return value ? '✓' : '✗';
            if (typeof value === 'string') {
              const v = value.toLowerCase();
              if (['true', 'oui', 'yes', '1'].includes(v)) return '✓';
              if (['false', 'non', 'no', '0'].includes(v)) return '✗';
            }
            return String(value);
          }

          if (field.type === 'list') {
            if (!value) return '';
            const tags = String(value)
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean);
            if (tags.length === 0) return '';
            return React.createElement(
              'div',
              { className: 'flex flex-wrap gap-1', 'aria-label': field.label },
              tags.map((tag, i) =>
                React.createElement(
                  Badge,
                  { variant: 'secondary', key: tag ? `${tag}-${i}` : `${i}` },
                  tag
                )
              )
            );
          }
          // Affichage spécial pour les tableaux d'objets
          if (field.type === 'array' && Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object') {
              const arrayDisplayField = field.display?.arrayDisplayField;
              return value
                .map((v: Record<string, unknown>) => {
                  if (arrayDisplayField && arrayDisplayField in v && v[arrayDisplayField]) {
                    return String(v[arrayDisplayField]);
                  }
                  return JSON.stringify(v);
                })
                .filter(Boolean)
                .join(', ');
            }
            return value.map(String).join(', ');
          }
          return String(value || '');
        },
        meta: {
          className: (row: { original: Record<string, unknown> }) => {
            const raw = accessor.getValue(row.original, field.key);
            const detected = detectContentType(raw);
            if (detected === 'number' || detected === 'date' || detected === 'boolean') return 'text-center';
            return undefined;
          }
        }
      };
    });
}

export function createFormAccessors<T extends Record<string, unknown>>(
  data: T,
  fields: FieldConfig[]
) {
  const accessor = createDynamicAccessor();

  return {

    getFieldValue: (fieldKey: string) => {
      return accessor.getValue(data, fieldKey);
    },

    setFieldValue: (fieldKey: string, value: unknown) => {
      accessor.setValue(data, fieldKey, value);
    },

    getFormValues: () => {
      const values: Record<string, unknown> = {};
      fields
        .filter(field => field.display?.showInForm !== false)
        .forEach(field => {
          values[field.key] = accessor.getValue(data, field.key);
        });
      return values;
    },

    validateRequired: () => {
      const errors: string[] = [];
      fields
        .filter(field => field.required && field.display?.showInForm !== false)
        .forEach(field => {
          const value = accessor.getValue(data, field.key);
          if (value === undefined || value === null || value === '') {
            errors.push(`${field.label} est requis`);
          }
        });
      return errors;
    }
  };
}

export function useZodValidation<T>(schema: ZodSchema<T>) {
  const validate = (data: unknown): { success: boolean; data?: T; errors?: string[] } => {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return { success: false, errors: ['Erreur de validation inconnue'] };
    }
  };

  const safeValidate = (data: unknown) => {
    const result = schema.safeParse(data);
    return result;
  };

  return { validate, safeValidate };
}

export function createAdminEntity<T extends Record<string, unknown>>(
  name: string,
  schema: z.ZodObject<z.ZodRawShape>,
  config?: Partial<AdminConfigWithChild<T>>
): AdminConfigWithChild<T> {
  const baseConfig = generateAdminConfig(schema, name);
  return {
    ...baseConfig,
    ...config,
    fields: config?.fields || baseConfig.fields,
    actions: { ...baseConfig.actions, ...config?.actions },
    ui: { ...baseConfig.ui, ...config?.ui },
    services: config?.services,
    queryKey: config?.queryKey || [name.toLowerCase()],
    parent: config?.parent,
    children: config?.children,
    formFields: config?.formFields,
    parseEditItem: config?.parseEditItem || ((item: Partial<T>) => {
      const parsed: Partial<T> = { ...item };
      const dateRegex = /date|at$/i;
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?/;
      for (const key in item) {
        const value = item[key as keyof T];
        if (
          dateRegex.test(key) ||
          (typeof value === 'string' && isoDateRegex.test(value)) ||
          (typeof value === 'number' && value > 1000000000)
        ) {
          if (value === null || value === undefined || value === '') {
            parsed[key as keyof T] = '' as unknown as T[keyof T];
          } else if (value instanceof Date) {
            parsed[key as keyof T] = value as T[keyof T];
          } else if (typeof value === 'string' || typeof value === 'number') {
            const d = new Date(value);
            parsed[key as keyof T] = !isNaN(d.getTime()) ? (d as unknown as T[keyof T]) : ('' as unknown as T[keyof T]);
          } else {
            parsed[key as keyof T] = '' as unknown as T[keyof T];
          }
        } else if (value === null || value === undefined) {
          parsed[key as keyof T] = '' as unknown as T[keyof T];
        }
      }
      return parsed;
    }),
  };
}

export function createEntitySchema<T extends z.ZodRawShape>(
  fields: T,
  relations?: Record<string, { entity: string; displayField?: string; multiple?: boolean }>
) {
  const schema = z.object(fields);

  if (relations) {
    const relatedFields: Record<string, z.ZodTypeAny> = {};
    Object.entries(relations).forEach(([key, relation]) => {
      relatedFields[key] = createField.relation(
        relation.entity,
        relation.displayField,
        relation.multiple
      );
    });

    return z.object({ ...fields, ...relatedFields });
  }

  return schema;
}

export interface CrudService<T extends Record<string, unknown>> {
  fetchItems: (filters?: Record<string, string | number | undefined>) => Promise<{ data: T[]; meta?: { total: number; totalPages: number } }>;
  createItem: (data: T) => Promise<T>;
  updateItem: (id: string, data: Partial<T>) => Promise<T>;
  deleteItem: (id: string) => Promise<void>;
}

export interface AdminConfigWithServices<T extends Record<string, unknown>> extends AdminConfigWithAccessor {
  services?: CrudService<T>;
  queryKey?: string[];
  parseEditItem?: (item: Partial<T>) => Partial<T> | T;
  formFields?: string[];
  bulkActions?: BulkAction[];
}

export interface AdminConfigWithParent<T extends Record<string, unknown>> extends AdminConfigWithServices<T> {
  parent?: {
    key: string;
    routeParam: string;
    parentEntity?: string;
    parentLabel?: string;
  };
  bulkActions?: BulkAction[];
}

export interface AdminConfigWithChild<T extends Record<string, unknown>> extends AdminConfigWithParent<T> {
  children?: ChildConfig[];
  bulkActions?: BulkAction[];
}

export interface MockServiceOptions<T> {
  entityName?: string;
  enableBackup?: boolean;
  maxBackups?: number;
  enableValidation?: boolean;
  validator?: (item: T) => boolean | string;
  relations?: Record<string, MockRelation>;
  hooks?: MockServiceHooks<T>;
  autoGenerateData?: {
    enabled: boolean;
    count?: number;
    generator?: () => T;
  };
}

export interface MockRelation {
  entity: string;
  field: string;
  type: 'oneToMany' | 'manyToOne' | 'manyToMany';
}

export interface MockServiceHooks<T> {
  beforeCreate?: (item: T) => T | Promise<T>;
  afterCreate?: (item: T) => void | Promise<void>;
  beforeUpdate?: (id: string, updates: Partial<T>, current: T) => Partial<T> | Promise<Partial<T>>;
  afterUpdate?: (item: T) => void | Promise<void>;
  beforeDelete?: (id: string, item: T) => boolean | Promise<boolean>;
  afterDelete?: (id: string) => void | Promise<void>;
}

export interface ExtendedCrudService<T extends Record<string, unknown>> extends CrudService<T> {
  fetchItems: (filters?: {
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    [key: string]: string | number | boolean | undefined;
  }) => Promise<{ data: T[]; meta: { total: number; totalPages: number; page: number; limit: number } }>;
  bulkCreate: (items: T[]) => Promise<T[]>;
  bulkUpdate: (updates: Array<{ id: string; data: Partial<T> }>) => Promise<T[]>;
  bulkDelete: (ids: string[]) => Promise<void>;
  getById: (id: string) => Promise<T | null>;
  backup: () => Promise<string>;
  restore: (backupData: string) => Promise<void>;
  getStats: () => Promise<{
    total: number;
    createdToday: number;
    updatedToday: number;
    lastCreated?: T;
    lastUpdated?: T;
  }>;
}

export function createMockService<T extends Record<string, unknown>>(
  initialData: T[] = [],
  options: MockServiceOptions<T> = {}
): ExtendedCrudService<T> {
  const {
    entityName,
    enableBackup = true,
    maxBackups = 5,
    enableValidation = false,
    validator,
    hooks = {},
    autoGenerateData
  } = options;

  // TODO: implement relations handling
  // const relations = options.relations || {};

  const storageKey = entityName ? `mock_data_${entityName}` : 'mock_data_default';
  const backupKey = entityName ? `mock_backup_${entityName}` : 'mock_backup_default';
  
  const loadData = (): T[] => {
    if (typeof window === 'undefined') return [...initialData];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [...initialData];
      }
    } catch (error) {
      console.warn(`[MockService] Erreur lors du chargement des données pour ${entityName}:`, error);
    }
    return [...initialData];
  };

  const saveData = (data: T[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      if (enableBackup) {
        createBackup(data);
      }
    } catch (error) {
      console.warn(`[MockService] Erreur lors de la sauvegarde des données pour ${entityName}:`, error);
    }
  };

  const createBackup = (data: T[]): void => {
    if (typeof window === 'undefined') return;
    try {
      const backups = getBackups();
      const newBackup = {
        timestamp: new Date().toISOString(),
        data: [...data]
      };
      backups.unshift(newBackup);
      if (backups.length > maxBackups) {
        backups.splice(maxBackups);
      }
      localStorage.setItem(backupKey, JSON.stringify(backups));
    } catch (error) {
      console.warn(`[MockService] Erreur lors de la création du backup pour ${entityName}:`, error);
    }
  };

  const getBackups = () => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(backupKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const validate = (item: T): boolean => {
    if (!enableValidation || !validator) return true;
    const result = validator(item);
    if (typeof result === 'string') {
      throw new Error(`Validation error: ${result}`);
    }
    return result;
  };

  const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const filterData = (data: T[], filters: Record<string, unknown> = {}): T[] => {
    console.log('[filterData] Input data length:', data.length);
    console.log('[filterData] Filters:', filters);
    
    let filtered = [...data];

    // Recherche textuelle
    if (filters.search && typeof filters.search === 'string') {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => {
        return Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm)
        );
      });
      console.log('[filterData] After search filter:', filtered.length);
    }

    // Filtres par champ
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'search' && key !== 'sort' && key !== 'order' && key !== 'page' && key !== 'limit' && value !== undefined && value !== '' && value !== null) {
        console.log(`[filterData] Applying filter ${key} = ${value}`);
        const beforeFilter = filtered.length;
        filtered = filtered.filter(item => {
          const itemValue = (item as Record<string, unknown>)[key];
          const matches = itemValue === value || String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          if (!matches) {
            console.log(`[filterData] Item excluded: ${key} "${itemValue}" doesn't match "${value}"`);
          }
          return matches;
        });
        console.log(`[filterData] After ${key} filter: ${beforeFilter} -> ${filtered.length}`);
      } else if (value === '' || value === null) {
        console.log(`[filterData] Skipping empty filter: ${key} = "${value}"`);
      }
    });

    console.log('[filterData] Final filtered length:', filtered.length);
    return filtered;
  };

  const sortData = (data: T[], sort?: string, order: 'asc' | 'desc' = 'asc'): T[] => {
    if (!sort) return data;
    
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sort];
      const bVal = (b as Record<string, unknown>)[sort];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return order === 'asc' ? comparison : -comparison;
    });
  };

  const paginateData = (data: T[], page = 1, limit = 20) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return data.slice(startIndex, endIndex);
  };

  let data: T[] = loadData();

  const initializeIfEmpty = () => {
    if (data.length === 0 && initialData.length > 0) {
      data = [...initialData];
      saveData(data);
    } else if (data.length === 0 && autoGenerateData?.enabled && autoGenerateData.generator) {
      const count = autoGenerateData.count || 10;
      const generated = Array.from({ length: count }, () => autoGenerateData.generator!());
      data = generated;
      saveData(data);
    }
  };

  initializeIfEmpty();

  // Créer le service avec toutes les méthodes implémentées
  const service: ExtendedCrudService<T> = {
    fetchItems: async (filters = {}) => {
      data = loadData();
      const { page = 1, limit = 20, sort, order } = filters;
      
      let filtered = filterData(data, filters);
      filtered = sortData(filtered, sort, order);
      
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const paginatedData = paginateData(filtered, page, limit);
      
      return {
        data: paginatedData,
        meta: { total, totalPages, page, limit }
      };
    },

    getById: async (id: string) => {
      data = loadData();
      const item = data.find((item: T) => (item as Record<string, unknown>).id === id);
      return item || null;
    },

    createItem: async (item: T) => {
      if (!validate(item)) {
        throw new Error('Validation failed');
      }

      let processedItem = item;
      if (hooks.beforeCreate) {
        processedItem = await hooks.beforeCreate(item);
      }

      const newItem = {
        ...processedItem,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as T;

      data = loadData();
      data.push(newItem);
      saveData(data);

      if (hooks.afterCreate) {
        await hooks.afterCreate(newItem);
      }

      return newItem;
    },

    bulkCreate: async (items: T[]) => {
      const results: T[] = [];
      for (const item of items) {
        const created = await service.createItem(item);
        results.push(created);
      }
      return results;
    },

    updateItem: async (id: string, updates: Partial<T>) => {
      data = loadData();
      const index = data.findIndex((item: T) => (item as Record<string, unknown>).id === id);
      if (index === -1) throw new Error('Item not found');

      const currentItem = data[index];
      let processedUpdates = updates;
      
      if (hooks.beforeUpdate) {
        processedUpdates = await hooks.beforeUpdate(id, updates, currentItem);
      }

      const updatedItem = { 
        ...currentItem, 
        ...processedUpdates, 
        updatedAt: new Date().toISOString()
      } as T;

      if (!validate(updatedItem)) {
        throw new Error('Validation failed');
      }

      data[index] = updatedItem;
      saveData(data);

      if (hooks.afterUpdate) {
        await hooks.afterUpdate(updatedItem);
      }

      return updatedItem;
    },

    bulkUpdate: async (updates: Array<{ id: string; data: Partial<T> }>) => {
      const results: T[] = [];
      for (const update of updates) {
        const updated = await service.updateItem(update.id, update.data);
        results.push(updated);
      }
      return results;
    },

    deleteItem: async (id: string) => {
      data = loadData();
      const index = data.findIndex((item: T) => (item as Record<string, unknown>).id === id);
      if (index === -1) throw new Error('Item not found');

      const item = data[index];
      
      if (hooks.beforeDelete) {
        const canDelete = await hooks.beforeDelete(id, item);
        if (!canDelete) {
          throw new Error('Delete operation cancelled by hook');
        }
      }

      data.splice(index, 1);
      saveData(data);

      if (hooks.afterDelete) {
        await hooks.afterDelete(id);
      }
    },

    bulkDelete: async (ids: string[]) => {
      for (const id of ids) {
        await service.deleteItem(id);
      }
    },

    backup: async () => {
      data = loadData();
      return JSON.stringify({
        entityName,
        timestamp: new Date().toISOString(),
        data
      });
    },

    restore: async (backupData: string) => {
      try {
        const backup = JSON.parse(backupData);
        if (backup.entityName !== entityName) {
          throw new Error('Backup entity mismatch');
        }
        data = backup.data;
        saveData(data);
      } catch {
        throw new Error('Invalid backup data');
      }
    },

    getStats: async () => {
      data = loadData();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const createdToday = data.filter(item => {
        const createdAt = (item as Record<string, unknown>).createdAt;
        if (!createdAt) return false;
        const itemDate = new Date(createdAt as string);
        return itemDate >= today;
      }).length;

      const updatedToday = data.filter(item => {
        const updatedAt = (item as Record<string, unknown>).updatedAt;
        if (!updatedAt) return false;
        const itemDate = new Date(updatedAt as string);
        return itemDate >= today;
      }).length;

      const sortedByCreated = [...data].sort((a, b) => {
        const aDate = new Date((a as Record<string, unknown>).createdAt as string);
        const bDate = new Date((b as Record<string, unknown>).createdAt as string);
        return bDate.getTime() - aDate.getTime();
      });

      const sortedByUpdated = [...data].sort((a, b) => {
        const aDate = new Date((a as Record<string, unknown>).updatedAt as string);
        const bDate = new Date((b as Record<string, unknown>).updatedAt as string);
        return bDate.getTime() - aDate.getTime();
      });

      return {
        total: data.length,
        createdToday,
        updatedToday,
        lastCreated: sortedByCreated[0],
        lastUpdated: sortedByUpdated[0]
      };
    }
  };

  return service;
}

export class AdminCrudService<T extends Record<string, unknown>> extends BaseServiceImpl<T, T> {
  protected endpoints: ResourceEndpoints;

  constructor(baseEndpoint: string) {
    super();
    this.endpoints = {
      base: baseEndpoint,
      list: (qs: string) => `${baseEndpoint}${qs ? `?${qs}` : ''}`,
      create: baseEndpoint,
      detail: (slug: string) => `${baseEndpoint}/${slug}`,
      update: (slug: string) => `${baseEndpoint}/${slug}`,
      delete: (slug: string) => `${baseEndpoint}/${slug}`,
    };
  }

  protected serializeParams(filter: Filter): string {
    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return params.toString();
  }

  async fetchItems(filters?: Record<string, string | number | undefined>): Promise<{ data: T[]; meta?: { total: number; totalPages: number; page?: number; limit?: number } }> {
    try {
      const response = await this.list(filters || {});
      return {
        data: response.data,
        meta: {
          total: response.total,
          totalPages: response.limit ? Math.ceil(response.total / response.limit) : 1,
          page: response.page,
          limit: response.limit
        },
      };
    } catch (error) {
      console.error('AdminCrudService.fetchItems error:', error);
      throw error;
    }
  }

  async createItem(data: T): Promise<T> {
    try {
      const response = await this.create(data);
      return response.data || data;
    } catch (error) {
      console.error('AdminCrudService.createItem error:', error);
      throw error;
    }
  }

  async updateItem(id: string, data: Partial<T>): Promise<T> {
    try {
      const response = await this.update(id, data as T);
      return response.data || (data as T);
    } catch (error) {
      console.error('AdminCrudService.updateItem error:', error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    await this.fetchData(this.endpoints.delete(id), {
      method: 'DELETE',
      credentials: 'include',
    });
  }
}

export function createApiService<T extends Record<string, unknown>>(
  baseUrl: string
): CrudService<T> {
  const service = new AdminCrudService<T>(baseUrl);

  return {
    fetchItems: (filters?: Record<string, string | number | undefined>) => {
      return service.fetchItems(filters);
    },
    createItem: (data: T) => service.createItem(data),
    updateItem: (id: string, data: Partial<T>) => service.updateItem(id, data),
    deleteItem: (id: string) => service.deleteItem(id),
  };
}

// --- BREADCRUMB ADMIN CENTRAL ---
export interface AdminBreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  emoji?: string;
}

const adminRoot = { label: 'Tableau de bord', href: '/admin', icon: Icons.dashboard };

function getEntityFromPath(segments: string[]) {
  return getRegisteredAdminEntities().find(e => segments.includes(e.path));
}

function getSubPageLabel(segment: string) {
  if (segment === 'create') return 'Créer';
  if (segment === 'edit') return 'Modifier';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * Génère la config du breadcrumb admin à partir du pathname
 */
export function getAdminBreadcrumbConfig(pathname: string): AdminBreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: AdminBreadcrumbItem[] = [];

  // Racine admin
  breadcrumbs.push({ label: adminRoot.label, href: adminRoot.href, icon: adminRoot.icon });

  // Entité admin (ex: categories, routes...)
  const entity = getEntityFromPath(segments);
  if (entity) {
    const config = entity.config as { title?: string; icon?: unknown };
    breadcrumbs.push({
      label: config.title || entity.path,
      href: entity.href,
      icon: (typeof config.icon === 'function' && (config.icon.prototype?.isReactComponent || String(config.icon).includes('return React.createElement'))) ? config.icon as React.ComponentType<{ className?: string }> : undefined,
      emoji: typeof config.icon === 'string' ? config.icon : undefined,
    });
  }

  // Sous-page (ex: /admin/categories/create)
  const last = segments[segments.length - 1];
  if (last && entity && last !== entity.path) {
    // Si c'est un id (UUID ou nombre), on affiche "Détail" ou rien
    if (/^\d+$/.test(last) || /^[0-9a-fA-F-]{8,}$/.test(last)) {
      breadcrumbs.push({ label: 'Détail' });
    } else if (['create', 'edit'].includes(last)) {
      breadcrumbs.push({ label: getSubPageLabel(last) });
    } else {
      breadcrumbs.push({ label: getSubPageLabel(last) });
    }
  }

  return breadcrumbs;
}

// --- REGISTRE GLOBAL DES ENTITÉS ADMIN ---
export interface RegisteredAdminEntity {
  path: string;
  config: unknown;
  href: string;
  icon?: string;
  menuOrder?: number;
}

const AdminEntityRegistry: RegisteredAdminEntity[] = [];

export function registerAdminEntity(path: string, config: unknown, href: string, icon?: string, menuOrder?: number) {
  if (!AdminEntityRegistry.some(e => e.path === path)) {
    AdminEntityRegistry.push({ path, config, href, icon, menuOrder });
  }
}

export function getRegisteredAdminEntities() {
  return AdminEntityRegistry;
}

// Utilitaires pour la génération de données factices
export const mockDataGenerators = {
  id: () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  name: () => {
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Diana Davis', 'Frank Miller', 'Grace Wilson'];
    return names[Math.floor(Math.random() * names.length)];
  },
  
  email: () => {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const name = mockDataGenerators.name().toLowerCase().replace(' ', '.');
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${name}@${domain}`;
  },
  
  phone: () => {
    return `+33 ${Math.floor(100000000 + Math.random() * 900000000)}`;
  },
  
  address: () => {
    const streets = ['Rue de la Paix', 'Avenue des Champs', 'Boulevard Saint-Germain', 'Place de la République'];
    const numbers = Math.floor(1 + Math.random() * 999);
    const street = streets[Math.floor(Math.random() * streets.length)];
    return `${numbers} ${street}`;
  },
  
  city: () => {
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier'];
    return cities[Math.floor(Math.random() * cities.length)];
  },
  
  price: (min = 10, max = 1000) => {
    return Math.floor(min + Math.random() * (max - min));
  },
  
  description: () => {
    const descriptions = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  },
  
  status: () => {
    const statuses = ['active', 'inactive', 'pending', 'completed'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  },
  
  date: (daysBack = 30) => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
    return pastDate.toISOString();
  },
  
  boolean: () => Math.random() > 0.5,
  
  category: () => {
    const categories = ['Technology', 'Health', 'Education', 'Finance', 'Travel', 'Food', 'Sports', 'Entertainment'];
    return categories[Math.floor(Math.random() * categories.length)];
  },
  
  image: () => {
    const width = 400 + Math.floor(Math.random() * 400);
    const height = 300 + Math.floor(Math.random() * 300);
    return `https://picsum.photos/${width}/${height}`;
  },
  
  url: () => {
    const domains = ['example.com', 'test.org', 'demo.net', 'sample.io'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `https://www.${domain}`;
  }
};

export function createMockDataGenerator<T extends Record<string, unknown>>(
  template: Partial<Record<keyof T, () => unknown>>
): () => T {
  return () => {
    const generated = {} as T;
    
    for (const [key, generator] of Object.entries(template)) {
      if (typeof generator === 'function') {
        (generated as Record<string, unknown>)[key] = generator();
      }
    }
    
    // Ajout automatique des champs communs
    if (!generated.id) {
      (generated as Record<string, unknown>).id = mockDataGenerators.id();
    }
    if (!generated.createdAt) {
      (generated as Record<string, unknown>).createdAt = mockDataGenerators.date();
    }
    if (!generated.updatedAt) {
      (generated as Record<string, unknown>).updatedAt = mockDataGenerators.date();
    }
    
    return generated;
  };
}

// Fonction helper pour créer un service mock avec génération automatique
export function createEnhancedMockService<T extends Record<string, unknown>>(
  entityName: string,
  dataGenerator?: () => T,
  count = 10,
  options: Omit<MockServiceOptions<T>, 'autoGenerateData'> = {}
): ExtendedCrudService<T> {
  return createMockService<T>([], {
    ...options,
    entityName,
    autoGenerateData: dataGenerator ? {
      enabled: true,
      count,
      generator: dataGenerator
    } : undefined
  });
}