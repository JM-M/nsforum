export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Network Society Forum',
  description:
    'A forum for people interested in network societies and related concepts',
  navbar: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'All posts',
      href: '/posts',
    },
  ],
  links: {
    twitter: 'https://twitter.com/zbeyens',
    github: 'https://github.com/udecode/plate',
    docs: 'https://platejs.org',
  },
};
