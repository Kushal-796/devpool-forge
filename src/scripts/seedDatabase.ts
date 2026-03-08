import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  User,
  Project,
  ProjectMember,
  ProjectTask,
  Bounty,
  BountySubmission,
  Skill,
  UserSkill,
  Repository,
  Portfolio,
  PortfolioProject,
  Notification,
  ProjectInvitation,
  UserRole,
  ProjectStatus,
  ProjectMemberRole,
  TaskStatus,
  TaskPriority,
  BountySubmissionStatus,
  ProjectInvitationStatus,
  Difficulty,
} from '../types';

// Helper function to get random element from array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate random date within last year
function randomDate(): Date {
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  return new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));
}

// Dummy data generators
async function seedDatabase() {
  console.log('Starting database seeding...');

  // 1. Skills
  const skillsData: Omit<Skill, 'id'>[] = [
    { skillName: 'JavaScript' },
    { skillName: 'TypeScript' },
    { skillName: 'React' },
    { skillName: 'Node.js' },
    { skillName: 'Python' },
    { skillName: 'Java' },
    { skillName: 'C#' },
    { skillName: 'Go' },
    { skillName: 'Rust' },
    { skillName: 'HTML' },
    { skillName: 'CSS' },
    { skillName: 'SQL' },
    { skillName: 'MongoDB' },
    { skillName: 'Firebase' },
    { skillName: 'AWS' },
    { skillName: 'Docker' },
    { skillName: 'Kubernetes' },
    { skillName: 'Git' },
    { skillName: 'Machine Learning' },
    { skillName: 'Data Science' },
  ];

  const skillsRefs = [];
  for (const skill of skillsData) {
    const docRef = await addDoc(collection(db, 'skills'), skill);
    skillsRefs.push({ id: docRef.id, ...skill });
  }
  console.log('Skills seeded');

  // 2. Users
  const userRoles: UserRole[] = ['developer', 'learner', 'owner', 'admin'];
  const usersData: Omit<User, 'id'>[] = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      githubUsername: 'alice-dev',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      bio: 'Full-stack developer passionate about React and Node.js',
      role: 'developer',
      reputationScore: 1250,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      githubUsername: 'bob-coder',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      bio: 'Backend engineer specializing in Python and databases',
      role: 'developer',
      reputationScore: 980,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      githubUsername: 'charlie-ml',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
      bio: 'Machine learning enthusiast learning to code',
      role: 'learner',
      reputationScore: 450,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      name: 'Diana Prince',
      email: 'diana@example.com',
      githubUsername: 'diana-owner',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
      bio: 'Project owner and tech lead',
      role: 'owner',
      reputationScore: 2100,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      name: 'Eve Wilson',
      email: 'eve@example.com',
      githubUsername: 'eve-admin',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve',
      bio: 'Platform administrator',
      role: 'admin',
      reputationScore: 3200,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      name: 'Frank Miller',
      email: 'frank@example.com',
      githubUsername: 'frank-frontend',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank',
      bio: 'Frontend developer with React expertise',
      role: 'developer',
      reputationScore: 780,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      name: 'Grace Lee',
      email: 'grace@example.com',
      githubUsername: 'grace-backend',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
      bio: 'Backend developer focusing on scalability',
      role: 'developer',
      reputationScore: 1100,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      name: 'Henry Davis',
      email: 'henry@example.com',
      githubUsername: 'henry-learner',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry',
      bio: 'New to coding, excited to learn!',
      role: 'learner',
      reputationScore: 120,
      createdAt: Timestamp.fromDate(randomDate()),
    },
  ];

  const usersRefs = [];
  for (const user of usersData) {
    const docRef = await addDoc(collection(db, 'users'), user);
    usersRefs.push({ id: docRef.id, ...user });
  }
  console.log('Users seeded');

  // 3. User Skills
  const userSkillsData: Omit<UserSkill, 'id'>[] = [];
  for (const user of usersRefs) {
    const numSkills = Math.floor(Math.random() * 5) + 1; // 1-5 skills per user
    const shuffledSkills = [...skillsRefs].sort(() => 0.5 - Math.random());
    for (let i = 0; i < numSkills; i++) {
      userSkillsData.push({
        userId: user.id,
        skillId: shuffledSkills[i].id,
        skillScore: Math.floor(Math.random() * 100) + 1,
      });
    }
  }

  for (const userSkill of userSkillsData) {
    await addDoc(collection(db, 'userSkills'), userSkill);
  }
  console.log('User Skills seeded');

  // 4. Projects
  const projectStatuses: ProjectStatus[] = ['open', 'active', 'completed'];
  const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
  const techStacks = [
    ['React', 'TypeScript', 'Node.js'],
    ['Python', 'Django', 'PostgreSQL'],
    ['Java', 'Spring Boot', 'MySQL'],
    ['JavaScript', 'Express', 'MongoDB'],
    ['C#', '.NET', 'SQL Server'],
    ['Go', 'Gin', 'Redis'],
    ['Rust', 'Actix', 'PostgreSQL'],
    ['React', 'Python', 'TensorFlow'],
  ];

  const projectsData: Omit<Project, 'id'>[] = [
    {
      ownerId: usersRefs[3].id, // Diana (owner)
      title: 'E-commerce Platform',
      description: 'Build a full-stack e-commerce platform with payment integration',
      techStack: randomElement(techStacks),
      difficulty: 'Advanced',
      status: 'active',
      maxTeamSize: 6,
      stars: 45,
      amountInINR: Math.floor(Math.random() * 90000) + 10000, // between ₹10k and ₹100k
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      ownerId: usersRefs[3].id,
      title: 'Task Management App',
      description: 'Create a collaborative task management application',
      techStack: randomElement(techStacks),
      difficulty: 'Intermediate',
      status: 'active',
      maxTeamSize: 4,
      stars: 32,
      amountInINR: Math.floor(Math.random() * 90000) + 10000,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      ownerId: usersRefs[0].id, // Alice
      title: 'Weather Dashboard',
      description: 'Build a weather dashboard with real-time data',
      techStack: ['React', 'TypeScript', 'OpenWeather API'],
      difficulty: 'Beginner',
      status: 'completed',
      maxTeamSize: 3,
      stars: 18,
      amountInINR: Math.floor(Math.random() * 90000) + 10000,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      ownerId: usersRefs[1].id, // Bob
      title: 'AI Chatbot',
      description: 'Develop an AI-powered chatbot for customer support',
      techStack: ['Python', 'TensorFlow', 'Flask'],
      difficulty: 'Advanced',
      status: 'open',
      maxTeamSize: 5,
      stars: 67,
      amountInINR: Math.floor(Math.random() * 90000) + 10000,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      ownerId: usersRefs[5].id, // Frank
      title: 'Portfolio Website',
      description: 'Create a responsive portfolio website template',
      techStack: ['React', 'CSS', 'JavaScript'],
      difficulty: 'Beginner',
      status: 'completed',
      maxTeamSize: 2,
      stars: 23,
      amountInINR: Math.floor(Math.random() * 90000) + 10000,
      createdAt: Timestamp.fromDate(randomDate()),
    },
  ];

  const projectsRefs = [];
  for (const project of projectsData) {
    const docRef = await addDoc(collection(db, 'projects'), project);
    projectsRefs.push({ id: docRef.id, ...project });
  }
  console.log('Projects seeded');

  // 5. Project Members
  const memberRoles: ProjectMemberRole[] = ['frontend', 'backend', 'ml', 'designer', 'tester'];
  const projectMembersData: Omit<ProjectMember, 'id'>[] = [];

  for (const project of projectsRefs) {
    // Add owner as member
    projectMembersData.push({
      projectId: project.id,
      userId: project.ownerId,
      role: randomElement(memberRoles),
      joinedAt: Timestamp.fromDate(randomDate()),
    });

    // Add 1-3 random members
    const availableUsers = usersRefs.filter(u => u.id !== project.ownerId);
    const numMembers = Math.floor(Math.random() * 3) + 1;
    const shuffledUsers = [...availableUsers].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numMembers && i < shuffledUsers.length; i++) {
      projectMembersData.push({
        projectId: project.id,
        userId: shuffledUsers[i].id,
        role: randomElement(memberRoles),
        joinedAt: Timestamp.fromDate(randomDate()),
      });
    }
  }

  for (const member of projectMembersData) {
    await addDoc(collection(db, 'projectMembers'), member);
  }
  console.log('Project Members seeded');

  // 6. Project Tasks
  const taskStatuses: TaskStatus[] = ['todo', 'in_progress', 'done'];
  const taskPriorities: TaskPriority[] = ['high', 'medium', 'low'];
  const projectTasksData: Omit<ProjectTask, 'id'>[] = [];

  for (const project of projectsRefs) {
    const numTasks = Math.floor(Math.random() * 5) + 3; // 3-7 tasks per project
    for (let i = 0; i < numTasks; i++) {
      const projectMembers = projectMembersData.filter(m => m.projectId === project.id);
      const assignedTo = Math.random() > 0.3 ? randomElement(projectMembers)?.userId : undefined;

      const taskData: any = {
        projectId: project.id,
        title: `Task ${i + 1} for ${project.title}`,
        description: `Description for task ${i + 1}`,
        status: randomElement(taskStatuses),
        priority: randomElement(taskPriorities),
        createdAt: Timestamp.fromDate(randomDate()),
      };

      if (assignedTo) {
        taskData.assignedTo = assignedTo;
      }

      projectTasksData.push(taskData);
    }
  }

  for (const task of projectTasksData) {
    await addDoc(collection(db, 'projectTasks'), task);
  }
  console.log('Project Tasks seeded');

  // 7. Bounties
  const bountiesData: Omit<Bounty, 'id'>[] = [
    {
      title: 'Implement User Authentication',
      description: 'Add secure user authentication with JWT tokens',
      difficulty: 'Intermediate',
      techStack: ['Node.js', 'JWT', 'bcrypt'],
      points: 150,
      createdBy: usersRefs[0].id,
      timeEstimate: '2-3 days',
      submissions: 0,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      title: 'Create Responsive Navigation',
      description: 'Build a mobile-friendly navigation component',
      difficulty: 'Beginner',
      techStack: ['React', 'CSS', 'JavaScript'],
      points: 75,
      createdBy: usersRefs[5].id,
      timeEstimate: '1 day',
      submissions: 0,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      title: 'Database Optimization',
      description: 'Optimize database queries for better performance',
      difficulty: 'Advanced',
      techStack: ['SQL', 'PostgreSQL', 'Indexing'],
      points: 200,
      createdBy: usersRefs[1].id,
      timeEstimate: '3-4 days',
      submissions: 0,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      title: 'API Documentation',
      description: 'Write comprehensive API documentation',
      difficulty: 'Beginner',
      techStack: ['Swagger', 'OpenAPI'],
      points: 50,
      createdBy: usersRefs[3].id,
      timeEstimate: '1 day',
      submissions: 0,
      createdAt: Timestamp.fromDate(randomDate()),
    },
    {
      title: 'Machine Learning Model',
      description: 'Implement a simple ML model for prediction',
      difficulty: 'Advanced',
      techStack: ['Python', 'scikit-learn', 'pandas'],
      points: 300,
      createdBy: usersRefs[2].id,
      timeEstimate: '5-7 days',
      submissions: 0,
      createdAt: Timestamp.fromDate(randomDate()),
    },
  ];

  const bountiesRefs = [];
  for (const bounty of bountiesData) {
    const docRef = await addDoc(collection(db, 'bounties'), bounty);
    bountiesRefs.push({ id: docRef.id, ...bounty });
  }
  console.log('Bounties seeded');

  // 8. Bounty Submissions
  const submissionStatuses: BountySubmissionStatus[] = ['pending', 'approved', 'rejected'];
  const bountySubmissionsData: Omit<BountySubmission, 'id'>[] = [];

  for (const bounty of bountiesRefs) {
    const numSubmissions = Math.floor(Math.random() * 3) + 1; // 1-3 submissions per bounty
    const shuffledUsers = [...usersRefs].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numSubmissions && i < shuffledUsers.length; i++) {
      const submissionData: any = {
        bountyId: bounty.id,
        userId: shuffledUsers[i].id,
        repoLink: `https://github.com/${shuffledUsers[i].githubUsername}/bounty-${bounty.id}`,
        status: randomElement(submissionStatuses),
        submittedAt: Timestamp.fromDate(randomDate()),
      };

      const score = Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 1 : undefined;
      if (score) {
        submissionData.score = score;
      }

      bountySubmissionsData.push(submissionData);
    }
  }

  for (const submission of bountySubmissionsData) {
    await addDoc(collection(db, 'bountySubmissions'), submission);
  }
  console.log('Bounty Submissions seeded');

  // 9. Repositories
  const repositoriesData: Omit<Repository, 'id'>[] = [];

  for (const user of usersRefs) {
    const numRepos = Math.floor(Math.random() * 3) + 1; // 1-3 repos per user
    for (let i = 0; i < numRepos; i++) {
      const repoData: any = {
        userId: user.id,
        repoName: `${user.githubUsername}-project-${i + 1}`,
        repoUrl: `https://github.com/${user.githubUsername}/${user.githubUsername}-project-${i + 1}`,
        language: randomElement(['JavaScript', 'TypeScript', 'Python', 'Java', 'Go']),
        stars: Math.floor(Math.random() * 100),
        forks: Math.floor(Math.random() * 20),
        lastUpdated: Timestamp.fromDate(randomDate()),
      };

      const description = Math.random() > 0.5 ? `A sample project by ${user.name}` : undefined;
      if (description) {
        repoData.description = description;
      }

      repositoriesData.push(repoData);
    }
  }

  const repositoriesRefs = [];
  for (const repo of repositoriesData) {
    const docRef = await addDoc(collection(db, 'repositories'), repo);
    repositoriesRefs.push({ id: docRef.id, ...repo });
  }
  console.log('Repositories seeded');

  // 10. Portfolios
  const portfoliosData: Omit<Portfolio, 'id'>[] = [];

  for (const user of usersRefs) {
    const portfolioData: any = {
      userId: user.id,
      headline: `${user.name} - ${user.role}`,
      about: `Experienced ${user.role} with expertise in various technologies.`,
      generatedAt: Timestamp.fromDate(randomDate()),
    };

    // Sometimes add updatedAt
    if (Math.random() > 0.5) {
      portfolioData.updatedAt = Timestamp.fromDate(randomDate());
    }

    portfoliosData.push(portfolioData);
  }

  const portfoliosRefs = [];
  for (const portfolio of portfoliosData) {
    const docRef = await addDoc(collection(db, 'portfolios'), portfolio);
    portfoliosRefs.push({ id: docRef.id, ...portfolio });
  }
  console.log('Portfolios seeded');

  // 11. Portfolio Projects
  const portfolioProjectsData: Omit<PortfolioProject, 'id'>[] = [];

  for (const portfolio of portfoliosRefs) {
    const userRepos = repositoriesRefs.filter(r => r.userId === portfolio.userId);
    const numProjects = Math.min(userRepos.length, 3);
    const shuffledRepos = [...userRepos].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numProjects; i++) {
      portfolioProjectsData.push({
        portfolioId: portfolio.id,
        repoId: shuffledRepos[i].id,
        projectSummary: `This project demonstrates ${shuffledRepos[i].language} skills and best practices.`,
      });
    }
  }

  for (const project of portfolioProjectsData) {
    await addDoc(collection(db, 'portfolioProjects'), project);
  }
  console.log('Portfolio Projects seeded');

  // 12. Notifications
  const notificationsData: Omit<Notification, 'id'>[] = [];

  for (const user of usersRefs) {
    const numNotifications = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numNotifications; i++) {
      notificationsData.push({
        userId: user.id,
        message: `Notification ${i + 1} for ${user.name}`,
        isRead: Math.random() > 0.5,
        createdAt: Timestamp.fromDate(randomDate()),
      });
    }
  }

  for (const notification of notificationsData) {
    await addDoc(collection(db, 'notifications'), notification);
  }
  console.log('Notifications seeded');

  // 13. Project Invitations
  const invitationStatuses: ProjectInvitationStatus[] = ['pending', 'accepted', 'rejected'];
  const projectInvitationsData: Omit<ProjectInvitation, 'id'>[] = [];

  for (const project of projectsRefs) {
    const numInvitations = Math.floor(Math.random() * 2) + 1; // 1-2 invitations per project
    const availableUsers = usersRefs.filter(u => !projectMembersData.some(m => m.projectId === project.id && m.userId === u.id));
    const shuffledUsers = [...availableUsers].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numInvitations && i < shuffledUsers.length; i++) {
      projectInvitationsData.push({
        projectId: project.id,
        invitedUser: shuffledUsers[i].id,
        status: randomElement(invitationStatuses),
        sentAt: Timestamp.fromDate(randomDate()),
      });
    }
  }

  for (const invitation of projectInvitationsData) {
    await addDoc(collection(db, 'projectInvitations'), invitation);
  }
  console.log('Project Invitations seeded');

  console.log('Database seeding completed successfully!');
}

// Run the seeding function
seedDatabase().catch(console.error);