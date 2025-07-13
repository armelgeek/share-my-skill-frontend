"use client";

import { useAtelier } from '@/features/atelier/hooks/use-atelier';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { Input } from '@/shared/components/atoms/ui/input';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function AteliersCataloguePage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useAtelier();

  const ateliers = data ? data.data : [];
  const filteredAteliers = useMemo(() => {
    if (!search) return ateliers;
    return ateliers.filter(a =>
      a.titre?.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase()) ||
      a.animateur?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, ateliers]);
  console.log('data', data);
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return <div role="alert" className="text-red-500">{error.message}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Catalogue des ateliers</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un atelier..."
          aria-label="Recherche atelier"
          className="w-full sm:w-80"
        />
        {/* Filtres avancés à ajouter ici */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAteliers.map((atelier, idx) => (
          <Link key={atelier.id} href={`/ateliers/${atelier.id}`} passHref legacyBehavior>
            <Card className="p-4 flex flex-col h-full cursor-pointer hover:shadow-lg transition" aria-label={`Atelier ${atelier.titre}`}> 
              <h2 className="text-lg font-semibold mb-2">{atelier.titre}</h2>
              <p className="text-sm text-muted-foreground mb-2">{atelier.animateur}</p>
              <p className="text-sm mb-4">{atelier.description}</p>
              <div className="mt-auto text-xs text-muted-foreground">{atelier.date}</div>
            </Card>
          </Link>
        ))}
      </div>
      {/* Pagination à ajouter si besoin, selon le service */}
    </div>
  );
}
