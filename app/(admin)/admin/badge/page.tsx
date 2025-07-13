"use client";
import { badgeSchema } from '@/features/badge/badge.schema';
import { BadgeAdminConfig } from '@/features/badge/badge.admin-config';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function BadgeAdminPage() {
  return (
    <SimpleAdminPage
      config={BadgeAdminConfig}
      schema={badgeSchema}
    />
  );
}
