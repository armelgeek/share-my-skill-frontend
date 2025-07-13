"use client";

import { useMessage } from '@/features/message/hooks/use-message';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { Input } from '@/shared/components/atoms/ui/input';
import { Button } from '@/shared/components/atoms/ui/button';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const messageSchema = z.object({
  contenu: z.string().min(1, 'Le message est requis'),
});

type MessageForm = z.infer<typeof messageSchema>;

export default function MessagesPage() {
  const { data, isLoading, error } = useMessage();
  type Conversation = {
    contenu: string;
    auteur: string;
    date: string;
    groupe?: string;
    messages?: Array<{ contenu: string; auteur: string; date: string }>;
  };

  const conversations: Conversation[] = data ? data.data : [];
  const [selectedConv, setSelectedConv] = useState<number | null>(null);
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

  if (error) {
    return <div role="alert" className="text-red-500">{error.message}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/3">
        <h1 className="text-2xl font-bold mb-6">Messagerie</h1>
        <div className="space-y-2">
          {conversations.map((conv, idx) => (
            <Card
              key={idx}
              className={`p-4 cursor-pointer flex items-center gap-3 ${selectedConv === idx ? 'bg-primary/10' : ''}`}
              aria-label={`Conversation avec ${conv.groupe ?? conv.auteur ?? 'Inconnu'}`}
              onClick={() => setSelectedConv(idx)}
            >
              {/* Avatar à ajouter si disponible */}
              <div className="flex-1">
                <div className="font-semibold">{conv.groupe ?? conv.auteur ?? 'Inconnu'}</div>
                <div className="text-xs text-muted-foreground">{conv.contenu}</div>
              </div>
              <div className="text-xs text-muted-foreground">{conv.date}</div>
              {/* Badge notification à ajouter si besoin */}
            </Card>
          ))}
        </div>
      </aside>
      <main className="w-full md:w-2/3">
        {selectedConv !== null ? (
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4">Conversation avec {conversations[selectedConv]?.groupe ?? conversations[selectedConv]?.auteur ?? 'Inconnu'}</h2>
            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
              {Array.isArray(conversations[selectedConv]?.messages) && conversations[selectedConv].messages.length > 0 ? (
                (conversations[selectedConv].messages as Array<{ contenu: string; auteur: string; date: string }> | undefined)?.map((msg: { contenu: string; auteur: string; date: string }, idx: number) => (
                  <Card key={idx} className="p-3">
                    <div className="text-sm">{msg.contenu}</div>
                    <div className="text-xs text-muted-foreground mt-1">Par {msg.auteur} le {msg.date}</div>
                  </Card>
                ))
              ) : (
                <div className="text-muted-foreground">Aucun message dans cette conversation.</div>
              )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <Input
                {...register('contenu')}
                placeholder="Votre message..."
                aria-label="Votre message"
                className="w-full"
                disabled={sending}
              />
              {formState.errors.contenu && (
                <span className="text-xs text-red-500">{formState.errors.contenu.message}</span>
              )}
              <Button type="submit" className="self-end" disabled={sending}>Envoyer</Button>
            </form>
          </div>
        ) : (
          <div className="text-muted-foreground">Sélectionnez une conversation pour afficher les messages.</div>
        )}
      </main>
    </div>
  );
}
