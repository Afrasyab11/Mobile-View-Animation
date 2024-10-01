import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Model from "./Model.jsx";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Canvas
        key={`${windowSize.width}-${windowSize.height}`}
        style={{ width: "100%", height: "100vh" }}
      >
        <Model />
        <EffectComposer multisampling={4}>
          <Bloom luminanceThreshold={1.1} intensity={0.15} levels={3} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
