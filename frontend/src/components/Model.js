import { useGLTF } from "@react-three/drei";
import axios from 'axios';

const axi = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

export function Model() {
  const modelPath = `${process.env.REACT_APP_URL}/public/uploads/3dmodels/ferrari_f8_tributo.glb`;
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
useGLTF.preload(`${process.env.REACT_APP_URL}/public/uploads/3dmodels/ferrari_f8_tributo.glb`); 
