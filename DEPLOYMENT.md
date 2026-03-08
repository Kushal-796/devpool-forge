# DevPool Deployment Guide

This guide covers deploying DevPool to production on various platforms.

## Prerequisites

Before deployment, ensure:

1. ✅ Firebase project is properly set up
2. ✅ `.env` file contains correct Firebase credentials
3. ✅ Firestore security rules are configured
4. ✅ Local build succeeds: `npm run build`
5. ✅ All tests pass: `npm test`

## 📋 Pre-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] Firebase Firestore rules are deployed
- [ ] Authentication is configured
- [ ] Manual testing completed locally
- [ ] Code review completed
- [ ] No console errors in dev tools
- [ ] Mobile responsive design verified

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for beginners)

Vercel provides the easiest hosting with automatic deployments from Git.

#### Steps:

1. **Create Vercel Account**

   ```bash
   # Go to https://vercel.com and sign up with GitHub
   ```

2. **Connect Repository**
   - Import your GitHub repository
   - Select DevPool project

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `.env`:

   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys on every push to main

#### Benefits:

- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Built-in preview URLs
- ✅ Instant rollback
- ✅ Global CDN

#### Custom Domain:

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records
4. SSL certificate auto-configured

---

### Option 2: Netlify

Netlify is another popular hosting platform with great DX.

#### Steps:

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build Locally**

   ```bash
   npm run build
   ```

3. **Deploy**

   ```bash
   # First time deployment (creates netlify.toml)
   netlify deploy --prod

   # Add credentials when prompted
   ```

4. **Configure Environment Variables**
   - In Netlify admin panel: Site settings → Build & Deploy → Environment
   - Add all Firebase credentials

5. **Setup Continuous Deployment**
   ```bash
   netlify init
   # Connect your Git repository
   ```

#### Benefits:

- ✅ Free tier with generous limits
- ✅ Git-based deployment
- ✅ Form handling
- ✅ Analytics included
- ✅ Instant cache invalidation

---

### Option 3: Firebase Hosting

Deploy directly to Firebase's native hosting service.

#### Steps:

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**

   ```bash
   firebase login
   ```

3. **Initialize Firebase Project**

   ```bash
   firebase init hosting
   # Select your project
   # Set "dist" as public directory
   # Configure as single-page app: Yes
   ```

4. **Build and Deploy**

   ```bash
   npm run build
   firebase deploy
   ```

5. **View Live Site**
   ```bash
   firebase open hosting:site
   ```

#### Benefits:

- ✅ Same project as Firestore/Auth
- ✅ Free SSL/TLS
- ✅ CDN included
- ✅ Instant rollback
- ✅ Built-in analytics

---

### Option 4: Traditional Server (Docker + Any Cloud)

For custom server setup using Docker.

#### Dockerfile:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Deploy to Docker Hub:

```bash
# Build image
docker build -t devpool:latest .

# Tag for Docker Hub
docker tag devpool:latest your-username/devpool:latest

# Push to Docker Hub
docker push your-username/devpool:latest
```

#### Deploy to AWS, Google Cloud, Azure:

Use their container registry services with the Docker image.

---

## 🔐 Security Checklist for Production

### Firebase Security Rules

Update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users only
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
    }

    // Projects - public read, authenticated write
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     request.auth.uid == request.resource.data.ownerId;
      allow create: if request.auth != null;
    }

    // Bounties - public read, authenticated write
    match /bounties/{bountyId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     request.auth.uid == request.resource.data.createdBy;
      allow create: if request.auth != null;
    }

    // Project Members - project owner and members only
    match /project_members/{memberId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.uid == get(/databases/$(database)/documents/projects/$(request.resource.data.projectId)).data.ownerId ||
        request.auth.uid == resource.data.userId
      );
    }

    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Authentication Security

1. **Enable HTTPS Only**
   - All hosting platforms provide free SSL
   - Force HTTPS redirects

2. **Set CORS Policy**
   - Configure Firebase to only accept requests from your domain

3. **Rate Limiting**
   - Firebase Auth has built-in rate limiting
   - Configure additional limits in Cloud Functions if needed

4. **Content Security Policy**
   - Add to `index.html`:
   ```html
   <meta
     http-equiv="Content-Security-Policy"
     content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
   />
   ```

---

## 📊 Monitoring & Analytics

### Firebase Console

- Go to Analytics dashboard
- Monitor: Users, Events, Crashes
- Set up alerts for anomalies

### Web Vitals

The app uses web-vitals for performance monitoring. Configure in production:

```typescript
// Add to your app initialization
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## 🔧 Troubleshooting Deployment

### Build Fails

```bash
# Clear all caches
rm -rf node_modules dist .next
npm ci
npm run build
```

### Environment Variables Not Working

- Verify variable names match exactly
- Make sure `VITE_` prefix is used for Vite
- Redeploy after updating environment variables
- Check platform's documentation for variable format

### Firestore Connection Issues

- Check Firebase credentials are correct
- Verify Firestore database is created
- Check security rules allow your app
- Look at browser console for specific errors

### Slow Load Times

- Check bundle size: `npm run build`
- Use browser DevTools Performance tab
- Enable compression on hosting platform
- Consider code splitting for large chunks

---

## 📈 Post-Deployment

### 1. Monitoring

- Set up alerts for errors
- Monitor performance metrics
- Track user analytics

### 2. Regular Updates

```bash
# Update dependencies monthly
npm update
npm audit fix

# Rebuild and redeploy
npm run build
# Push to your hosting platform
```

### 3. Backup Strategy

- Firebase stores data in cloud (automatic daily backups)
- Export important data regularly
- Test recovery procedures

### 4. Performance Optimization

```bash
# Analyze bundle
npm install -g webpack-bundle-analyzer
# Check your build
npm run build
```

---

## 📞 Getting Help

If deployment fails:

1. **Check Logs**
   - Vercel: Dashboard → Deployments → Build Logs
   - Netlify: Site → Deploys → Deployment logs
   - Firebase: `firebase deploy` output

2. **Common Issues**
   - Missing environment variables
   - Incorrect Firebase credentials
   - Node version mismatch
   - Firestore rules blocking access

3. **Resources**
   - [Vercel Documentation](https://vercel.com/docs)
   - [Netlify Documentation](https://docs.netlify.com)
   - [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
   - [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## 🎉 Deployment Success

After deployment:

1. ✅ Test all pages work
2. ✅ Verify authentication works
3. ✅ Check mobile responsiveness
4. ✅ Test form submissions
5. ✅ Verify images load
6. ✅ Check console for errors
7. ✅ Test on different browsers
8. ✅ Verify Google Analytics (if set up)

**Your DevPool application is now live!** 🚀
