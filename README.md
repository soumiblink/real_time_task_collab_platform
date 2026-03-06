# Realtime Task Collaboration

A modern, collaborative task management application built with React, Vite, and Firebase. Manage your daily tasks, goals, and routines in real-time with team collaboration features.

![Realtime Task Collaboration](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)

## Features

### Task Management
- Create and manage tasks with titles, descriptions, dates, and times
- Set priority levels: Low, Medium, High with color coding
- Categorize tasks: Work, Personal, Health, etc.
- Customize task colors
- Set reminders and notifications
- Link tasks to goals
- Mark tasks as complete or delete them

### Goals
- Define long-term goals with deadlines
- Categorize goals: Personal, Work, Skill-Up, Health, Finance, Active
- Track progress with visual progress bars (0-100%)
- Add cover images to goals
- Associate tasks with goals

### Routines
- Establish recurring routines (daily/weekly)
- Use templates like Morning Workout, Evening Wind Down, Deep Work Prep
- Generate tasks from routines for specific days
- Schedule routines for selected days

### User Profile
- Upload and manage profile photos
- Update name and email
- Switch between dark and light themes
- Change passwords

### Dashboard
- View overview statistics: total, completed, pending tasks
- See weekly tasks overview
- Monitor active goals
- Check completion rates

### Views
- **Today**: Tasks for the current day
- **Upcoming**: Future tasks in calendar view
- **Calendar**: Monthly calendar with task indicators

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite
- **Database**: Firebase Firestore (real-time)
- **Authentication**: Firebase Auth (Email + Google)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Firebase account

### Installation

```bash
# Navigate to the project directory
cd realtime_task_collab/task-manager

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Firebase Configuration

1. Visit [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Activate Authentication (Email/Password and Google)
4. Activate Firestore Database
5. Copy your configuration to `src/firebase/config.js`

### Production Build

```bash
npm run build
```

## Disclaimer

This project is copied from an existing task manager template and modified for collaborative features.

The build output will be in the `dist` folder, ready to deploy to Netlify, Vercel, or Firebase Hosting.

---

## 📁 Project Structure

```
task-manager/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskModal.jsx
│   │   ├── GoalCard.jsx
│   │   ├── GoalModal.jsx
│   │   ├── RoutineModal.jsx
│   │   └── ...
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── TaskContext.jsx
│   │   ├── GoalContext.jsx
│   │   ├── RoutineContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Today.jsx
│   │   ├── Upcoming.jsx
│   │   ├── Calendar.jsx
│   │   ├── Goals.jsx
│   │   ├── Routines.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── firebase/         # Firebase configuration
│   │   ├── config.js
│   │   └── services.js
│   ├── data/            # Static data
│   │   └── initialData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔐 Security Rules (Firestore)

For development (test mode):
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

For production, use:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

---

## 🌐 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Go to [Netlify](https://netlify.com)
3. Drag & drop the `dist` folder
4. Add your domain to Firebase Authorized domains

### Vercel
```bash
npm i -g vercel
vercel
```

### Firebase Hosting
```bash
firebase init hosting
firebase deploy
```

---

## 📱 Supported Features

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark/Light theme
- ✅ Real-time database sync
- ✅ Google Sign-In
- ✅ Email/Password authentication
- ✅ Task CRUD operations
- ✅ Goal tracking with progress
- ✅ Routine automation
- ✅ Profile management
- ✅ Custom task colors

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is for personal use.

---

## 👨‍💻 Built By

EaseMyTask - A modern task management solution

**Version:** 1.0.0  
**Last Updated:** March 2026
