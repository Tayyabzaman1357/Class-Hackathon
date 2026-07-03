import { ref, push, set, get, onValue, update } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

export const addLostFoundItem = async (item) => {
  const newRef = push(ref(db, 'lost_found_items'));
  await set(newRef, { ...item, id: newRef.key });
  return newRef.key;
};

export const getLostFoundItems = (callback) => {
  const itemsRef = ref(db, 'lost_found_items');
  return onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    const items = data ? Object.values(data) : [];
    callback(items);
  });
};

export const updateLostFoundStatus = async (id, status) => {
  await update(ref(db, `lost_found_items/${id}`), { status });
};

export const getAllLostFoundItems = async () => {
  const snapshot = await get(ref(db, 'lost_found_items'));
  return snapshot.val();
};
