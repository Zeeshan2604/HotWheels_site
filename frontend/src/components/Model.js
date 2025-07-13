import { useGLTF } from "@react-three/drei";

export function Model() {
  const modelPath = `/uploads/3dmodels/ferrari_f8_tributo.glb`;
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      object={scene}
      scale={1.5  }
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

// Preload the model
useGLTF.preload(`/uploads/3dmodels/ferrari_f8_tributo.glb`); 