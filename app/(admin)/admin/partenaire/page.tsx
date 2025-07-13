"use client";
import { partenaireSchema } from '@/features/partenaire/partenaire.schema';
import { PartenaireAdminConfig } from '@/features/partenaire/partenaire.admin-config';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function PartenaireAdminPage() {
  return (
    <SimpleAdminPage
      config={PartenaireAdminConfig}
      schema={partenaireSchema}
    />
  );
}
