import { auth } from '../firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

export const signupUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await set(ref(db, `users/${user.uid}`), {
    name,
    email,
    role: 'user',
    createdAt: Date.now(),
  });

  return user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getUserData = async (uid) => {
  const snapshot = await get(ref(db, `users/${uid}`));
  return snapshot.val();
};

export { onAuthStateChanged };
