"use client";

import { useEffect, useState } from 'react';
import AppSidebar from '@/shared/layout/admin/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/shared/components/atoms/ui/sidebar';
import { Separator } from '@/shared/components/atoms/ui/separator';
import { AdminBreadcrumb } from '@/shared/components/molecules/layout/admin-breadcrumb';
import { HeaderUserProfile } from '@/shared/components/molecules/layout/header-user-profile';
import { authClient } from '@/shared/lib/config/auth-client';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';

type SessionType = {
  user?: {
    name?: string;
    email?: string;
    image?: string | null;
  };
} | null;

interface AdminLayoutClientProps {
  readonly children: React.ReactNode;
  defaultOpen?: boolean;
}

// Helper pour vérifier si l'utilisateur est admin (à adapter selon ton modèle)
function isAdmin(session: SessionType): boolean {
  // Ex : vérifier un champ role ou email
  // return session?.user?.role === 'admin';
  // Pour démo, autorise tout le monde
  return !!session?.user;
}

export default function AdminLayoutClient({ children, defaultOpen = true }: AdminLayoutClientProps) {
  const [session, setSession] = useState<SessionType>(null);
  const [loading, setLoading] = useState(false);
  const [permissionError, setPermissionError] = useState(true);


  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar session={session} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-gray-200">
          <div className="flex items-center gap-2 px-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AdminBreadcrumb />
          </div>
          <div className="flex items-center gap-2 px-4">
            {session?.user && <HeaderUserProfile user={session.user} />}
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-4'>
          <div className="space-y-6 px-3">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
