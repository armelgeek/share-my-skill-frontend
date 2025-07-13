"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/atoms/ui/button';
import { AppLogo } from '@/shared/components/atoms/app-logo';

export function Sidebar() {
  const router = useRouter();
  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-background border-r px-4 py-6" aria-label="Navigation latérale">
      <div className="mb-8 flex items-center justify-center">
        <AppLogo />
      </div>
      <nav className="flex flex-col gap-2">
        <Button variant="ghost" onClick={() => router.push('/')}>Accueil</Button>
        <Button variant="ghost" onClick={() => router.push('/ateliers')}>Ateliers</Button>
        <Button variant="ghost" onClick={() => router.push('/groupes')}>Groupes</Button>
        <Button variant="ghost" onClick={() => router.push('/ressources')}>Ressources</Button>
        <Button variant="ghost" onClick={() => router.push('/messages')}>Messagerie</Button>
        <Button variant="ghost" onClick={() => router.push('/account/badges')}>Badges</Button>
        <Button variant="ghost" onClick={() => router.push('/account/feedback')}>Feedback</Button>
      </nav>
    </aside>
  );
}
