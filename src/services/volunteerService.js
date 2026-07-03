import { ref, push, set, get, onValue } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

export const addVolunteer = async (volunteer) => {
  const newRef = push(ref(db, 'volunteers'));
  await set(newRef, { ...volunteer, id: newRef.key });
  return newRef.key;
};

export const getVolunteers = (callback) => {
  const refDb = ref(db, 'volunteers');
  return onValue(refDb, (snapshot) => {
    const data = snapshot.val();
    const items = data ? Object.values(data) : [];
    callback(items);
  });
};

export const getAllVolunteers = async () => {
  const snapshot = await get(ref(db, 'volunteers'));
  return snapshot.val();
};
