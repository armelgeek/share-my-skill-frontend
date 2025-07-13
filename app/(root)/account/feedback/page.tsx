"use client";

import { useCommentaire } from '@/features/commentaire/hooks/use-commentaire';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { Input } from '@/shared/components/atoms/ui/input';
import { useState, useMemo } from 'react';

export default function FeedbackPage() {
  const { data, isLoading, error } = useCommentaire();
  const [search, setSearch] = useState('');
  const commentaires = Array.isArray(data) ? data : [];

  // Séparation reçus/donnés (mock: auteur = user pour donnés, destinataire = user pour reçus)
  const userId = 'currentUser'; // À remplacer par l'id réel de l'utilisateur connecté
  const commentairesRecus = useMemo(() => commentaires.filter(c => c.destinataireId === userId), [commentaires]);
  const commentairesDonnes = useMemo(() => commentaires.filter(c => c.auteurId === userId), [commentaires]);

  const filteredRecus = useMemo(() => {
    if (!search) return commentairesRecus;
    return commentairesRecus.filter(c =>
      c.auteur?.toLowerCase().includes(search.toLowerCase()) ||
      c.contenu?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, commentairesRecus]);

  const filteredDonnes = useMemo(() => {
    if (!search) return commentairesDonnes;
    return commentairesDonnes.filter(c =>
      c.destinataire?.toLowerCase().includes(search.toLowerCase()) ||
      c.contenu?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, commentairesDonnes]);

  const [tab, setTab] = useState<'recus' | 'donnes'>('recus');

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return <div role="alert" className="text-red-500">{error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Feedback & Commentaires</h1>
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${tab === 'recus' ? 'bg-primary text-white' : 'bg-muted'}`}
          onClick={() => setTab('recus')}
          aria-label="Commentaires reçus"
        >
          Reçus
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'donnes' ? 'bg-primary text-white' : 'bg-muted'}`}
          onClick={() => setTab('donnes')}
          aria-label="Commentaires donnés"
        >
          Donnés
        </button>
        <Input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher..."
          aria-label="Recherche commentaire"
          className="w-full max-w-xs ml-auto"
        />
      </div>
      <div className="space-y-4">
        {(tab === 'recus' ? filteredRecus : filteredDonnes).map((c, idx) => (
          <Card key={idx} className="p-4 flex flex-col" aria-label={`Commentaire ${tab === 'recus' ? c.auteur : c.destinataire}`}> 
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{tab === 'recus' ? c.auteur : c.destinataire}</span>
              <span className="text-xs text-muted-foreground">{c.date}</span>
              {c.note && <span className="ml-2 text-yellow-500">Note : {c.note}/5</span>}
            </div>
            <div className="text-sm">{c.contenu}</div>
          </Card>
        ))}
        {(tab === 'recus' ? filteredRecus : filteredDonnes).length === 0 && (
          <div className="text-muted-foreground">Aucun commentaire.</div>
        )}
      </div>
    </div>
  );
}
