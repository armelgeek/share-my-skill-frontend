import { AtelierAdminConfig } from './atelier/atelier.admin-config';
import { MessageAdminConfig } from './message/message.admin-config';
import { RessourceAdminConfig } from './ressource/ressource.admin-config';
import { BadgeAdminConfig } from './badge/badge.admin-config';
import { CommentaireAdminConfig } from './commentaire/commentaire.admin-config';
import { EvenementAdminConfig } from './evenement/evenement.admin-config';
import { FormationAdminConfig } from './formation/formation.admin-config';
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
  {
    path: 'badge',
    href: '/admin/badge',
    config: BadgeAdminConfig,
    menuOrder: 5,
  },
  {
    path: 'commentaire',
    href: '/admin/commentaire',
    config: CommentaireAdminConfig,
    menuOrder: 6,
  },
  {
    path: 'evenement',
    href: '/admin/evenement',
    config: EvenementAdminConfig,
    menuOrder: 7,
  },
  {
    path: 'formation',
    href: '/admin/formation',
    config: FormationAdminConfig,
    menuOrder: 8,
  },
  // ...autres entités admin
];
