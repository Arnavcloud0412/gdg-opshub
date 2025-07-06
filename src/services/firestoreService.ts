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

export const deleteEvent = async (id: string): Promise<void> => {
  const eventDoc = doc(db, 'events', id);
  await deleteDoc(eventDoc);
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

export const deleteTask = async (id: string): Promise<void> => {
  const taskDoc = doc(db, 'tasks', id);
  await deleteDoc(taskDoc);
};

// Members
export const getMembers = async (): Promise<Member[]> => {
  const membersCollection = collection(db, 'users');
  const membersSnapshot = await getDocs(membersCollection);
  return membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
};

export const createMember = async (member: Omit<Member, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'users'), member);
  return docRef.id;
};

export const updateMember = async (id: string, member: Partial<Member>): Promise<void> => {
  const memberDoc = doc(db, 'users', id);
  await updateDoc(memberDoc, member);
};

export const deleteMember = async (id: string): Promise<void> => {
  const memberDoc = doc(db, 'users', id);
  await deleteDoc(memberDoc);
};

// Documentation
export const saveGeneratedDoc = async (eventId: string, content: any): Promise<void> => {
  const docRef = doc(db, 'docs', eventId);
  const docData = {
    ...content,
    generated_at: Timestamp.now()
  };
  console.log('[saveGeneratedDoc] eventId:', eventId);
  console.log('[saveGeneratedDoc] content:', content);
  console.log('[saveGeneratedDoc] docData to be saved:', docData);
  await updateDoc(docRef, docData);
};

export const getEventDocumentation = async (eventId: string): Promise<any> => {
  const docRef = doc(db, 'docs', eventId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

/**
 * Adds XP to multiple members and updates their event history when an event is completed.
 * @param memberIds Array of member IDs to update
 * @param eventId The event ID to add to event_history
 * @param xpAmount The amount of XP to add to each member
 */
export const addXpToMembersForEvent = async (memberIds: string[], eventId: string, xpAmount: number) => {
  const updates = memberIds.map(async (memberId) => {
    const memberDocRef = doc(db, 'users', memberId);
    const memberSnap = await getDoc(memberDocRef);
    if (!memberSnap.exists()) return;
    const memberData = memberSnap.data() as Member;
    const newXp = (memberData.xp || 0) + xpAmount;
    const newEventHistory = Array.isArray(memberData.event_history)
      ? Array.from(new Set([...memberData.event_history, eventId]))
      : [eventId];
    await updateDoc(memberDocRef, {
      xp: newXp,
      event_history: newEventHistory
    });
  });
  await Promise.all(updates);
};

/**
 * Adds XP to a member for completing a task and increments their total_tasks_completed.
 * @param memberId The member's ID
 * @param taskId The task ID (for future extensibility)
 * @param xpAmount The amount of XP to add
 */
export const addXpToMemberForTask = async (memberId: string, taskId: string, xpAmount: number) => {
  const memberDocRef = doc(db, 'users', memberId);
  const memberSnap = await getDoc(memberDocRef);
  if (!memberSnap.exists()) return;
  const memberData = memberSnap.data() as Member;
  const newXp = (memberData.xp || 0) + xpAmount;
  const newTotalTasks = (memberData.total_tasks_completed || 0) + 1;
  await updateDoc(memberDocRef, {
    xp: newXp,
    total_tasks_completed: newTotalTasks
  });
};
