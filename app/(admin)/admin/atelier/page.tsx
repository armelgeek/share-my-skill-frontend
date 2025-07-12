"use client"
import { atelierSchema } from '@/features/atelier/atelier.schema';
import { AtelierAdminConfig } from '@/features/atelier/atelier.admin-config';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function AtelierAdminPage() {
  return (
    <SimpleAdminPage
      config={AtelierAdminConfig}
      schema={atelierSchema}
    />
  );
}
