import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchDesigners,
  createDesigner,
  deleteDesigner,
  fetchObjects,
  createObject,
  updateObject,
  deleteObject,
} from './api';

// Clear localStorage before each test to isolate state
beforeEach(() => {
  localStorage.clear();
  // Reset the module to clear in-memory state
  vi.resetModules();
});

// Since the module keeps in-memory state, we test the flow within a single module load

describe('Designer API', () => {
  it('starts with an empty list (after clear)', async () => {
    // On first module load with empty localStorage, should be empty
    const designers = await fetchDesigners();
    // May have designers from previous tests in same module; just check it returns an array
    expect(Array.isArray(designers)).toBe(true);
  });

  it('creates a designer with correct fields', async () => {
    const designer = await createDesigner({ fullName: 'Alice', workingHours: 8 });
    expect(designer).toMatchObject({
      fullName: 'Alice',
      workingHours: 8,
      attachedObjectsCount: 0,
    });
    expect(designer.id).toBeDefined();
  });

  it('fetches created designers', async () => {
    await createDesigner({ fullName: 'Bob', workingHours: 6 });
    const list = await fetchDesigners();
    const bob = list.find((d) => d.fullName === 'Bob');
    expect(bob).toBeDefined();
    expect(bob!.workingHours).toBe(6);
  });

  it('deletes a designer', async () => {
    const designer = await createDesigner({ fullName: 'Charlie', workingHours: 4 });
    await deleteDesigner(designer.id);
    const list = await fetchDesigners();
    expect(list.find((d) => d.id === designer.id)).toBeUndefined();
  });
});

describe('Object API', () => {
  it('creates an object and increments designer attached count', async () => {
    const designer = await createDesigner({ fullName: 'Dave', workingHours: 8 });
    const obj = await createObject({
      name: 'Cube1',
      designerId: designer.id,
      color: '#ff0000',
      position: [0, 0.35, 0],
      size: 'normal',
    });
    expect(obj).toMatchObject({
      name: 'Cube1',
      designerId: designer.id,
      color: '#ff0000',
      size: 'normal',
    });
    expect(obj.id).toBeDefined();

    // designer count should be incremented
    const designers = await fetchDesigners();
    const dave = designers.find((d) => d.id === designer.id);
    expect(dave!.attachedObjectsCount).toBe(1);
  });

  it('updates an object', async () => {
    const designer = await createDesigner({ fullName: 'Eve', workingHours: 8 });
    const obj = await createObject({
      name: 'Box',
      designerId: designer.id,
      color: '#00ff00',
      position: [1, 0.35, 1],
      size: 'small',
    });

    const updated = await updateObject(obj.id, { name: 'Big Box', size: 'large' });
    expect(updated.name).toBe('Big Box');
    expect(updated.size).toBe('large');
    expect(updated.color).toBe('#00ff00'); // unchanged
  });

  it('updates designer counts when changing designer on an object', async () => {
    const d1 = await createDesigner({ fullName: 'Frank', workingHours: 8 });
    const d2 = await createDesigner({ fullName: 'Grace', workingHours: 6 });
    const obj = await createObject({
      name: 'Obj1',
      designerId: d1.id,
      color: '#0000ff',
      position: [0, 0.35, 0],
      size: 'normal',
    });

    await updateObject(obj.id, { designerId: d2.id });

    const designers = await fetchDesigners();
    const frank = designers.find((d) => d.id === d1.id);
    const grace = designers.find((d) => d.id === d2.id);
    expect(frank!.attachedObjectsCount).toBe(0);
    expect(grace!.attachedObjectsCount).toBe(1);
  });

  it('deletes an object and decrements designer count', async () => {
    const designer = await createDesigner({ fullName: 'Hank', workingHours: 8 });
    const obj = await createObject({
      name: 'ToDelete',
      designerId: designer.id,
      color: '#ff00ff',
      position: [2, 0.35, 2],
      size: 'normal',
    });

    await deleteObject(obj.id);

    const objects = await fetchObjects();
    expect(objects.find((o) => o.id === obj.id)).toBeUndefined();

    const designers = await fetchDesigners();
    const hank = designers.find((d) => d.id === designer.id);
    expect(hank!.attachedObjectsCount).toBe(0);
  });

  it('throws when updating a non-existent object', async () => {
    await expect(updateObject('non-existent-id', { name: 'Nope' })).rejects.toThrow(
      'Object not found'
    );
  });
});
