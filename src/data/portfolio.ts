export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  repo?: string;
};

export type SkillCategory = {
  title: string;
  skills: string[];
};

export type HistoryItem = {
  year: string;
  role: string;
  company: string;
  description: string;
};

export type Achievement = {
  title: string;
  description: string;
};

export type ContactInfo = {
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
};

// ------------------------------------------------------------------
// YOUR PORTFOLIO DATA GOES HERE
// You can edit this file to update the 3D world automatically!
// ------------------------------------------------------------------

export const PORTFOLIO_DATA = {
  about: "PIYUSH PUNERA\n\nExperience Engineer\n\nI don't build websites.\nI build experiences people remember.\n\nEvery project begins with a question:\n\"What if the browser could make someone stop, explore, and feel something?\"\n\nFrom intelligent AI platforms to cinematic WebGL worlds, I combine engineering, storytelling, and interaction to create digital experiences that blur the line between websites, games, and imagination.\n\nCurrently building AETHER — an original civilization where ideas become reality.",
  achievements: [
    { title: "Hackathon Winner", description: "First place in the global WebGL rendering challenge." },
    { title: "Awwwards Site of the Day", description: "Recognized for creative excellence in frontend architecture." },
    { title: "Open Source Contributor", description: "Active contributor to the React Three Fiber ecosystem." }
  ] as Achievement[],
  projects: [
    {
      id: 'aether',
      title: '01 — AETHER',
      description: 'A browser-native civilization. Cinematic intro, biomechanical world, blueprint mode, hoverboard mechanics.',
      techStack: ['React Three Fiber', 'Rapier Physics', 'Three.js'],
      repo: 'https://github.com/Piyush-031005/aether'
    },
    {
      id: 'specimen',
      title: '02 — SPECIMEN',
      description: 'A living digital organism. Procedural behaviour, neural evolution, mutation system that learns from the user.',
      techStack: ['WebGL', 'Procedural Animation', 'Web Audio API'],
    },
    {
      id: 'limbo',
      title: '03 — LIMBO',
      description: 'An experiment about memory and attention. Entropy mechanics and interactive philosophy.',
      techStack: ['TypeScript', 'Three.js', 'State Architecture'],
    },
    {
      id: 'cognify',
      title: '04 — Cognify',
      description: 'Universal Cognitive Intelligence Platform. AI that understands how students learn, featuring behavior analysis and knowledge graphs.',
      techStack: ['AI', 'Data Visualization', 'Full-Stack'],
    },
    {
      id: 'healconnect',
      title: '05 — HealConnect',
      description: 'Human-centered healthcare communication. AI communication and medical workflow system.',
      techStack: ['React', 'Healthcare AI', 'UX Design'],
    },
    {
      id: 'shoeworld',
      title: '06 — Shoe World',
      description: 'A cinematic interactive product experience. Scroll-driven storytelling and interactive showroom.',
      techStack: ['Three.js', 'GSAP', 'React Three Fiber'],
    },
    {
      id: 'boncafe',
      title: '07 — BON Café',
      description: 'Luxury Brand Experience. Warm, editorial, premium café branding.',
      techStack: ['Frontend', 'Editorial UI', 'Motion'],
    },
    {
      id: 'reshot',
      title: '08 — Reshot',
      description: 'Creative Design Playground. Highly visual editorial layouts, creative transitions, and motion-heavy UI.',
      techStack: ['Framer Motion', 'React', 'CSS'],
    }
  ] as Project[],

  skills: [
    {
      title: 'Core Technologies',
      skills: ['TypeScript', 'JavaScript (ES6+)', 'React', 'Node.js', 'Next.js']
    },
    {
      title: 'Creative Coding & 3D',
      skills: ['Three.js', 'React Three Fiber', 'WebGL', 'GLSL Shaders', 'GSAP']
    },
    {
      title: 'Architecture & Physics',
      skills: ['Zustand', 'Rapier Physics', 'React Spring', 'Framer Motion']
    }
  ] as SkillCategory[],

  history: [
    {
      year: '2026 - Present',
      role: 'Creative Technologist',
      company: 'Freelance',
      description: 'Architecting immersive, highly interactive 3D web experiences pushing the boundaries of what browsers can render.'
    },
    {
      year: '2024 - 2026',
      role: 'Full-Stack Developer',
      company: 'Tech Agency',
      description: 'Built robust, scalable frontend architectures and engineered highly optimized React applications.'
    }
  ] as HistoryItem[],

  contact: {
    email: 'hello@yourdomain.com',
    github: 'https://github.com/Piyush-031005',
    linkedin: 'https://linkedin.com/in/piyush-punera',
    twitter: 'https://twitter.com/piyush'
  } as ContactInfo,

  secret: {
    title: 'THE RIO PONEGLYPH',
    message: 'The Architect left this world behind to search for the One Piece. The true history of the Void Century is hidden within the source code. Inherit my will.',
    author: 'Joy Boy'
  }
};
