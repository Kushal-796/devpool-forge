# DevPool - AI-Powered Developer Collaboration Platform

## 🚀 Project Overview

DevPool is a modern web platform that connects developers, learners, and project owners. It features:

- 🔐 **Firebase Authentication** - Secure user authentication
- 🔥 **Firestore Database** - Cloud-hosted database for all platform data
- 💬 **Team Collaboration** - Project workspaces with Kanban boards
- 🎯 **Bounty System** - Micro-task marketplace for developers
- 🤖 **AI Features** - AI-powered team matching and portfolio generation
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 📋 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Context + React Query
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

## 🔧 Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use an existing one
3. Enable the following services:
   - **Authentication** → Enable Email/Password sign-in
   - **Cloud Firestore** → Create database in production mode
   - **Cloud Storage** → Enable for file uploads

### 2. Get Firebase Credentials

1. In Firebase Console, go to Project Settings (gear icon)
2. Click "Add app" → Web
3. Copy the configuration object
4. Update `.env` file with your credentials:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Firestore Collections

Connect to Firestore and create these collections with the following structure:

#### Users Collection

```typescript
{
  id: string (document ID)
  name: string
  email: string
  githubUsername?: string
  avatarUrl?: string
  bio?: string
  role: "developer" | "learner" | "owner" | "admin"
  reputationScore: number (default: 0)
  createdAt: Timestamp
}
```

#### Projects Collection

```typescript
{
  id: string
  ownerId: string (reference to users)
  title: string
  description: string
  techStack: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  status: "open" | "active" | "completed"
  maxTeamSize: number
  currentMembers?: number
  stars?: number
  createdAt: Timestamp
}
```

#### Bounties Collection

```typescript
{
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  techStack: string[]
  points: number
  createdBy: string (reference to users)
  timeEstimate?: string
  submissions?: number
  createdAt: Timestamp
}
```

#### Project Members Collection

```typescript
{
  id: string;
  projectId: string;
  userId: string;
  role: "frontend" | "backend" | "ml" | "designer" | "tester";
  joinedAt: Timestamp;
}
```

#### Project Tasks Collection

```typescript
{
  id: string
  projectId: string
  title: string
  description: string
  assignedTo?: string
  status: "todo" | "in_progress" | "done"
  priority: "high" | "medium" | "low"
  createdAt: Timestamp
}
```

#### Bounty Submissions Collection

```typescript
{
  id: string
  bountyId: string
  userId: string
  repoLink: string
  score?: number
  status: "pending" | "approved" | "rejected"
  submittedAt: Timestamp
}
```

And more collections as per the schema (skills, user_skills, repositories, portfolios, notifications, etc.)

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 📚 Available Routes

- `/` - Home page
- `/projects` - Project board
- `/bounties` - Bounty board
- `/developers` - Team matching
- `/workspace` - Team workspace with Kanban
- `/profile` - User profile
- `/login` - Login page
- `/signup` - Sign up page

## 🎯 Key Features Implemented

### Authentication

- ✅ Email/Password signup and login
- ✅ User profile creation
- ✅ Logout functionality
- ✅ Auth state management with Context

### Database Operations

- ✅ Custom Firebase hooks (useCollectionData, useDocumentData, etc.)
- ✅ Database helper hooks (useProjects, useBounties, etc.)
- ✅ CRUD operations for all entities
- ✅ Real-time data subscriptions

### UI Components

- ✅ Responsive navigation with auth state
- ✅ Login/Signup pages
- ✅ Project cards
- ✅ Bounty cards
- ✅ Developer cards
- ✅ Profile section
- ✅ Workspace Kanban board

## 🚧 Features to Implement

- [ ] Project creation form
- [ ] Bounty submission
- [ ] Project member management
- [ ] Real-time chat integration
- [ ] GitHub OAuth integration
- [ ] Portfolio generation
- [ ] Badge system
- [ ] Skills verification
- [ ] Search and filtering with Firestore queries
- [ ] Upload functionality (profile pictures, code submissions)
- [ ] Notifications system
- [ ] Payment integration for bounties

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Firebase Hosting

```bash
npm i -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🔒 Firebase Security Rules

Set these rules in Firestore for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if true;
    }

    // Projects - public read, authenticated write
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }

    // Bounties - public read, authenticated write
    match /bounties/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }

    // Allow authenticated users to manage their own data
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.uid in request.resource.data.get('allowedUsers', []);
    }
  }
}
```

## 🐛 Troubleshooting

### Firebase not connecting

- Verify environment variables in `.env`
- Check Firebase project is active
- Ensure Firestore is enabled
- Check browser console for specific errors

### Authentication issues

- Clear browser storage: Dev Tools → Application → Storage → Clear All
- Verify email/password combination
- Check Firebase authentication settings

### Build issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📖 API Reference

### Auth Hooks

```typescript
useAuth(); // Get current user and loading state
useSignUp(); // Sign up new user
useLogin(); // Login user
useLogout(); // Logout user
useUserProfile(userId); // Fetch user profile
```

### Database Hooks

```typescript
useProjects(); // Get all projects
useProject(id); // Get single project
useAddProject(); // Add new project
useUpdateProject(); // Update project
useDeleteProject(); // Delete project

useBounties(); // Get all bounties
useBounty(id); // Get single bounty
useAddBounty(); // Add new bounty
// ... and more for other entities
```

### Context

```typescript
useAuthContext(); // Access auth state globally
```

## 📝 Environment Variables

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 Database Schema

The complete database schema is designed with these 13 core tables:

1. **users** - User profiles
2. **projects** - Collaborative projects
3. **project_members** - Team structure
4. **project_tasks** - Task management
5. **bounties** - Coding challenges
6. **bounty_submissions** - Bounty solutions
7. **skills** - Skill list
8. **user_skills** - User skill levels
9. **repositories** - GitHub repos
10. **portfolios** - Generated portfolios
11. **portfolio_projects** - Portfolio entries
12. **notifications** - User notifications
13. **project_invitations** - Team invitations

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review Firebase documentation
3. Check console for error messages
4. Create an issue in the repository

## 🎓 Learning Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**DevPool** - Where developers prove their skills! 🚀
