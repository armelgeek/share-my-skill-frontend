"use client";
import { useParams } from 'next/navigation';
import { useGroupe } from '@/features/groupe/hooks/use-groupe';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { Button } from '@/shared/components/atoms/ui/button';
import { Input } from '@/shared/components/atoms/ui/input';
import { useState, useEffect } from 'react';
import { useMessage } from '@/features/message/hooks/use-message';
import { useRessource } from '@/features/ressource/hooks/use-ressource';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JoinGroupButton } from './JoinGroupButton';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/atoms/ui/avatar';
import { toast } from 'react-hot-toast';

const messageSchema = z.object({
  contenu: z.string().min(1, 'Le message est requis'),
});

type MessageForm = z.infer<typeof messageSchema>;

export default function GroupeDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGroupe();
   const groupe = data ? data.data.find(g => g.id === id) : data;

  const { data: allMessages, isLoading: loadingMessages } = useMessage();
  const messages = allMessages ? allMessages.data : [];
 // const messages = allMessages ? allMessages.data.filter(m => m.groupe === id) : [];

  const { data: allRessources, isLoading: loadingRessources } = useRessource();
  const ressources = allRessources ? allRessources.data : [];
  //const ressources = allRessources ? allRessources.data.filter(r => r.auteur === id) : [];

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

  // Ajout du feedback global pour les actions groupe
  useEffect(() => {
    // On suppose que le composant JoinGroupButton met à jour le feedback via setFeedback
    // Ici, on peut écouter le feedback global si besoin
    // Exemple : toast.success('Action réussie') ou toast.error('Erreur')
    // À brancher sur les mutations si besoin
  }, []);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error || !groupe) {
    return <div role="alert" className="text-red-500">Groupe introuvable</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Link href="/groupes" aria-label="Retour à la liste des groupes">
          <button className="inline-flex items-center gap-2 px-3 py-1 rounded bg-muted hover:bg-primary/10 text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-primary">
            ← Retour
          </button>
        </Link>
      </div>
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{groupe.nom}</h1>
        {/* <p className="text-muted-foreground mb-2">Thème : {groupe.theme}</p> */}
        <p className="mb-2">{groupe.description}</p>
        <div className="text-sm text-muted-foreground mb-2">Membres : {Array.isArray(groupe.membres) ? groupe.membres.length : 0}</div>
        {/* Bouton rejoindre le groupe */}
        <JoinGroupButton groupe={groupe} />
        {/* Liste des membres */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Membres</h2>
          <div className="flex flex-wrap gap-4">
            {Array.isArray(groupe.membres) && groupe.membres.length > 0 ? (
              (groupe.membres as Array<any>).map((membre: any, idx: number) => {
                // If membre is a string, convert to object with default role
                const membreObj: { nom: string; role: string; avatarUrl?: string } =
                  typeof membre === 'string'
                    ? { nom: membre, role: 'Membre' }
                    : membre;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      {membreObj.avatarUrl ? (
                        <AvatarImage src={membreObj.avatarUrl} alt={membreObj.nom} />
                      ) : null}
                      <AvatarFallback>{membreObj.nom?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{membreObj.nom}</span>
                    <span className="text-xs text-muted-foreground">{membreObj.role}</span>
                  </div>
                );
              })
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
