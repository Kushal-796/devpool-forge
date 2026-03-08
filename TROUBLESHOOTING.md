# 🔧 DevPool - Troubleshooting Guide

Common issues and solutions when setting up and running DevPool.

## 🚀 Development Server Issues

### "npm run dev" fails to start

**Error**: `ENOENT: no such file or directory`

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Port 8080 already in use

**Error**: `Error: listen EADDRINUSE: address already in use :::8080`

**Solution:**

```bash
# Option 1: Kill process on that port
lsof -ti:8080 | xargs kill -9

# Option 2: Use different port
PORT=3000 npm run dev

# Option 3: Check what's using it
lsof -i :8080
```

---

### Vite not hot reloading

**Error**: Changes don't appear in browser

**Solution:**

1. Save file again (Ctrl+S)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)
4. Restart dev server (Ctrl+C, then `npm run dev`)

---

## 🔐 Authentication Issues

### "Sign up" button doesn't work

**Error**: Form submits but nothing happens, or error message

**Checklist:**

- [ ] Firebase credentials in `.env` are correct
- [ ] Email/Password auth is enabled in Firebase
- [ ] Firestore database is created
- [ ] Browser console shows specific error
- [ ] Check Firebase Console → Authentication → Users

**Solution:**

1. Verify `.env` variables:
   ```bash
   # Print them (don't commit!)
   cat .env | grep FIREBASE
   ```
2. Check Firebase Console for credentials
3. Try signup with simple email (test@example.com)
4. Check browser console (F12) for error messages

---

### "Login" fails with correct credentials

**Error**: "User not found" or "Invalid password"

**Solutions:**

1. Verify user exists in Firebase Auth:
   - Go to Firebase Console
   - Authentication → Users tab
   - See user in list?

2. Check email matches exactly (case-sensitive)

3. Clear browser storage:

   ```
   DevTools → Application → Storage → Clear All
   Then refresh page
   ```

4. Check Firebase Console for error logs

---

### Can't create new account

**Error**: "Email already in use" even for new email

**Solutions:**

1. Check if email exists in Firebase Auth
2. Clear browser cache and try different email
3. Verify `useSignUp()` hook is working
4. Check Firestore `users` collection exists

---

### Auth state not persisting

**Error**: Logged in, but after refresh, logged out again

**Solutions:**

1. Firebase automatically persists auth
2. But Firestore user profile might not exist
3. Check `users` collection in Firestore has the document
4. Try logging out and back in

---

## 🗄️ Firebase Issues

### "Cannot find Firestore database"

**Error**: Firestore operations fail, app crashes

**Solutions:**

1. Go to Firebase Console → Firestore Database
2. Is database created? If not, create it
3. Verify security rules are set
4. Check browser console for specific error

```javascript
// To test in console:
import { db } from "@/lib/firebase";
console.log(db); // Should show Firestore instance
```

---

### "Permission denied" on read/write

**Error**: Firestore operations get permission denied

**Causes:**

- Security rules are too restrictive
- User not authenticated
- Data path doesn't match rules

**Solutions:**

1. **Temporary**: Set rules to allow all (develpoment only):

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       allow read, write: if true;
     }
   }
   ```

2. **Proper**: Use correct rules from DEPLOYMENT.md

3. Verify user is authenticated:
   ```javascript
   const { user } = useAuthContext();
   console.log("Auth user:", user); // Should exist
   ```

---

### Collections not appearing in Firestore

**Error**: Create data but can't see it in Console

**Solutions:**

1. Refresh Firestore Console
2. Verify correct project selected
3. Check app is using correct Firebase project
4. Add test document manually in Console to verify it appears

---

### "CORS error" or "Access denied"

**Error**: Browser console shows CORS/security error

**Solutions:**

1. This is likely Firestore security rules
2. Check that user is authenticated
3. Verify collection name matches rules
4. Use rules from DEPLOYMENT.md

---

## 🏗️ Build Issues

### Build fails: "Cannot find module"

**Error**: `Cannot find module 'firebase'`

**Solution:**

```bash
npm install firebase
npm run build
```

---

### TypeScript errors during build

**Error**: `TS2304: Cannot find name 'xyz'`

**Solutions:**

1. Run type check:

   ```bash
   npm run type-check
   ```

2. Install missing types:

   ```bash
   npm install --save-dev @types/node
   ```

3. Clear cache:
   ```bash
   rm -rf dist
   npm run build
   ```

---

### Build takes too long

**Issue**: Build takes more than 30 seconds

**Solutions:**

1. Close other applications
2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
3. Try again

---

## 🌐 Deployment Issues

### Vercel: Build fails with "Firebase undefined"

**Error**: Build succeeds locally but fails on Vercel

**Solution:**

1. Add environment variables to Vercel:
   - Settings → Environment Variables
   - Add all VITE\_\* variables
   - Redeploy

2. Verify variable names match exactly

---

### Netlify: "Cannot find module firebase"

**Error**: `Error: Cannot find module 'firebase'`

**Solution:**

```bash
# Netlify needs node-version
# Create netlify.toml:
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Firebase Hosting: 404 on page refresh

**Error**: Page works, but refreshing shows 404

**Solution:**
Configure `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### Deployment stuck at "building"

**Error**: Stuck for more than 10 minutes

**Solution:**

1. Cancel build
2. Check console for errors
3. Verify environment variables
4. Try local build first: `npm run build`
5. Push changes to git
6. Retry deployment

---

## 💻 Local Development Issues

### "127.0.0.1:8080 refused to connect"

**Error**: Can't open localhost

**Solution:**

```bash
# Check if running
lsof -i :8080

# If not, start it
npm run dev

# If running but not responding, restart
npm run dev
```

---

### Components not updating

**Issue**: Changes to components don't appear

**Solutions:**

1. Save file (Ctrl+S)
2. Check console for errors
3. Hard refresh browser (Ctrl+Shift+R)
4. Clear `.next` or `dist` folder
5. Restart dev server

---

### "undefined is not a function"

**Error**: Runtime error about function

**Solution:**

1. Check browser console full error
2. Verify hook is imported
3. Verify hook is used inside component
4. Check function name spelling

```javascript
// ❌ Wrong:
const { projects } = useProjects(); // Component not in function

// ✅ Right:
const Projects = () => {
  const { projects } = useProjects(); // Inside functional component
};
```

---

### Memory leak warnings

**Error**: "Warning: Memory leaked" in console

**Solutions:**

1. This is usually React Strict Mode (development only)
2. Won't happen in production
3. Check for unsubscribed listeners:
   ```javascript
   useEffect(() => {
     // ... code
     return () => {
       // Cleanup here
     };
   }, []);
   ```

---

## 🎨 UI/Styling Issues

### Styles not loading

**Error**: Page shows unstyled content

**Solutions:**

1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Verify Tailwind CSS is running:
   ```bash
   # Should see "scanning for classes"
   npm run dev
   ```

---

### Dark mode not working

**Issue**: Dark mode toggle doesn't switch theme

**Solutions:**

1. Check `next-themes` is installed
2. Clear localStorage:
   ```javascript
   localStorage.removeItem("theme");
   ```
3. Refresh page

---

## 📱 Mobile Issues

### Responsive design broken

**Issue**: Mobile view looks wrong

**Solutions:**

1. Check phone/tablet width in DevTools
2. Verify Tailwind classes (sm:, md:, lg:)
3. Use Chrome DevTools mobile view (F12)
4. Test on real device

---

## 📊 Performance Issues

### App loads slow

**Issues:**

- Large bundle size
- Slow network
- Slow database

**Solutions:**

1. Check bundle size:

   ```bash
   npm run build
   # Look at dist output
   ```

2. Use React DevTools Performance:
   - F12 → Performance tab
   - Record → Interact → See bottlenecks

3. Optimize images and assets

---

## 🎯 Quick Diagnostic

When something breaks, run these checks:

```bash
# 1. Check Node/npm versions
node --version  # Should be 16+
npm --version   # Should be 7+

# 2. Check dependencies
npm list firebase
npm list react

# 3. Try clean install
rm -rf node_modules package-lock.json
npm install

# 4. Test build
npm run build

# 5. Check types
npm run type-check

# 6. Check lint
npm run lint

# 7. Start fresh
npm run dev
```

---

## 🚨 Critical Issues

### "Cannot use hooks outside component"

**Error**: `Error: Cannot use hooks outside a React function component`

**Solution:**

```javascript
// ❌ Wrong:
const { user } = useAuthContext(); // Top level

function MyComponent() {
  return <div>{user}</div>;
}

// ✅ Right:
function MyComponent() {
  const { user } = useAuthContext(); // Inside component
  return <div>{user}</div>;
}
```

---

### Infinite loops or freezing

**Error**: App freezes or CPU maxes out

**Common causes:**

- `setState` in render
- Missing dependency in useEffect
- Circular references

**Solution:**

1. Check all `useEffect` have dependency array
2. Check no `setState` during render
3. Clear console for repeated errors

---

## 📞 Getting More Help

If something doesn't work:

1. **Check the docs:**
   - [README.md](./README.md)
   - [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - [DEPLOYMENT.md](./DEPLOYMENT.md)

2. **Check browser console** (F12)
   - Look for red errors
   - Note exact error message

3. **Check Firebase Console**
   - Authentication → Users
   - Firestore → Collections
   - Look for warnings/errors

4. **Try the nuclear option:**
   ```bash
   rm -rf node_modules dist .env
   npm install
   cp .env.example .env
   # Fill .env with Firebase credentials
   npm run dev
   ```

---

**Still stuck?** The error message is usually helpful. Google it or check the specific service docs (Firebase, React, Vite).
