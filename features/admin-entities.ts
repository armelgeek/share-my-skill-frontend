import { AtelierAdminConfig } from './atelier/atelier.admin-config';

export const adminEntities = [
  {
    path: 'atelier',
    href: '/admin/atelier',
    config: AtelierAdminConfig,
    menuOrder: 2,
  },
  // ...autres entités admin
];
