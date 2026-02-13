import { create } from 'zustand';
import type { SceneObject } from '../types';
import * as api from '../api/api';

interface ObjectStore {
  objects: SceneObject[];
  loading: boolean;
  load: () => Promise<void>;
  add: (data: Omit<SceneObject, 'id'>) => Promise<void>;
  update: (id: string, updates: Partial<Omit<SceneObject, 'id'>>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  moveObject: (id: string, position: [number, number, number]) => void;
}

export const useObjectStore = create<ObjectStore>((set) => ({
  objects: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const objects = await api.fetchObjects();
    set({ objects, loading: false });
  },

  add: async (data) => {
    const obj = await api.createObject(data);
    set((s) => ({ objects: [...s.objects, obj] }));
  },

  update: async (id, updates) => {
    const updated = await api.updateObject(id, updates);
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? updated : o)),
    }));
  },

  remove: async (id) => {
    await api.deleteObject(id);
    set((s) => ({ objects: s.objects.filter((o) => o.id !== id) }));
  },

  // instant local update for smooth dragging, no API call
  moveObject: (id, position) => {
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, position } : o)),
    }));
  },
}));
