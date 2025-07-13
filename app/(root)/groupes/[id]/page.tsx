"use client";

import { useParams } from 'next/navigation';
import { useGroupe } from '@/features/groupe/hooks/use-groupe';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { Button } from '@/shared/components/atoms/ui/button';
import { Input } from '@/shared/components/atoms/ui/input';
import { useState } from 'react';
import { useMessage } from '@/features/message/hooks/use-message';
import { useRessource } from '@/features/ressource/hooks/use-ressource';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const messageSchema = z.object({
  contenu: z.string().min(1, 'Le message est requis'),
});

type MessageForm = z.infer<typeof messageSchema>;

export default function GroupeDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGroupe();
  const groupe = Array.isArray(data) ? data.find(g => g.id === id) : data;

  const { data: allMessages, isLoading: loadingMessages } = useMessage();
  const messages = Array.isArray(allMessages) ? allMessages.filter(m => m.groupeId === id) : [];

  const { data: allRessources, isLoading: loadingRessources } = useRessource();
  const ressources = Array.isArray(allRessources) ? allRessources.filter(r => r.groupeId === id) : [];

  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    mode: 'onChange',
  });

  const onSubmit = async (values: MessageForm) => {
    setSending(true);
    // TODO: brancher sur l'API message
    reset();
    setSending(false);
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error || !groupe) {
    return <div role="alert" className="text-red-500">Groupe introuvable</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{groupe.nom}</h1>
        <p className="text-muted-foreground mb-2">Thème : {groupe.theme}</p>
        <p className="mb-2">{groupe.description}</p>
        <div className="text-sm text-muted-foreground mb-2">Membres : {groupe.nbMembres}</div>
        {/* Liste des membres */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Membres</h2>
          <div className="flex flex-wrap gap-4">
            {Array.isArray(groupe.membres) && groupe.membres.length > 0 ? (
              (groupe.membres as Array<{ nom: string; role: string }> | undefined)?.map((membre: { nom: string; role: string }, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  {/* Avatar à ajouter si disponible */}
                  <span className="font-medium">{membre.nom}</span>
                  <span className="text-xs text-muted-foreground">{membre.role}</span>
                </div>
              ))
            ) : (
              <span className="text-muted-foreground">Aucun membre</span>
            )}
          </div>
        </div>
      </Card>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Discussions</h2>
        {loadingMessages ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="space-y-4 mb-6">
            {messages.length > 0 ? (
              messages.map((m, idx) => (
                <Card key={idx} className="p-3">
                  <div className="text-sm">{m.contenu}</div>
                  <div className="text-xs text-muted-foreground mt-1">Par {m.auteur} le {m.date}</div>
                </Card>
              ))
            ) : (
              <div className="text-muted-foreground">Aucune discussion pour ce groupe.</div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Input
            {...register('contenu')}
            placeholder="Ajouter un message..."
            aria-label="Ajouter un message"
            className="w-full"
            disabled={sending}
          />
          {formState.errors.contenu && (
            <span className="text-xs text-red-500">{formState.errors.contenu.message}</span>
          )}
          <Button type="submit" className="self-end" disabled={sending}>Envoyer</Button>
        </form>
      </section>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Ressources partagées</h2>
        {loadingRessources ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="space-y-4 mb-6">
            {ressources.length > 0 ? (
              ressources.map((r, idx) => (
                <Card key={idx} className="p-3">
                  <div className="text-sm">{r.titre}</div>
                  <div className="text-xs text-muted-foreground mt-1">Type : {r.type}</div>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Ouvrir</a>
                </Card>
              ))
            ) : (
              <div className="text-muted-foreground">Aucune ressource partagée.</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
