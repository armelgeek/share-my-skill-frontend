"use client";
import { messageSchema } from '@/features/message/message.schema';
import { MessageAdminConfig } from '@/features/message/message.admin-config';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function MessageAdminPage() {
  return (
    <SimpleAdminPage
      config={MessageAdminConfig}
      schema={messageSchema}
    />
  );
}
