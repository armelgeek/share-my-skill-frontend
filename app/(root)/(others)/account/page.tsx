
"use client";

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUser } from '@/features/user/hooks/use-user';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { EditableProfilePhotoForm } from '@/shared/components/atoms/editable-profile-photo-form';
import { PersonalInfoForm } from '@/shared/components/user/personal-info-form';

export default function AccountPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data, isLoading, error } = useUser();

  if (isAuthLoading || isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return <div role="alert" className="text-red-500">{error.message}</div>;
  }

  // On suppose que data est un tableau d'utilisateurs, on prend le premier ou l'utilisateur courant
  const currentUser = Array.isArray(data) ? data[0] : data;

  if (!currentUser) {
    return <div>Aucun utilisateur trouvé.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>
      <EditableProfilePhotoForm photoUrl={currentUser.avatar} />
      <div className="mt-6">
        <PersonalInfoForm user={{
          firstName: currentUser.name?.split(' ')[0] || '',
          lastName: currentUser.name?.split(' ').slice(1).join(' ') || '',
          email: currentUser.email,
          phone: currentUser.phone || '',
          birthDate: currentUser.birthDate || '',
          address: {
            street: currentUser.address?.street || '',
            city: currentUser.address?.city || '',
            zipCode: currentUser.address?.zipCode || '',
            country: currentUser.address?.country || '',
          },
        }} />
      </div>
    </div>
  );
}
