import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCC0deKqf9TOD4895aWlW-9DCL_6HC2us8",
  authDomain: "task-manager-b37a5.firebaseapp.com",
  projectId: "task-manager-b37a5",
  storageBucket: "task-manager-b37a5.firebasestorage.app",
  messagingSenderId: "88250239055",
  appId: "1:88250239055:web:0d1e442ac143ec8e0d023a",
  measurementId: "G-FTG6NE1EFN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
