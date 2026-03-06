# EaseMyTask - Task Manager App

A modern, full-featured task management application built with React, Vite, and Firebase. Track your daily tasks, goals, and routines all in one place.

![EaseMyTask](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)

---

## 🌟 Features

### 📋 Task Management
- **Create Tasks** - Add tasks with title, description, date, and time
- **Priority Levels** - Low, Medium, High priority with color coding
- **Categories** - Organize tasks by Work, Personal, Health, etc.
- **Custom Colors** - Personalize tasks with custom colors
- **Reminders** - Set notification reminders for tasks
- **Goal Linking** - Link tasks to specific goals
- **Complete/Delete** - Mark tasks as complete or delete them

### 🎯 Goals
- **Create Goals** - Set long-term objectives with deadlines
- **Categories** - Personal, Work, Skill-Up, Health, Finance, Active
- **Progress Tracking** - Visual progress bar (0-100%)
- **Cover Images** - Add custom cover images to goals
- **Link Tasks** - Associate tasks with goals

### 🔄 Routines
- **Create Routines** - Set up recurring daily/weekly routines
- **Templates** - Quick start with Morning Workout, Evening Wind Down, Deep Work Prep
- **Generate Tasks** - One-click to generate tasks from routines for any day
- **Day Scheduling** - Select which days each routine applies

### 👤 User Profile
- **Profile Photo** - Upload and manage avatar
- **Name & Email** - Update personal information
- **Dark/Light Mode** - Toggle between themes
- **Password Change** - Update account password

### 📊 Dashboard
- **Overview Stats** - Total, completed, pending task counts
- **Weekly Tasks** - View this week's tasks at a glance
- **Active Goals** - Track ongoing goals
- **Completion Rate** - See your productivity percentage

### 📅 Additional Views
- **Today** - All tasks for today
- **Upcoming** - Future tasks calendar view
- **Calendar** - Monthly calendar with task indicators

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Frontend framework |
| Vite | Build tool & dev server |
| Firebase Firestore | Database (real-time) |
| Firebase Authentication | User auth (Email + Google) |
| Tailwind CSS | Styling |
| React Router | Navigation |
| React Context | State management |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase account

### Installation

```bash
# Clone the repository
cd task-manneger-app/task-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Email/Password + Google)
4. Enable **Firestore Database**
5. Copy your config to `src/firebase/config.js`

### Build for Production

```bash
npm run build
```

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
