"use client";

import { useBadge } from '@/features/badge/hooks/use-badge';
import { useMessage } from '@/features/message/hooks/use-message';
import { useCommentaire } from '@/features/commentaire/hooks/use-commentaire';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card } from '@/shared/components/atoms/ui/card';
import { Button } from '@/shared/components/atoms/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { data: badges, isLoading: loadingBadges } = useBadge();
  const { data: messages, isLoading: loadingMessages } = useMessage();
  const { data: feedbacks, isLoading: loadingFeedbacks } = useCommentaire();

  const isLoading = loadingBadges || loadingMessages || loadingFeedbacks;

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Mon tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-4 flex flex-col items-center text-center">
          <span className="text-3xl mb-2">🏅</span>
          <h2 className="text-lg font-semibold mb-1">Badges</h2>
          <p className="text-sm text-muted-foreground mb-2">{Array.isArray(badges) ? badges.length : 0} badges obtenus</p>
          <Button variant="outline" onClick={() => router.push('/account/badges')}>Voir mes badges</Button>
        </Card>
        <Card className="p-4 flex flex-col items-center text-center">
          <span className="text-3xl mb-2">💬</span>
          <h2 className="text-lg font-semibold mb-1">Messages</h2>
          <p className="text-sm text-muted-foreground mb-2">{Array.isArray(messages) ? messages.length : 0} conversations</p>
          <Button variant="outline" onClick={() => router.push('/messages')}>Accéder à la messagerie</Button>
        </Card>
        <Card className="p-4 flex flex-col items-center text-center">
          <span className="text-3xl mb-2">⭐</span>
          <h2 className="text-lg font-semibold mb-1">Feedback</h2>
          <p className="text-sm text-muted-foreground mb-2">{Array.isArray(feedbacks) ? feedbacks.length : 0} commentaires reçus</p>
          <Button variant="outline" onClick={() => router.push('/account/feedback')}>Voir le feedback</Button>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Accès rapide</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => router.push('/ateliers')}>Ateliers</Button>
            <Button variant="ghost" onClick={() => router.push('/groupes')}>Groupes</Button>
            <Button variant="ghost" onClick={() => router.push('/ressources')}>Ressources</Button>
            <Button variant="ghost" onClick={() => router.push('/account')}>Mon compte</Button>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Notifications récentes</h3>
          {/* Simuler notifications mock */}
          <ul className="space-y-2">
            <li className="text-sm">Vous avez reçu un nouveau badge !</li>
            <li className="text-sm">2 nouveaux messages dans vos conversations.</li>
            <li className="text-sm">Un nouvel atelier est disponible.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
