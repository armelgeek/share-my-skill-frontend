"use client";
import { ressourceSchema } from '@/features/ressource/ressource.schema';
import { RessourceAdminConfig } from '@/features/ressource/ressource.admin-config';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function RessourceAdminPage() {
  return (
    <SimpleAdminPage
      config={RessourceAdminConfig}
      schema={ressourceSchema}
    />
  );
}
