import type { Designer, SceneObject } from '../types';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

let designers: Designer[] = loadFromStorage<Designer>('db_designers', []);
let objects: SceneObject[] = loadFromStorage<SceneObject>('db_objects', []);

function persist() {
  localStorage.setItem('db_designers', JSON.stringify(designers));
  localStorage.setItem('db_objects', JSON.stringify(objects));
}

// --- Designers ---

export async function fetchDesigners(): Promise<Designer[]> {
  await delay();
  return designers.map((d) => ({ ...d }));
}

export async function createDesigner(
  data: Pick<Designer, 'fullName' | 'workingHours'>
): Promise<Designer> {
  await delay();
  const designer: Designer = {
    id: crypto.randomUUID(),
    fullName: data.fullName,
    workingHours: data.workingHours,
    attachedObjectsCount: 0,
  };
  designers.push(designer);
  persist();
  return { ...designer };
}

export async function deleteDesigner(id: string): Promise<void> {
  await delay();
  designers = designers.filter((d) => d.id !== id);
  persist();
}

// --- Objects ---

export async function fetchObjects(): Promise<SceneObject[]> {
  await delay();
  return objects.map((o) => ({ ...o, position: [...o.position] as [number, number, number] }));
}

export async function createObject(
  data: Omit<SceneObject, 'id'>
): Promise<SceneObject> {
  await delay();
  const obj: SceneObject = {
    id: crypto.randomUUID(),
    ...data,
  };
  objects.push(obj);
  // increment attached count on the designer
  const designer = designers.find((d) => d.id === obj.designerId);
  if (designer) designer.attachedObjectsCount++;
  persist();
  return { ...obj };
}

export async function updateObject(
  id: string,
  updates: Partial<Omit<SceneObject, 'id'>>
): Promise<SceneObject> {
  await delay();
  const idx = objects.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error('Object not found');

  const old = objects[idx];

  // if designer changed, update counts
  if (updates.designerId && updates.designerId !== old.designerId) {
    const prev = designers.find((d) => d.id === old.designerId);
    const next = designers.find((d) => d.id === updates.designerId);
    if (prev) prev.attachedObjectsCount = Math.max(0, prev.attachedObjectsCount - 1);
    if (next) next.attachedObjectsCount++;
  }

  objects[idx] = { ...old, ...updates };
  persist();
  return { ...objects[idx] };
}

export async function deleteObject(id: string): Promise<void> {
  await delay();
  const obj = objects.find((o) => o.id === id);
  if (obj) {
    const designer = designers.find((d) => d.id === obj.designerId);
    if (designer) designer.attachedObjectsCount = Math.max(0, designer.attachedObjectsCount - 1);
  }
  objects = objects.filter((o) => o.id !== id);
  persist();
}
