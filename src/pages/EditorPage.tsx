import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';
import AddObjectModal from '../components/AddObjectModal';
import PropertiesPanel from '../components/PropertiesPanel';
import { useObjectStore } from '../store/objectStore';
import { useDesignerStore } from '../store/designerStore';

const EditorPage = () => {
  const { load: loadObjects, add: addObject, remove: removeObject } = useObjectStore();
  const { load: loadDesigners } = useDesignerStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<[number, number, number]>([0, 0.35, 0]);

  useEffect(() => {
    loadObjects();
    loadDesigners();
  }, [loadObjects, loadDesigners]);

  const handleDoubleClick = (position: [number, number, number]) => {
    setPendingPosition(position);
    setShowAddModal(true);
  };

  const handleAddObject = async (data: { name: string; designerId: string; color: string }) => {
    await addObject({
      ...data,
      position: pendingPosition,
      size: 'normal',
    });
    setShowAddModal(false);
  };

  const handleDelete = async (id: string) => {
    await removeObject(id);
    // refresh designers to update attached counts
    await loadDesigners();
    setSelectedId(null);
  };

  return (
    <div className="editor-page">
      <div className="canvas-wrapper">
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
          <Scene
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDoubleClick={handleDoubleClick}
          />
        </Canvas>
        <div className="canvas-hint">Double-click on the grid to add an object</div>
      </div>

      {selectedId && (
        <PropertiesPanel
          objectId={selectedId}
          onClose={() => setSelectedId(null)}
          onDelete={handleDelete}
        />
      )}

      {showAddModal && (
        <AddObjectModal
          onSubmit={handleAddObject}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default EditorPage;
