"use client";
import { commentaireSchema } from '@/features/commentaire/commentaire.schema';
import { CommentaireAdminConfig } from '@/features/commentaire/commentaire.admin-config';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function CommentaireAdminPage() {
  return (
    <SimpleAdminPage
      config={CommentaireAdminConfig}
      schema={commentaireSchema}
    />
  );
}
