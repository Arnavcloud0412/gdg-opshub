
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: Timestamp;
  time: string;
  venue: string;
  tags: string[];
  created_by: string;
  banner_url?: string;
  assigned_members: string[];
  tasks: string[];
  photos: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: Timestamp;
}

export interface Task {
  id?: string;
  title: string;
  event_id: string;
  assigned_to: string;
  assigned_by: string;
  status: 'pending' | 'in_progress' | 'done';
  due_date: Timestamp;
  points: number;
  created_at: Timestamp;
  completed_at?: Timestamp;
}

export interface Member {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'core' | 'volunteer';
  skills: string[];
  profile_photo: string;
  xp: number;
  joined_at: Timestamp;
  event_history: string[];
  total_tasks_completed: number;
}

// Events
export const getEvents = async (): Promise<Event[]> => {
  const eventsCollection = collection(db, 'events');
  const eventsSnapshot = await getDocs(query(eventsCollection, orderBy('date', 'desc')));
  return eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
};

export const createEvent = async (event: Omit<Event, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'events'), event);
  return docRef.id;
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<void> => {
  const eventDoc = doc(db, 'events', id);
  await updateDoc(eventDoc, event);
};

// Tasks
export const getTasks = async (): Promise<Task[]> => {
  const tasksCollection = collection(db, 'tasks');
  const tasksSnapshot = await getDocs(query(tasksCollection, orderBy('created_at', 'desc')));
  return tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'tasks'), task);
  return docRef.id;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<void> => {
  const taskDoc = doc(db, 'tasks', id);
  await updateDoc(taskDoc, task);
};

// Members
export const getMembers = async (): Promise<Member[]> => {
  const membersCollection = collection(db, 'users');
  const membersSnapshot = await getDocs(membersCollection);
  return membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
};

// Documentation
export const saveGeneratedDoc = async (eventId: string, content: any): Promise<void> => {
  const docRef = doc(db, 'docs', eventId);
  await updateDoc(docRef, {
    ...content,
    generated_at: Timestamp.now()
  });
};
