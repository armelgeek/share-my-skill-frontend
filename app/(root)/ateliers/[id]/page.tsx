"use client";

import { useParams } from 'next/navigation';
import { useAtelier } from '@/features/atelier/hooks/use-atelier';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { Button } from '@/shared/components/atoms/ui/button';
import { useState } from 'react';
import { useCommentaire } from '@/features/commentaire/hooks/use-commentaire';
import { Input } from '@/shared/components/atoms/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const commentaireSchema = z.object({
  contenu: z.string().min(1, 'Le commentaire est requis'),
});

type CommentaireForm = z.infer<typeof commentaireSchema>;

export default function AtelierDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useAtelier();
  const atelier = Array.isArray(data) ? data.find(a => a.id === id) : data;

  const { data: allCommentaires, isLoading: loadingComments } = useCommentaire();
  const commentaires = Array.isArray(allCommentaires)
    ? allCommentaires.filter(c => c.atelierId === id)
    : [];
  const [inscrit, setInscrit] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<CommentaireForm>({
    resolver: zodResolver(commentaireSchema),
    mode: 'onChange',
  });

  const onSubmit = async (values: CommentaireForm) => {
    // TODO: brancher sur l'API commentaire
    reset();
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error || !atelier) {
    return <div role="alert" className="text-red-500">Atelier introuvable</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{atelier.titre}</h1>
        <p className="text-muted-foreground mb-2">Formateur : {atelier.animateur}</p>
        <p className="mb-2">{atelier.description}</p>
        <div className="text-sm text-muted-foreground mb-2">Date : {atelier.date}</div>
        {/* Lieu à ajouter si présent dans le schéma */}
        <Button
          className="mt-4"
          onClick={() => setInscrit(true)}
          aria-label="S'inscrire à l'atelier"
          disabled={inscrit}
        >
          {inscrit ? "Inscrit !" : "S'inscrire"}
        </Button>
      </Card>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Commentaires</h2>
        {loadingComments ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="space-y-4 mb-6">
            {Array.isArray(commentaires) && commentaires.length > 0 ? (
              commentaires.map((c, idx) => (
                <Card key={idx} className="p-3">
                  <div className="text-sm">{c.contenu}</div>
                  <div className="text-xs text-muted-foreground mt-1">Par {c.auteur} le {c.date}</div>
                </Card>
              ))
            ) : (
              <div className="text-muted-foreground">Aucun commentaire pour cet atelier.</div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Input
            {...register('contenu')}
            placeholder="Ajouter un commentaire..."
            aria-label="Ajouter un commentaire"
            className="w-full"
          />
          {formState.errors.contenu && (
            <span className="text-xs text-red-500">{formState.errors.contenu.message}</span>
          )}
          <Button type="submit" className="self-end">Envoyer</Button>
        </form>
      </section>
    </div>
  );
}
