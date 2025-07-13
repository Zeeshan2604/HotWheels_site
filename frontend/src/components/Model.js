import { useGLTF } from "@react-three/drei";
import { ASSETS_URL } from "../utils/getApiUrl";

export function Model() {
  const modelPath = `${ASSETS_URL}/uploads/3dmodels/ferrari_f8_tributo.glb`;
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
useGLTF.preload(`${ASSETS_URL}/uploads/3dmodels/ferrari_f8_tributo.glb`); 