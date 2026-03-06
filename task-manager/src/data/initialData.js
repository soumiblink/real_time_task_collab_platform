const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

export const initialTasks = [
  {
    title: 'Morning Standup',
    description: 'Review team goals for the week and identify blockers.',
    date: today.toISOString().split('T')[0],
    time: '09:00',
    priority: 'medium',
    category: 'Work',
    completed: false,
  },
  {
    title: 'Deep Work: Project Alpha',
    description: 'Focus on the core API architectural changes and database migration script.',
    date: today.toISOString().split('T')[0],
    time: '11:00',
    priority: 'high',
    category: 'Engineering',
    completed: false,
  },
  {
    title: 'Client Call',
    description: 'Brief update call with the marketing team regarding the new campaign launch.',
    date: today.toISOString().split('T')[0],
    time: '14:00',
    priority: 'low',
    category: 'External',
    completed: false,
  },
  {
    title: 'Design Mobile Onboarding Flow',
    description: 'Create wireframes and mockups for the new user onboarding experience.',
    date: tomorrow.toISOString().split('T')[0],
    time: '14:00',
    priority: 'high',
    category: 'Design',
    completed: false,
  },
  {
    title: 'Review Q3 Marketing Strategy',
    description: "Go through the marketing team's proposed strategy for Q3.",
    date: tomorrow.toISOString().split('T')[0],
    time: '10:00',
    priority: 'medium',
    category: 'Marketing',
    completed: false,
  },
  {
    title: 'Weekly Performance Sync',
    description: 'Review team metrics and discuss improvements.',
    date: dayAfter.toISOString().split('T')[0],
    time: '09:00',
    priority: 'low',
    category: 'Management',
    completed: false,
  },
  {
    title: 'API Integration for Payment Gateway',
    description: 'Implement Stripe payment gateway integration.',
    date: dayAfter.toISOString().split('T')[0],
    time: '11:00',
    priority: 'high',
    category: 'Engineering',
    completed: false,
  },
  {
    title: 'Quarterly Planning',
    description: 'Set goals and OKRs for the upcoming quarter.',
    date: nextWeek.toISOString().split('T')[0],
    time: '09:00',
    priority: 'high',
    category: 'Strategy',
    completed: false,
  },
];

export const initialGoals = [
  {
    title: 'Master UI Design',
    description: 'Become proficient in UI design principles and tools.',
    deadline: '2025-12-31',
    category: 'Skill-Up',
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
  },
  {
    title: 'Launch Portfolio',
    description: 'Create and launch my personal portfolio website.',
    deadline: '2025-11-15',
    category: 'Active',
    progress: 72,
    imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400',
  },
  {
    title: 'Read 12 Books',
    description: 'Read 12 books this year across various topics.',
    deadline: '2025-12-20',
    category: 'Personal',
    progress: 25,
    imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
  },
  {
    title: 'Learn React',
    description: 'Master React and build production applications.',
    deadline: '2025-01-10',
    category: 'Skill-Up',
    progress: 10,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
  },
];

export const initialRoutines = [
  {
    title: 'Morning Routine',
    startTime: '07:30',
    color: '#f59e0b',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    tasks: [
      { title: '10-minute meditation', time: '07:35' },
      { title: 'Review daily calendar & goals', time: '07:45' },
      { title: 'High-protein breakfast', time: '08:00' },
      { title: 'Read 5 pages of current book', time: '08:20' },
    ],
  },
  {
    title: 'Weekly Review',
    startTime: '16:00',
    color: '#8b5cf6',
    days: ['Fri'],
    tasks: [
      { title: 'Review weekly accomplishments', time: '16:00' },
      { title: 'Plan next week priorities', time: '16:30' },
      { title: 'Organize inbox', time: '17:00' },
    ],
  },
];

export const categories = [
  { name: 'Work', icon: 'work' },
  { name: 'Personal', icon: 'person' },
  { name: 'Health', icon: 'fitness_center' },
  { name: 'Finance', icon: 'account_balance' },
  { name: 'Design', icon: 'palette' },
  { name: 'Engineering', icon: 'code' },
  { name: 'Marketing', icon: 'campaign' },
  { name: 'Management', icon: 'supervisor_account' },
  { name: 'External', icon: 'groups' },
  { name: 'Strategy', icon: 'lightbulb' },
];

export const priorityColors = {
  low: 'green',
  medium: 'orange',
  high: 'red',
};
