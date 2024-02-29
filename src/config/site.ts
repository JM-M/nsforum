export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'NSForum',
  description:
    'A forum for people interested in network societies and related concepts',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'All posts',
      href: '/posts',
    },
    {
      title: 'Categories',
      href: '/categories',
    },
  ],
  links: {
    twitter: 'https://twitter.com/zbeyens',
    github: 'https://github.com/udecode/plate',
    docs: 'https://platejs.org',
  },
};
