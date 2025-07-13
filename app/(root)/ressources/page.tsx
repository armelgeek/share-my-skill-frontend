"use client";

import { useRessource } from '@/features/ressource/hooks/use-ressource';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { Input } from '@/shared/components/atoms/ui/input';
import { useState, useMemo } from 'react';

export default function RessourcesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useRessource();

  const ressources = data ? data.data : [];
  const filteredRessources = useMemo(() => {
    if (!search) return ressources;
    return ressources.filter(r =>
      r.titre?.toLowerCase().includes(search.toLowerCase()) ||
      r.type?.toLowerCase().includes(search.toLowerCase()) ||
      r.auteur?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, ressources]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return <div role="alert" className="text-red-500">{error.message}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Ressources partagées</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une ressource..."
          aria-label="Recherche ressource"
          className="w-full sm:w-80"
        />
        {/* Filtres avancés à ajouter ici */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRessources.map((ressource, idx) => (
          <Card key={idx} className="p-4 flex flex-col h-full" aria-label={`Ressource ${ressource.titre}`}> 
            <h2 className="text-lg font-semibold mb-2">{ressource.titre}</h2>
            <p className="text-sm text-muted-foreground mb-2">Type : {ressource.type}</p>
            <p className="text-sm mb-2">Auteur : {ressource.auteur}</p>
            <a href={ressource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline mt-auto">Ouvrir</a>
          </Card>
        ))}
      </div>
    </div>
  );
}
