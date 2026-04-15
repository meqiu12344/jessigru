import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
};

export type GoalType = "financial" | "days" | "quantity" | "travel" | "custom";

export type Goal = {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  currentValue: number;
  targetValue: number;
  unit: string;
  icon: string;
  targetDate?: string;
  completed: boolean;
  createdAt: string;
};

export type GoalFormData = {
  title: string;
  description: string;
  type: GoalType;
  currentValue: number;
  targetValue: number;
  unit: string;
  icon: string;
  targetDate?: string;
};

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(FIREBASE_CONFIG).every(
  (val) => Boolean(val),
);

const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
};

export const isCloudinaryConfigured = [
  CLOUDINARY_CONFIG.cloudName,
  CLOUDINARY_CONFIG.uploadPreset,
].every((val) => Boolean(val));

let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured && typeof window !== "undefined") {
  firebaseApp = initializeApp(FIREBASE_CONFIG);
  db = getFirestore(firebaseApp);
}

export type FirestoreEvent = {
  event_date: string;
  title: string;
  description: string;
  image_url: string;
  image_provider?: "cloudinary" | "firebase_storage";
  image_public_id?: string;
};

export function normalizeDate(date: string) {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) {
    return date;
  }

  return `${day}.${month}.${year}`;
}

function toIsoDate(date: string) {
  const dashFormat = /^\d{4}-\d{2}-\d{2}$/;
  if (dashFormat.test(date)) {
    return date;
  }

  const dotFormat = /^\d{2}\.\d{2}\.\d{4}$/;
  if (dotFormat.test(date)) {
    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}`;
  }

  return date;
}

export function toSortableDate(date: string) {
  const dashFormat = /^\d{4}-\d{2}-\d{2}$/;
  if (dashFormat.test(date)) {
    return date;
  }

  const dotFormat = /^\d{2}\.\d{2}\.\d{4}$/;
  if (dotFormat.test(date)) {
    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}`;
  }

  return "0000-00-00";
}

async function uploadImageToCloudinary(file: File) {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary nie jest skonfigurowany");
  }

  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset ?? "");

  if (CLOUDINARY_CONFIG.folder) {
    formData.append("folder", CLOUDINARY_CONFIG.folder);
  }

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Nie udało się przesłać zdjęcia do Cloudinary");
  }

  const payload = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
  };

  if (!payload.secure_url) {
    throw new Error("Cloudinary zwróciło nieprawidłową odpowiedź");
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id,
  };
}



function mapFirestoreDocToTimelineEvent(
  docId: string,
  data: FirestoreEvent,
): TimelineEvent {
  return {
    id: docId,
    date: normalizeDate(data.event_date),
    title: data.title,
    description: data.description,
    image: data.image_url,
  };
}

export async function fetchTimelineEvents() {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase nie jest skonfigurowany");
  }

  try {
    const eventsCollection = collection(db, "relationship_events");
    const querySnapshot = await getDocs(eventsCollection);

    const events: TimelineEvent[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreEvent;
      events.push(mapFirestoreDocToTimelineEvent(doc.id, data));
    });

    const sorted = events.sort((a, b) => {
      return toSortableDate(a.date) > toSortableDate(b.date) ? 1 : -1;
    });

    return sorted;
  } catch {
    throw new Error("Nie udało się załadować wydarzeń z Firebase");
  }
}

export async function createTimelineEvent(input: {
  date: string;
  title: string;
  description: string;
  imageFile: File;
}) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase nie jest skonfigurowany");
  }

  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary nie jest skonfigurowany");
  }

  try {
    const cloudinaryImage = await uploadImageToCloudinary(input.imageFile);

    const eventDate = toIsoDate(input.date);

    const eventsCollection = collection(db, "relationship_events");
    const docRef = await addDoc(eventsCollection, {
      event_date: eventDate,
      title: input.title.trim(),
      description: input.description.trim(),
      image_url: cloudinaryImage.url,
      image_provider: "cloudinary",
      image_public_id: cloudinaryImage.publicId ?? null,
      created_at: Timestamp.now(),
    });

    const newEvent: TimelineEvent = {
      id: docRef.id,
      date: normalizeDate(eventDate),
      title: input.title.trim(),
      description: input.description.trim(),
      image: cloudinaryImage.url,
    };

    return newEvent;
  } catch {
    throw new Error(
      "Nie udało się zapisać wydarzenia. Sprawdź konfigurację Firebase i Cloudinary.",
    );
  }
}

type FirestoreGoal = {
  title: string;
  description: string;
  type: GoalType;
  current_value: number;
  target_value: number;
  unit: string;
  icon: string;
  target_date?: string;
  completed: boolean;
  created_at: Timestamp;
};

function mapFirestoreDocToGoal(docId: string, data: FirestoreGoal): Goal {
  return {
    id: docId,
    title: data.title,
    description: data.description,
    type: data.type,
    currentValue: data.current_value,
    targetValue: data.target_value,
    unit: data.unit,
    icon: data.icon,
    targetDate: data.target_date,
    completed: data.completed,
    createdAt: data.created_at.toDate().toISOString(),
  };
}

export async function fetchGoals() {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase nie jest skonfigurowany");
  }

  try {
    const goalsCollection = collection(db, "goals");
    const querySnapshot = await getDocs(goalsCollection);

    const goals: Goal[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreGoal;
      goals.push(mapFirestoreDocToGoal(doc.id, data));
    });

    return goals;
  } catch {
    throw new Error("Nie udało się załadować celów z Firebase");
  }
}

export async function createGoal(input: GoalFormData) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase nie jest skonfigurowany");
  }

  try {
    const goalsCollection = collection(db, "goals");
    const docRef = await addDoc(goalsCollection, {
      title: input.title.trim(),
      description: input.description.trim(),
      type: input.type,
      current_value: input.currentValue,
      target_value: input.targetValue,
      unit: input.unit,
      icon: input.icon,
      target_date: input.targetDate || null,
      completed: false,
      created_at: Timestamp.now(),
    });

    const newGoal: Goal = {
      id: docRef.id,
      title: input.title.trim(),
      description: input.description.trim(),
      type: input.type,
      currentValue: input.currentValue,
      targetValue: input.targetValue,
      unit: input.unit,
      icon: input.icon,
      targetDate: input.targetDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    return newGoal;
  } catch {
    throw new Error("Nie udało się zapisać celu. Sprawdź konfigurację Firebase.");
  }
}

export async function updateGoal(goalId: string, updates: Partial<GoalFormData>) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase nie jest skonfigurowany");
  }

  try {
    const goalDoc = doc(db, "goals", goalId);
    const firestoreUpdates: Record<string, unknown> = {};

    if (updates.title !== undefined) firestoreUpdates["title"] = updates.title.trim();
    if (updates.description !== undefined) firestoreUpdates["description"] = updates.description.trim();
    if (updates.type !== undefined) firestoreUpdates["type"] = updates.type;
    if (updates.currentValue !== undefined) firestoreUpdates["current_value"] = updates.currentValue;
    if (updates.targetValue !== undefined) firestoreUpdates["target_value"] = updates.targetValue;
    if (updates.unit !== undefined) firestoreUpdates["unit"] = updates.unit;
    if (updates.icon !== undefined) firestoreUpdates["icon"] = updates.icon;
    if (updates.targetDate !== undefined) firestoreUpdates["target_date"] = updates.targetDate || null;

    await updateDoc(goalDoc, firestoreUpdates);
  } catch {
    throw new Error("Nie udało się zaktualizować celu");
  }
}

export async function completeGoal(goalId: string) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase nie jest skonfigurowany");
  }

  try {
    const goalDoc = doc(db, "goals", goalId);
    await updateDoc(goalDoc, { completed: true });
  } catch {
    throw new Error("Nie udało się oznaczyć celu jako ukończonego");
  }
}

export async function deleteGoal(goalId: string) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase nie jest skonfigurowany");
  }

  try {
    const goalDoc = doc(db, "goals", goalId);
    await deleteDoc(goalDoc);
  } catch {
    throw new Error("Nie udało się usunąć celu");
  }
}
