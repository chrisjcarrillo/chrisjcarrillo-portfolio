// Single source of truth for all site content.
// Edit this file to update the site — no component changes needed.
export const content = {
  alias: 'Chris',
  name: 'Chris Carrillo',
  tagline: ['A Miami Based', 'Creative & Software Engineer'],
  about: [
    "I'm Chris Carrillo — a Miami-based creative and software engineer.",
    'I design and build web apps, brand experiences, and the occasional terminal portfolio.',
  ],
  work: [
    {
      role: 'Senior Software Engineer',
      company: 'Placeholder Co',
      period: '2023 – present',
      summary: 'Lead frontend for a product used by thousands of users. Replace with real work.',
      highlights: [
        'Rebuilt the core dashboard, cutting load time ~40%.',
        'Led the migration to Next.js + TypeScript.',
        'Mentored a team of 3 engineers.',
      ],
      tags: ['Next.js', 'React', 'TypeScript'],
      link: 'https://example.com',
    },
    {
      role: 'Freelance Developer',
      company: 'Self-employed',
      period: '2020 – 2023',
      summary: 'Built marketing sites and web apps for Miami startups. Replace with real work.',
      highlights: [
        'Delivered 15+ client projects end-to-end.',
        'Set up CI/CD and analytics for small teams.',
      ],
      tags: ['React', 'Node', 'Design'],
      link: 'https://example.com',
    },
  ],
  projects: [
    {
      name: 'Terminal Portfolio',
      description: 'This site — an interactive terminal built with Next.js.',
      tags: ['Next.js', 'React', 'Tailwind'],
      link: 'https://github.com/chrisjcarrillo',
    },
    {
      name: 'Placeholder Project',
      description: 'Short description of a cool thing you built. Replace with a real project.',
      tags: ['React', 'Node'],
      link: 'https://example.com',
    },
  ],
  contact: {
    email: 'chrisjcarrillo@hotmail.com',
    linkedIn: 'https://www.linkedin.com/in/christopherjcarrillo/',
    instagram: 'https://www.instagram.com/chrisjcarrillo/',
    github: 'https://github.com/chrisjcarrillo',
  },
};

// ANSI Shadow figlet — "CHRIS CARRILLO". Lines must stay un-indented.
export const bannerFull = `
 ██████╗██╗  ██╗██████╗ ██╗███████╗     ██████╗ █████╗ ██████╗ ██████╗ ██╗██╗     ██╗      ██████╗
██╔════╝██║  ██║██╔══██╗██║██╔════╝    ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║██║     ██║     ██╔═══██╗
██║     ███████║██████╔╝██║███████╗    ██║     ███████║██████╔╝██████╔╝██║██║     ██║     ██║   ██║
██║     ██╔══██║██╔══██╗██║╚════██║    ██║     ██╔══██║██╔══██╗██╔══██╗██║██║     ██║     ██║   ██║
╚██████╗██║  ██║██║  ██║██║███████║    ╚██████╗██║  ██║██║  ██║██║  ██║██║███████╗███████╗╚██████╔╝
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝ ╚═════╝
`;

// ANSI Shadow figlet — "CHRIS" (mobile). Lines must stay un-indented.
export const bannerShort = `
 ██████╗██╗  ██╗██████╗ ██╗███████╗
██╔════╝██║  ██║██╔══██╗██║██╔════╝
██║     ███████║██████╔╝██║███████╗
██║     ██╔══██║██╔══██╗██║╚════██║
╚██████╗██║  ██║██║  ██║██║███████║
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
`;
