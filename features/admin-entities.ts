import { AtelierAdminConfig } from './atelier/atelier.admin-config';
import { MessageAdminConfig } from './message/message.admin-config';
import { RessourceAdminConfig } from './ressource/ressource.admin-config';

export const adminEntities = [
  {
    path: 'atelier',
    href: '/admin/atelier',
    config: AtelierAdminConfig,
    menuOrder: 2,
  },
  {
    path: 'message',
    href: '/admin/message',
    config: MessageAdminConfig,
    menuOrder: 3,
  },
  {
    path: 'ressource',
    href: '/admin/ressource',
    config: RessourceAdminConfig,
    menuOrder: 4,
  },
  // ...autres entités admin
];
