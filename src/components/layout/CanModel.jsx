import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  useProgress,
} from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

function CanModel({ shouldAnimate }) {
  const { scene } = useGLTF("/3d/can5.glb");
  const ref = useRef();
  const { mouse } = useThree();

  const [introDone, setIntroDone] = useState(!shouldAnimate);

  // metallic look
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = .5;
        child.material.roughness = .3;
        child.material.envMapIntensity = 2;
      }
    });
  }, [scene]);

  // start below screen if animating
  useEffect(() => {
    if (shouldAnimate && ref.current) {
      ref.current.position.y = -1.2;
    }
  }, [shouldAnimate]);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.getElapsedTime();

    // ENTRY ANIMATION (only once)
    if (!introDone) {
      ref.current.position.y += (0 - ref.current.position.y) * 0.05;

      if (Math.abs(ref.current.position.y) < 0.01) {
        ref.current.position.y = 0;
        setIntroDone(true);
      }
      return;
    }

    // IDLE FLOATING
    ref.current.position.y = Math.sin(t * 1.2) * 0.03;

    const baseRotation = Math.PI;

    const targetY = baseRotation + mouse.x * 0.20;
    const targetX = -mouse.y * 0.20;

    ref.current.rotation.y +=
      (targetY - ref.current.rotation.y) * 0.03;

    ref.current.rotation.x +=
      (targetX - ref.current.rotation.x) * 0.03;
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={[5, 4.7, 5]}
      rotation={[0, Math.PI, 0]}
      position={[0, 0, -1]}
    />
  );
}

export default function CanViewer() {
  const [ready, setReady] = useState(false);

  const [shouldAnimate] = useState(() => {
    const alreadyPlayed = sessionStorage.getItem("canAnimated");
    if (!alreadyPlayed) {
      sessionStorage.setItem("canAnimated", "true");
      return true;
    }
    return false;
  });

  function ModelWithReady({ onReady }) {
    const { progress } = useProgress();

    useEffect(() => {
      if (progress === 100) {
        requestAnimationFrame(() => {
          onReady();
        });
      }
    }, [progress, onReady]);

    return <CanModel shouldAnimate={shouldAnimate} />;
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0 } : false}
      animate={ready ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full"
    >
      <div className="absolute inset-0 h-screen w-full pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 6] }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          {/* <AdaptiveDpr pixelated />
          <AdaptiveEvents /> */}

          <ambientLight intensity={0.6} />
          <Environment preset="studio" resolution={256} />
          <directionalLight position={[5, 5, 9]} intensity={1.5} />

          <ModelWithReady onReady={() => setReady(true)} />
        </Canvas>
      </div>
    </motion.div>
  );
}

useGLTF.preload("/3d/can4.glb");