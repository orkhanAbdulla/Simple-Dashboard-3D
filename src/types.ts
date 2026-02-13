export interface Designer {
  id: string;
  fullName: string;
  workingHours: number;
  attachedObjectsCount: number;
}

export type ObjectSize = 'small' | 'normal' | 'large';

export interface SceneObject {
  id: string;
  name: string;
  designerId: string;
  color: string;
  position: [number, number, number];
  size: ObjectSize;
}
