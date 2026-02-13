import { create } from 'zustand';
import type { Designer } from '../types';
import * as api from '../api/api';

interface DesignerStore {
  designers: Designer[];
  loading: boolean;
  load: () => Promise<void>;
  add: (data: Pick<Designer, 'fullName' | 'workingHours'>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useDesignerStore = create<DesignerStore>((set) => ({
  designers: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const designers = await api.fetchDesigners();
    set({ designers, loading: false });
  },

  add: async (data) => {
    const designer = await api.createDesigner(data);
    set((s) => ({ designers: [...s.designers, designer] }));
  },

  remove: async (id) => {
    await api.deleteDesigner(id);
    set((s) => ({ designers: s.designers.filter((d) => d.id !== id) }));
  },

  refresh: async () => {
    const designers = await api.fetchDesigners();
    set({ designers });
  },
}));
