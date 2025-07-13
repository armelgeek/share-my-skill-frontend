"use client";
import { evenementSchema } from '@/features/evenement/evenement.schema';
import { EvenementAdminConfig } from '@/features/evenement/evenement.admin-config';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function EvenementAdminPage() {
  return (
    <SimpleAdminPage
      config={EvenementAdminConfig}
      schema={evenementSchema}
    />
  );
}
