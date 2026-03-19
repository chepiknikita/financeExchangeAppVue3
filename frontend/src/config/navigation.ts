export interface NavItem {
  name: string;
  shortName?: string;
  path: string;
  icon: string;
}

export const navUser: NavItem[] = [
  { name: 'Главная', path: '/user', icon: 'mdi-home-outline' },
  { name: 'Биржа', path: '/assets', icon: 'mdi-trending-up' },
];

export const navAdmin: NavItem[] = [
  { name: 'Администрирование', shortName: 'Админ', path: '/admin', icon: 'mdi-cog-outline' },
];
