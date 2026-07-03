import { ref, push, set, get, onValue, update } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

export const addComplaint = async (complaint) => {
  const newRef = push(ref(db, 'complaints'));
  await set(newRef, { ...complaint, id: newRef.key });
  return newRef.key;
};

export const getComplaints = (callback) => {
  const refDb = ref(db, 'complaints');
  return onValue(refDb, (snapshot) => {
    const data = snapshot.val();
    const items = data ? Object.values(data) : [];
    callback(items);
  });
};

export const updateComplaintStatus = async (id, status) => {
  await update(ref(db, `complaints/${id}`), { status });
};

export const getAllComplaints = async () => {
  const snapshot = await get(ref(db, 'complaints'));
  return snapshot.val();
};
