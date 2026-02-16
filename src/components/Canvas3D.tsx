import { useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import SceneObject from './SceneObject';
import { useObjectsStore } from '../stores/objectsStore';
import { useEditorStore } from '../stores/editorStore';
import type { Object3DItem } from '../types';

interface GroundPlaneProps {
	onDoubleClick: (point: THREE.Vector3) => void;
}

function GroundPlane({ onDoubleClick }: GroundPlaneProps) {
	const clearSelection = useEditorStore((s) => s.clearSelection);

	const handleDoubleClick = useCallback(
		(e: ThreeEvent<MouseEvent>) => {
			e.stopPropagation();
			if (e.point) {
				onDoubleClick(e.point);
			}
		},
		[onDoubleClick],
	);

	const handleClick = useCallback(
		(e: ThreeEvent<MouseEvent>) => {
			e.stopPropagation();
			clearSelection();
		},
		[clearSelection],
	);

	return (
		<mesh
			rotation={[-Math.PI / 2, 0, 0]}
			position={[0, -0.01, 0]}
			onDoubleClick={handleDoubleClick}
			onClick={handleClick}
		>
			<planeGeometry args={[50, 50]} />
			<meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
		</mesh>
	);
}

function SceneContent({
	objects,
	onDoubleClick,
}: {
	objects: Object3DItem[];
	onDoubleClick: (point: THREE.Vector3) => void;
}) {
	const isDragging = useEditorStore((s) => s.isDragging);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const controlsRef = useRef<any>(null);

	// Disable orbit controls while a scene object is being dragged
	useEffect(() => {
		if (controlsRef.current) {
			controlsRef.current.enabled = !isDragging;
		}
	}, [isDragging]);

	return (
		<>
			<ambientLight intensity={0.4} />
			<directionalLight position={[10, 15, 10]} intensity={1} castShadow />
			<directionalLight position={[-5, 10, -5]} intensity={0.3} />
			<pointLight position={[0, 10, 0]} intensity={0.5} color="#7c3aed" />

			<Environment preset="city" />

			<Grid
				position={[0, 0, 0]}
				args={[50, 50]}
				cellSize={1}
				cellThickness={0.5}
				cellColor="#2a2a4a"
				sectionSize={5}
				sectionThickness={1}
				sectionColor="#4a4a7a"
				fadeDistance={25}
				infiniteGrid
			/>

			<GroundPlane onDoubleClick={onDoubleClick} />

			{objects.map((obj) => (
				<SceneObject key={obj.id} object={obj} />
			))}

			<OrbitControls
				ref={controlsRef}
				makeDefault
				enableDamping
				dampingFactor={0.1}
				maxPolarAngle={Math.PI / 2 - 0.05}
				minDistance={2}
				maxDistance={30}
			/>
		</>
	);
}

interface Canvas3DProps {
	onDoubleClick: (point: THREE.Vector3) => void;
}

export default function Canvas3D({ onDoubleClick }: Canvas3DProps) {
	const objects = useObjectsStore((s) => s.objects);

	return (
		<div className="canvas-container">
			<Canvas
				camera={{ position: [5, 8, 12], fov: 50 }}
				gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
				style={{ background: 'transparent' }}
			>
				<SceneContent objects={objects} onDoubleClick={onDoubleClick} />
			</Canvas>
			<div className="canvas-hint">Double-click the ground to add an object</div>
		</div>
	);
}
