"use client";

import { useBadge } from '@/features/badge/hooks/use-badge';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { useState, useMemo } from 'react';

export default function BadgesPage() {
  const { data, isLoading, error } = useBadge();
  const badges = data ? data.data : [];

  // Séparation badges obtenus / en cours
  // Remplacez 'status' par une propriété existante, par exemple 'couleur'
  const badgesObtenus = useMemo(() => badges.filter(b => b.couleur === 'obtained'), [badges]);
  const badgesEnCours = useMemo(() => badges.filter(b => b.couleur === 'in_progress'), [badges]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return <div role="alert" className="text-red-500">{error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Mes badges & certifications</h1>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Badges obtenus</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {badgesObtenus.length > 0 ? badgesObtenus.map((badge, idx) => (
            <Card key={idx} className="p-4 flex flex-col items-center text-center" aria-label={`Badge ${badge.nom}`}> 
              {/* Icône à ajouter si disponible */}
              <span className="text-3xl mb-2">{badge.icone ?? '🏅'}</span>
              <h3 className="text-lg font-semibold mb-1">{badge.nom}</h3>
              <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
              {/* Ajoutez ici une propriété existante si vous souhaitez afficher une info supplémentaire */}
            </Card>
          )) : <div className="text-muted-foreground">Aucun badge obtenu.</div>}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-4">Badges en cours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {badgesEnCours.length > 0 ? badgesEnCours.map((badge, idx) => (
            <Card key={idx} className="p-4 flex flex-col items-center text-center" aria-label={`Badge ${badge.nom}`}> 
              {/* Icône à ajouter si disponible */}
              <span className="text-3xl mb-2">{badge.icone ?? '🔄'}</span>
              <h3 className="text-lg font-semibold mb-1">{badge.nom}</h3>
              <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
              <span className="text-xs text-yellow-600">
                En cours
              </span>
            </Card>
          )) : <div className="text-muted-foreground">Aucun badge en cours.</div>}
        </div>
      </section>
    </div>
  );
}
