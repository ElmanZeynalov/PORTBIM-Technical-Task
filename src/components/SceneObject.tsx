import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { useEditorStore } from '../stores/editorStore';
import { useObjectsStore } from '../stores/objectsStore';
import type { Object3DItem, ObjectSize, ObjectShape } from '../types';
import * as THREE from 'three';

const SIZE_MAP: Record<ObjectSize, number> = {
	small: 0.4,
	normal: 0.7,
	large: 1.1,
};

function ObjectGeometry({ shape, scale }: { shape: ObjectShape; scale: number }) {
	switch (shape) {
		case 'sphere':
			return <sphereGeometry args={[scale / 2, 32, 32]} />;
		case 'cylinder':
			return <cylinderGeometry args={[scale / 3, scale / 3, scale, 32]} />;
		case 'cone':
			return <coneGeometry args={[scale / 2, scale, 32]} />;
		case 'box':
		default:
			return <boxGeometry args={[scale, scale, scale]} />;
	}
}

function SelectionWireframe({ shape, scale }: { shape: ObjectShape; scale: number }) {
	let geometry: THREE.BufferGeometry;
	switch (shape) {
		case 'sphere':
			geometry = new THREE.SphereGeometry(scale / 2, 16, 16);
			break;
		case 'cylinder':
			geometry = new THREE.CylinderGeometry(scale / 3, scale / 3, scale, 16);
			break;
		case 'cone':
			geometry = new THREE.ConeGeometry(scale / 2, scale, 16);
			break;
		case 'box':
		default:
			geometry = new THREE.BoxGeometry(scale, scale, scale);
			break;
	}
	return (
		<lineSegments>
			<edgesGeometry args={[geometry]} />
			<lineBasicMaterial color="#ffffff" linewidth={2} />
		</lineSegments>
	);
}

interface SceneObjectProps {
	object: Object3DItem;
}

export default function SceneObject({ object }: SceneObjectProps) {
	const meshRef = useRef<THREE.Mesh>(null);
	const { hoveredId, selectedId, isDragging, setHovered, setSelected, setDragging } = useEditorStore();
	const updateObject = useObjectsStore((s) => s.updateObject);

	const isHovered = hoveredId === object.id;
	const isSelected = selectedId === object.id;
	const scale = SIZE_MAP[object.size];

	// Drag refs
	const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
	const dragOffset = useRef(new THREE.Vector3());
	const intersection = useRef(new THREE.Vector3());
	const isDraggingThis = useRef(false);

	// Compute display color
	const getColor = () => {
		if (isSelected) return '#ffffff';
		if (isHovered) {
			const c = new THREE.Color(object.color);
			c.lerp(new THREE.Color('#ffffff'), 0.35);
			return '#' + c.getHexString();
		}
		return object.color;
	};

	// Subtle float animation for selected object
	useFrame(() => {
		if (!meshRef.current) return;
		if (isSelected && !isDragging) {
			meshRef.current.position.y = object.position.y + scale / 2 + Math.sin(Date.now() * 0.003) * 0.05;
		}
	});

	const handleClick = useCallback(
		(e: ThreeEvent<MouseEvent>) => {
			e.stopPropagation();
			setSelected(object.id);
		},
		[object.id, setSelected],
	);

	const handlePointerDown = useCallback(
		(e: ThreeEvent<PointerEvent>) => {
			if (!isSelected) return;
			e.stopPropagation();

			if (e.ray) {
				dragPlane.current.set(new THREE.Vector3(0, 1, 0), -(object.position.y + scale / 2));
				e.ray.intersectPlane(dragPlane.current, intersection.current);
				dragOffset.current
					.copy(intersection.current)
					.sub(new THREE.Vector3(object.position.x, object.position.y + scale / 2, object.position.z));
			}

			isDraggingThis.current = true;
			setDragging(true);
		},
		[isSelected, object, scale, setDragging],
	);

	const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
		if (!isDraggingThis.current) return;
		e.stopPropagation();
		if (e.ray) {
			e.ray.intersectPlane(dragPlane.current, intersection.current);
			const newPos = intersection.current.sub(dragOffset.current);
			if (meshRef.current) {
				meshRef.current.position.x = newPos.x;
				meshRef.current.position.z = newPos.z;
			}
		}
	}, []);

	const handlePointerUp = useCallback(
		(e: ThreeEvent<PointerEvent>) => {
			if (!isDraggingThis.current) return;
			e.stopPropagation();
			isDraggingThis.current = false;
			setDragging(false);

			if (meshRef.current) {
				const pos = meshRef.current.position;
				updateObject(object.id, {
					position: { x: pos.x, y: 0, z: pos.z },
				});
			}
		},
		[object.id, updateObject, setDragging],
	);

	return (
		<mesh
			ref={meshRef}
			position={[object.position.x, object.position.y + scale / 2, object.position.z]}
			onClick={handleClick}
			onPointerOver={(e) => {
				e.stopPropagation();
				setHovered(object.id);
				document.body.style.cursor = 'pointer';
			}}
			onPointerOut={(e) => {
				e.stopPropagation();
				setHovered(null);
				document.body.style.cursor = 'auto';
			}}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
		>
			<ObjectGeometry shape={object.shape ?? 'box'} scale={scale} />
			<meshStandardMaterial
				color={getColor()}
				emissive={isSelected ? object.color : '#000000'}
				emissiveIntensity={isSelected ? 0.3 : 0}
				roughness={0.4}
				metalness={0.3}
			/>
			{isSelected && <SelectionWireframe shape={object.shape ?? 'box'} scale={scale} />}
		</mesh>
	);
}
