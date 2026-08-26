import type { CvData } from '../types/cv';

export const cvData = {
  profile: {
    name: 'Do Van Luan',
    roleClass: '.NET Engineer / Game Developer',
    dob: '11/05/2004',
    location: 'Tan An Ward, Can Tho City',
    education: 'FPT University Can Tho - Software Engineering (2022 - 2026)',
    bio: 'I am a fourth-year Information Technology student focusing on learning and developing in the .NET ecosystem and game development with Unity. During my studies, I have explored and practiced C#, ASP.NET, Web API, SQL Server, and Unity to build robust web applications and interactive 2D games. I am a keen learner, proactive in exploring new technologies, and aspire to contribute to real-world projects as a .NET & Game Engineer.',
    avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LuanDV',
    email: 'luandv.it@gmail.com',
    githubUrl: 'https://github.com/luandv',
    linkedinUrl: 'https://linkedin.com/in/luandv',
  },
  skills: [
    {
      category: 'Backend',
      items: [
        { name: 'C# / .NET / ASP.NET MVC / Web API', level: 85 },
        { name: 'Node.js / NestJS', level: 80 },
        { name: 'Django', level: 70 },
      ],
    },
    {
      category: 'Frontend',
      items: [
        { name: 'React / Next.js', level: 80 },
        { name: 'HTML / CSS / JavaScript', level: 85 },
      ],
    },
    {
      category: 'Database',
      items: [
        { name: 'SQL Server', level: 80 },
        { name: 'PostgreSQL', level: 75 },
      ],
    },
    {
      category: 'Game Development',
      items: [
        { name: 'Unity / C#', level: 85 },
        { name: 'Game Architecture & Multiplayer Sync', level: 85 },
      ],
    },
    {
      category: 'Project Management',
      items: [{ name: 'Scrum / Agile', level: 90 }],
    },
  ],
  experiences: [
    {
      id: 3,
      company: 'UTA Co., Ltd',
      position: 'OJT Trainee / Intern',
      description: 'Developer Intern. Worked with React, Next.js, PostgreSQL, and Django APIs to implement full-stack CRUD features. Set up and optimized WordPress with Elementor. Contributed to team projects by developing UI features, fixing bugs, and optimizing performance.',
      startDate: '2025-05-12',
      endDate: '2025-08-16',
      isCurrent: false,
    },
    {
      id: 1,
      company: 'NailBox - Nail service management system',
      position: 'Fullstack Developer',
      description: 'Developed a nail service management system as part of a multidisciplinary team. Designed RESTful APIs using Node.js, built frontend using NestJS/React. Designed system architecture and data handling.',
      startDate: '2025-01-01',
      endDate: '2026-01-01',
      isCurrent: false,
    },
    {
      id: 2,
      company: 'Eduti - Online Learning Platform',
      position: 'Fullstack Developer (.NET)',
      description: 'Contributed to an online learning platform built using Microservices Architecture. Developed the Landing Page, built Quiz Service using .NET Web API, and Result Service.',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      isCurrent: false,
    },
  ],
  projects: [
    {
      id: 1,
      title: 'Mystic Journey',
      slug: 'mystic-journey',
      description: 'Adventure - Action 2D Game Capstone Project (Group AitiNet). Addressed the gap in lightweight 2D RPGs with strategic depth. Built client-server architecture for real-time multiplayer sync, combat state, and persistent data management.',
      imageUrl: null,
      projectUrl: null,
      githubUrl: null,
      techStack: ['Unity', 'C#', '.NET Backend', 'Multiplayer Sync', 'Scrum'],
      featured: true,
      role: 'Scrum Master / Leader. Coordinated 2-week Sprint cycles, managed Trello/GitHub, resolved combat sync blockers, and ensured code quality.',
    },
    {
      id: 2,
      title: 'NailBox',
      slug: 'nailbox',
      description: 'Nail service management system. Designed the overall system architecture and code structure. Implemented core features including service management and data handling.',
      imageUrl: null,
      projectUrl: null,
      githubUrl: null,
      techStack: ['Node.js', 'NestJS', 'REST API'],
      featured: false,
      role: null,
    },
    {
      id: 3,
      title: 'Eduti',
      slug: 'eduti',
      description: 'Online Learning Platform built using Microservices Architecture, enabling better scalability. Developed Quiz Service and Result Service.',
      imageUrl: null,
      projectUrl: null,
      githubUrl: null,
      techStack: ['ASP.NET MVC', '.NET Web API', 'Microservices'],
      featured: false,
      role: null,
    },
  ],
} satisfies CvData;
