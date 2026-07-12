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
  about: "I am a Creative Technologist specializing in pushing the limits of the browser. My work bridges the gap between high-performance engineering and cinematic 3D art, creating immersive WebGL experiences that challenge traditional web design.",
  achievements: [
    { title: "Hackathon Winner", description: "First place in the global WebGL rendering challenge." },
    { title: "Awwwards Site of the Day", description: "Recognized for creative excellence in frontend architecture." },
    { title: "Open Source Contributor", description: "Active contributor to the React Three Fiber ecosystem." }
  ] as Achievement[],
  projects: [
    {
      id: 'aether',
      title: 'AETHER // The Creator Protocol',
      description: 'A breathtaking, fully interactive AAA WebGL portfolio. Features a custom Third-Person Hoverboard physics controller, procedural generation, and highly optimized cinematic intro sequences.',
      techStack: ['React Three Fiber', 'Rapier Physics', 'Zustand', 'GSAP', 'Three.js'],
      repo: 'https://github.com/Piyush-031005/aether'
    },
    {
      id: 'specimen',
      title: 'SPECIMEN',
      description: 'An interactive biomechanical web experience exploring the boundaries of procedural animation and auditory physics.',
      techStack: ['WebGL', 'GLSL Shaders', 'Web Audio API', 'React'],
    },
    {
      id: 'limbo',
      title: 'LIMBO // 領域',
      description: 'A cinematic spatial UI exploration featuring glassmorphism layouts and complex state-driven architecture.',
      techStack: ['TypeScript', 'Framer Motion', 'React'],
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
