"use client";
import { useState } from "react";
import { Button } from "@/shared/components/atoms/ui/button";
import { useGroupeJoinMock } from '@/features/groupe/hooks/use-groupe-join-mock';
import { useGroupeQuitMock } from '@/features/groupe/hooks/use-groupe-quit-mock';

export function JoinGroupButton({ groupe }: { groupe: any }) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const { mutate: join, isPending, isSuccess, isError } = useGroupeJoinMock();
  const { mutate: quit, isPending: isQuitting, isSuccess: quitSuccess } = useGroupeQuitMock();

  // Simule l'état d'adhésion (à remplacer par la logique réelle)
  const isMember = Array.isArray(groupe.membres) && groupe.membres.includes('Utilisateur courant');

  const handleJoin = () => {
    join(groupe.id, {
      onSuccess: () => setFeedback('Vous avez rejoint le groupe !'),
      onError: () => setFeedback('Erreur lors de la demande d’adhésion'),
    });
  };

  const handleQuit = () => {
    quit(groupe.id, {
      onSuccess: () => setFeedback('Vous avez quitté le groupe.'),
      onError: () => setFeedback('Erreur lors de la sortie du groupe'),
    });
  };

  if (isMember && !isQuitting) {
    return (
      <div className="my-4 flex flex-col gap-2">
        <div className="text-green-600 font-semibold">Vous êtes membre de ce groupe.</div>
        <Button onClick={handleQuit} disabled={isQuitting} variant="destructive" aria-label="Quitter le groupe">
          {isQuitting ? 'Sortie en cours...' : 'Quitter le groupe'}
        </Button>
        {feedback && <div className="mt-2 text-green-600 text-sm">{feedback}</div>}
      </div>
    );
  }

  return (
    <div className="my-4">
      <Button onClick={handleJoin} disabled={isPending} aria-label="Rejoindre le groupe">
        {isPending ? "Adhésion en cours..." : "Rejoindre le groupe"}
      </Button>
      {feedback && <div className="mt-2 text-green-600 text-sm">{feedback}</div>}
      {isError && <div className="mt-2 text-red-600 text-sm">Erreur lors de la demande d’adhésion</div>}
    </div>
  );
}
