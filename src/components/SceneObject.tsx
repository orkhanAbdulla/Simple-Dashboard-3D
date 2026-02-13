import { useRef, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { SceneObject as SceneObjectType } from '../types';

const SIZE_MAP = { small: 0.4, normal: 0.7, large: 1.1 };

interface Props {
  obj: SceneObjectType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string) => void;
}

const SceneObject = ({ obj, isSelected, onSelect, onDragStart }: Props) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const scale = SIZE_MAP[obj.size] ?? SIZE_MAP.normal;

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect(obj.id);
    onDragStart(obj.id);
  };

  // determine emissive based on state
  let emissive = '#000000';
  let emissiveIntensity = 0;
  if (isSelected) {
    emissive = '#3388ff';
    emissiveIntensity = 0.4;
  } else if (hovered) {
    emissive = '#ffffff';
    emissiveIntensity = 0.25;
  }

  return (
    <mesh
      ref={meshRef}
      position={obj.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onPointerDown={handlePointerDown}
      castShadow
    >
      <boxGeometry args={[scale, scale, scale]} />
      <meshStandardMaterial
        color={obj.color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
};

export default SceneObject;
