import { ref, push, set, onValue, update } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

export const addNotification = async (notification) => {
  const newRef = push(ref(db, 'notifications'));
  await set(newRef, { ...notification, id: newRef.key });
  return newRef.key;
};

export const getNotifications = (userId, callback) => {
  const refDb = ref(db, 'notifications');
  return onValue(refDb, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const items = Object.values(data).filter((item) => item.userId === userId);
    items.sort((a, b) => b.createdAt - a.createdAt);
    callback(items);
  });
};

export const markAsRead = async (id) => {
  await update(ref(db, `notifications/${id}`), { read: true });
};

export const getUnreadCount = (userId, callback) => {
  const refDb = ref(db, 'notifications');
  return onValue(refDb, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback(0);
      return;
    }
    const count = Object.values(data).filter(
      (item) => item.userId === userId && !item.read
    ).length;
    callback(count);
  });
};
