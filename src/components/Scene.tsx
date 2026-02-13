import { useRef, useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import SceneObjectComp from './SceneObject';
import { useObjectStore } from '../store/objectStore';

const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDoubleClick: (position: [number, number, number]) => void;
}

const Scene = ({ selectedId, onSelect, onDoubleClick }: Props) => {
  const { objects, moveObject } = useObjectStore();
  const { camera, raycaster } = useThree();
  const orbitRef = useRef<any>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const SIZE_MAP: Record<string, number> = { small: 0.4, normal: 0.7, large: 1.1 };

  const getGroundPoint = (e: ThreeEvent<PointerEvent>): [number, number, number] | null => {
    const intersect = new THREE.Vector3();
    raycaster.setFromCamera(e.pointer, camera);
    const hit = raycaster.ray.intersectPlane(groundPlane, intersect);
    if (!hit) return null;
    return [intersect.x, 0, intersect.z];
  };

  const handleFloorPointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!draggingId) return;
      e.stopPropagation();
      const point = getGroundPoint(e);
      if (!point) return;
      const obj = objects.find((o) => o.id === draggingId);
      const halfSize = obj ? (SIZE_MAP[obj.size] ?? 0.7) / 2 : 0.35;
      moveObject(draggingId, [point[0], halfSize, point[2]]);
    },
    [draggingId, objects, moveObject, camera, raycaster]
  );

  const handlePointerUp = useCallback(() => {
    if (draggingId) {
      // persist the final position
      const obj = objects.find((o) => o.id === draggingId);
      if (obj) {
        useObjectStore.getState().update(obj.id, { position: obj.position });
      }
      setDraggingId(null);
    }
    if (orbitRef.current) orbitRef.current.enabled = true;
  }, [draggingId, objects]);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
    if (orbitRef.current) orbitRef.current.enabled = false;
  };

  const handleFloorDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    const point = new THREE.Vector3();
    raycaster.setFromCamera(e.pointer, camera);
    const hit = raycaster.ray.intersectPlane(groundPlane, point);
    if (hit) {
      onDoubleClick([point.x, 0.35, point.z]);
    }
  };

  const handleFloorClick = () => {
    if (!draggingId) onSelect(null);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 3]} intensity={1} castShadow />
      <OrbitControls ref={orbitRef} makeDefault />

      {/* floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onPointerMove={handleFloorPointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleFloorClick}
        onDoubleClick={handleFloorDoubleClick}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#f5f5f5" transparent opacity={0.3} />
      </mesh>

      <Grid
        args={[50, 50]}
        cellSize={1}
        cellColor="#ccc"
        sectionSize={5}
        sectionColor="#999"
        fadeDistance={30}
        position={[0, 0, 0]}
      />

      {objects.map((obj) => (
        <SceneObjectComp
          key={obj.id}
          obj={obj}
          isSelected={selectedId === obj.id}
          onSelect={onSelect}
          onDragStart={handleDragStart}
        />
      ))}
    </>
  );
};

export default Scene;
