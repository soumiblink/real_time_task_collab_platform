import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  deleteDoc, 
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from './config';
import { initialTasks, initialGoals, initialRoutines } from '../data/initialData';

const DB_BASE = 'users';

// Helper to get profile document (stored directly in user doc, 2 segments)
const getProfileDoc = (uid) => doc(db, `${DB_BASE}/${uid}`);

const seedInitialData = async (uid) => {
  try {
    const tasksSnapshot = await getDocs(collection(db, `${DB_BASE}/${uid}/tasks`));
    if (tasksSnapshot.size > 0) return;

    const tasksRef = collection(db, `${DB_BASE}/${uid}/tasks`);
    for (const task of initialTasks) {
      const newTaskRef = doc(tasksRef);
      await setDoc(newTaskRef, {
        ...task,
        id: newTaskRef.id,
        completed: false,
        createdAt: new Date().toISOString()
      });
    }

    const goalsRef = collection(db, `${DB_BASE}/${uid}/goals`);
    for (const goal of initialGoals) {
      const newGoalRef = doc(goalsRef);
      await setDoc(newGoalRef, {
        ...goal,
        id: newGoalRef.id,
        createdAt: new Date().toISOString()
      });
    }

    const routinesRef = collection(db, `${DB_BASE}/${uid}/routines`);
    for (const routine of initialRoutines) {
      const newRoutineRef = doc(routinesRef);
      await setDoc(newRoutineRef, {
        ...routine,
        id: newRoutineRef.id,
        createdAt: new Date().toISOString()
      });
    }

    console.log('Initial data seeded for user:', uid);
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

export const authService = {
  subscribe(callback) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  },

  async login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  async signup(name, email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    
    await this.createProfile(result.user.uid, {
      name,
      email,
      createdAt: new Date().toISOString()
    });
    
    await seedInitialData(result.user.uid);
    
    return result.user;
  },

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const existingProfile = await this.getProfile(result.user.uid);
    if (!existingProfile) {
      await this.createProfile(result.user.uid, {
        name: result.user.displayName || 'User',
        email: result.user.email,
        avatar: result.user.photoURL,
        createdAt: new Date().toISOString()
      });
      await seedInitialData(result.user.uid);
    }
    
    return result.user;
  },

  async logout() {
    await signOut(auth);
  },

  async updateUserProfile(updates) {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, updates);
    }
  },

  async changePassword(currentPassword, newPassword) {
    if (!auth.currentUser) throw new Error('No user logged in');
    
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  },

  getCurrentUser() {
    return auth.currentUser;
  }
};

export const profileService = {
  async getProfile(uid) {
    const snapshot = await getDoc(getProfileDoc(uid));
    return snapshot.exists() ? snapshot.data() : null;
  },

  async createProfile(uid, profileData) {
    try {
      await setDoc(getProfileDoc(uid), profileData);
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  async updateProfile(uid, updates) {
    try {
      await updateDoc(getProfileDoc(uid), updates);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  subscribeToProfile(uid, callback) {
    const unsubscribe = onSnapshot(getProfileDoc(uid), (snapshot) => {
      callback(snapshot.exists() ? snapshot.data() : null);
    });
    return unsubscribe;
  }
};

export const taskService = {
  async getTasks(uid) {
    const snapshot = await getDocs(collection(db, `${DB_BASE}/${uid}/tasks`));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async addTask(uid, taskData) {
    const tasksRef = collection(db, `${DB_BASE}/${uid}/tasks`);
    const newTaskRef = doc(tasksRef);
    const taskId = newTaskRef.id;
    
    const newTask = {
      ...taskData,
      id: taskId,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(newTaskRef, newTask);
    return newTask;
  },

  async updateTask(uid, taskId, updates) {
    await updateDoc(doc(db, `${DB_BASE}/${uid}/tasks/${taskId}`), updates);
  },

  async deleteTask(uid, taskId) {
    await deleteDoc(doc(db, `${DB_BASE}/${uid}/tasks/${taskId}`));
  },

  async toggleComplete(uid, taskId, currentStatus) {
    await updateDoc(doc(db, `${DB_BASE}/${uid}/tasks/${taskId}`), {
      completed: !currentStatus
    });
  },

  subscribeToTasks(uid, callback) {
    return onSnapshot(collection(db, `${DB_BASE}/${uid}/tasks`), (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(tasks);
    });
  }
};

export const goalService = {
  async getGoals(uid) {
    const snapshot = await getDocs(collection(db, `${DB_BASE}/${uid}/goals`));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async addGoal(uid, goalData) {
    const goalsRef = collection(db, `${DB_BASE}/${uid}/goals`);
    const newGoalRef = doc(goalsRef);
    const goalId = newGoalRef.id;
    
    const newGoal = {
      ...goalData,
      id: goalId,
      createdAt: new Date().toISOString(),
      progress: goalData.progress || 0
    };
    
    await setDoc(newGoalRef, newGoal);
    return newGoal;
  },

  async updateGoal(uid, goalId, updates) {
    await updateDoc(doc(db, `${DB_BASE}/${uid}/goals/${goalId}`), updates);
  },

  async deleteGoal(uid, goalId) {
    await deleteDoc(doc(db, `${DB_BASE}/${uid}/goals/${goalId}`));
  },

  subscribeToGoals(uid, callback) {
    return onSnapshot(collection(db, `${DB_BASE}/${uid}/goals`), (snapshot) => {
      const goals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(goals);
    });
  }
};

export const routineService = {
  async getRoutines(uid) {
    const snapshot = await getDocs(collection(db, `${DB_BASE}/${uid}/routines`));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async addRoutine(uid, routineData) {
    const routinesRef = collection(db, `${DB_BASE}/${uid}/routines`);
    const newRoutineRef = doc(routinesRef);
    const routineId = newRoutineRef.id;
    
    const newRoutine = {
      ...routineData,
      id: routineId,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(newRoutineRef, newRoutine);
    return newRoutine;
  },

  async updateRoutine(uid, routineId, updates) {
    await updateDoc(doc(db, `${DB_BASE}/${uid}/routines/${routineId}`), updates);
  },

  async deleteRoutine(uid, routineId) {
    await deleteDoc(doc(db, `${DB_BASE}/${uid}/routines/${routineId}`));
  },

  subscribeToRoutines(uid, callback) {
    return onSnapshot(collection(db, `${DB_BASE}/${uid}/routines`), (snapshot) => {
      const routines = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(routines);
    });
  }
};

export const reminderService = {
  async getReminders(uid) {
    const snapshot = await getDocs(collection(db, `${DB_BASE}/${uid}/reminders`));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async addReminder(uid, reminderData) {
    const remindersRef = collection(db, `${DB_BASE}/${uid}/reminders`);
    const newReminderRef = doc(remindersRef);
    const reminderId = newReminderRef.id;
    
    const newReminder = {
      ...reminderData,
      id: reminderId,
      triggered: false,
      dismissed: false,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(newReminderRef, newReminder);
    return newReminder;
  },

  async updateReminder(uid, reminderId, updates) {
    await updateDoc(doc(db, `${DB_BASE}/${uid}/reminders/${reminderId}`), updates);
  },

  async deleteReminder(uid, reminderId) {
    await deleteDoc(doc(db, `${DB_BASE}/${uid}/reminders/${reminderId}`));
  },

  async deleteRemindersByTask(uid, taskId) {
    const reminders = await this.getReminders(uid);
    const taskReminders = reminders.filter(r => r.taskId === taskId);
    
    for (const reminder of taskReminders) {
      await this.deleteReminder(uid, reminder.id);
    }
  },

  subscribeToReminders(uid, callback) {
    return onSnapshot(collection(db, `${DB_BASE}/${uid}/reminders`), (snapshot) => {
      const reminders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(reminders);
    });
  }
};
