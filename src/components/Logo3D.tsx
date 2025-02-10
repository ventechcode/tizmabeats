"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function RotatingModel({ modelPath }: { modelPath: string }) {
  const gltf = useGLTF(modelPath);
  const scene = gltf.scene;
  const ref = useRef<any>();

  const rotationSpeed = 0.44

  // Clone scene to apply custom material.
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#CDD6F4",
        });
      }
    });
    return clone;
  }, [scene]);

  // Use the delta (in seconds) so the rotation is time-based rather than frame‑based. More consistent across devices.
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed * delta;
    }
  });

  return <primitive ref={ref} object={clonedScene} />;
}

export default function Logo3D() {
  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20">
      <Canvas camera={{ position: [0, 0, 2], fov: 61 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <RotatingModel modelPath="/assets/headphones-raw.glb" />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
