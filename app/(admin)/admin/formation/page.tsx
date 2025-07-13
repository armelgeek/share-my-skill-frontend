"use client";
import { formationSchema } from '@/features/formation/formation.schema';
import { FormationAdminConfig } from '@/features/formation/formation.admin-config';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function FormationAdminPage() {
  return (
    <SimpleAdminPage
      config={FormationAdminConfig}
      schema={formationSchema}
    />
  );
}
