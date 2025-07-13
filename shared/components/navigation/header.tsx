"use client";

import { AppLogo } from '@/shared/components/atoms/app-logo';
import { Button } from '@/shared/components/atoms/ui/button';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-background border-b">
      <div className="flex items-center gap-4">
        <AppLogo />
        <nav aria-label="Menu principal" className="hidden md:flex gap-6">
          <Button variant="ghost" onClick={() => router.push('/')}>Accueil</Button>
          <Button variant="ghost" onClick={() => router.push('/ateliers')}>Ateliers</Button>
          <Button variant="ghost" onClick={() => router.push('/groupes')}>Groupes</Button>
          <Button variant="ghost" onClick={() => router.push('/ressources')}>Ressources</Button>
          <Button variant="ghost" onClick={() => router.push('/messages')}>Messagerie</Button>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {/* Actions utilisateur (profil, notifications, etc.) */}
        <Button variant="outline" onClick={() => router.push('/account')}>Mon compte</Button>
      </div>
    </header>
  );
}
