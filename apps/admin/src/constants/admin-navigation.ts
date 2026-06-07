import {
  BadgeInfo,
  BookOpen,
  Building2,
  Clapperboard,
  GalleryHorizontalEnd,
  Globe2,
  ShieldAlert,
  Tags,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AdminNavItem = {
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
};

export const adminNavigation: AdminNavItem[] = [
  {
    label: 'Dashboard',
    description: 'Overview and activity',
    path: '/admin',
    icon: BadgeInfo,
  },
  {
    label: 'Users',
    description: 'Accounts, roles, and status',
    path: '/admin/users',
    icon: Users,
  },
  {
    label: 'Films',
    description: 'Movies and metadata',
    path: '/admin/films',
    icon: Clapperboard,
  },
  {
    label: 'Genres',
    description: 'Genre catalog',
    path: '/admin/genres',
    icon: BookOpen,
  },
  {
    label: 'Tags',
    description: 'Tag dictionary',
    path: '/admin/tags',
    icon: Tags,
  },
  {
    label: 'Countries',
    description: 'Production countries',
    path: '/admin/countries',
    icon: Globe2,
  },
  {
    label: 'Persons',
    description: 'Actors, directors, crew',
    path: '/admin/persons',
    icon: GalleryHorizontalEnd,
  },
  {
    label: 'Complaints',
    description: 'Reports and moderation actions',
    path: '/admin/complaints',
    icon: ShieldAlert,
  },
  {
    label: 'Moderation',
    description: 'Review and comment actions',
    path: '/admin/moderation',
    icon: Building2,
  },
];
