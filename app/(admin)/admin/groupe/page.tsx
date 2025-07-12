"use client";

import { GroupeAdminConfig } from '@/features/groupe/groupe.admin-config';
import { groupeSchema } from '@/features/groupe/groupe.schema';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function GroupeAdminPage() {
  return (
    <SimpleAdminPage
      config={GroupeAdminConfig}
      schema={groupeSchema}
    />
  );
}
