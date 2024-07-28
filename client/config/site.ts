export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'BitKart',
  description: 'Buy and Sell used items in your college campus',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Stationary',
      href: '/category/stationary',
    },
    {
      label: 'Bikes',
      href: '/category/bikes',
    },
    {
      label: 'Electronics',
      href: '/category/electronics',
    },
    {
      label: 'Hostel Essentials',
      href: '/category/hostel-essentials',
    },
    {
      label: 'Clothing',
      href: '/category/clothing',
    },
    {
      label: 'Shoes',
      href: '/category/shoes',
    },
    {
      label: 'Accessories',
      href: '/category/accessories',
    },
    {
      label: 'Beauty & Health',
      href: '/category/beauty-and-health',
    },
    {
      label: 'Sports',
      href: '/category/sports',
    },
    {
      label: 'Books & Notes',
      href: '/category/books-and-notes',
    },
    {
      label: 'Others',
      href: '/category/others',
    },
  ],
  navMenuItems: [
    {
      label: 'Profile',
      href: '/profile',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Projects',
      href: '/projects',
    },
    {
      label: 'Team',
      href: '/team',
    },
    {
      label: 'Calendar',
      href: '/calendar',
    },
    {
      label: 'Settings',
      href: '/settings',
    },
    {
      label: 'Help & Feedback',
      href: '/help-feedback',
    },
    {
      label: 'Logout',
      href: '/logout',
    },
  ],
  links: {
    github: 'https://github.com/nextui-org/nextui',
    mail: 'mailto:theshiveshanand@gmail.com',
  },
};
