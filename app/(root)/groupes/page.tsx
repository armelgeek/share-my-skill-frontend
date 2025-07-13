"use client";

import { useGroupe } from '@/features/groupe/hooks/use-groupe';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { Input } from '@/shared/components/atoms/ui/input';
import { useState, useMemo } from 'react';

export default function GroupesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useGroupe();

  const groupes = data ? data.data : [];
  const filteredGroupes = useMemo(() => {
    if (!search) return groupes;
    return groupes.filter(g =>
      g.nom?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, groupes]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return <div role="alert" className="text-red-500">{error.message}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Groupes & Communautés</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un groupe..."
          aria-label="Recherche groupe"
          className="w-full sm:w-80"
        />
        {/* Filtres avancés à ajouter ici */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredGroupes.map((groupe, idx) => (
          <Card key={idx} className="p-4 flex flex-col h-full" aria-label={`Groupe ${groupe.nom}`}> 
            <h2 className="text-lg font-semibold mb-2">{groupe.nom}</h2>
            <p className="text-sm text-muted-foreground mb-2">{groupe.description}</p>
            <div className="mt-auto text-xs text-muted-foreground">
              Membres : {groupe.membres ? groupe.membres.length : 0}
            </div>
          </Card>
        ))}
      </div>
      {/* Pagination à ajouter si besoin, selon le service */}
    </div>
  );
}
