"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

interface ModelProps {
  url: string;
  scale: number;
}

function Model({ url, scale }: ModelProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={scale} />;
}

export default function ProductCanvas({ url, scale }: ModelProps) {
  return (
    <div className="h-[400px] w-full bg-gray-50 rounded-xl overflow-hidden">
      <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <Model url={url} scale={scale} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault autoRotate />
      </Canvas>
    </div>
  );
}