import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useGLTF, PerspectiveCamera, useAnimations, useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

let mmm = gsap.matchMedia();
let isMobileSize = window.innerWidth < 1280;

export default function Model(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("./Dopo5.glb");
  //http://localhost:5173/src/assets/DopoDraco.glb
  //https://dopocodee.netlify.app/DopoDraco.glb
  const { ref, mixer, names, actions, clips } = useAnimations(animations, group);
  const { progress } = useProgress();
  const viewport = useThree(state => state.viewport);

  // Scroll to top on reload

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  if (progress > 99) {
    document.querySelector("html").style.position = "relative";
  }

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    mobCameraTrue: window.innerWidth < 1280 ? true : false,
    deskCameraTrue: window.innerWidth < 1280 ? false : true,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        mobCameraTrue: window.innerWidth < 1280 ? true : false,
        deskCameraTrue: window.innerWidth < 1280 ? false : true,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSize]);

  useEffect(() => {
    ScrollTrigger.refresh();
    gsap.matchMediaRefresh();
  }, [windowSize]);

  useLayoutEffect(() => {
    // so you can click on the btns
    const rootDiv = document.getElementById("root");
    rootDiv.childNodes[0].style.pointerEvents = "none";

    //make numbers glow

    nodes.numbers_as_mesh.material.color.r = 2;
    nodes.numbers_as_mesh.material.color.g = 2;
    nodes.numbers_as_mesh.material.color.b = 2;

    nodes.numbers_as_mesh.material.emissive.r = 1;
    nodes.numbers_as_mesh.material.emissive.g = 1;
    nodes.numbers_as_mesh.material.emissive.b = 1;
    nodes.numbers_as_mesh.material.emissiveIntensity = 1.1;
    nodes.numbers_as_mesh.material.toneMapped = false;
  }, []);

  const tlDesk = useRef();
  const tlMob = useRef();

  useGSAP(() => {
    /* Scroll animation STARTS */
    let whichAnimLenghtMob = 150;
    let whichAnimLenghtDesk = 120;

    let whichDurationMob = 6;
    let whichDurationDesk = 5;

    const clipMob = actions.MobAnim;
    const clipDesktop = actions.DeskAction;

    const animationDurationMob = clipMob._clip.duration;
    const animationDurationDesk = clipDesktop._clip.duration;

    const frameMob = animationDurationMob / whichAnimLenghtMob;
    const frameDesk = animationDurationDesk / whichAnimLenghtDesk;
    // if it runs until the last frame, it will restart from frame 1, didn't found a solution for this yet.
    const maxMob = animationDurationMob - frameMob;
    const maxDesk = animationDurationDesk - frameDesk;

    mmm.add("(min-width: 1280px)", () => {
      clipDesktop.play();

      const mixerDesk = clipDesktop.getMixer();
      const proxyDesk = {
        get time() {
          return mixerDesk.time;
        },
        set time(value) {
          clipDesktop.paused = false;
          mixerDesk.setTime(value);
          clipDesktop.paused = true;
        },
      };

      // for some reason must be set to 0 otherwise the clip will not be properly paused.
      proxyDesk.time = 0;

      tlDesk.current = gsap.timeline({
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: "#section-2",
          start: "top bottom",
          end: "bottom bottom",
          endTrigger: "#section-6",
          scrub: 1,
          toggleActions: "restart restart reverse reverse",
        },
      });
      tlDesk.current.set(proxyDesk, { time: 0 });

      tlDesk.current.to(
        proxyDesk,

        {
          time: maxDesk,
          ease: "none",
          duration: whichDurationDesk,
        }
      );
    });

    mmm.add("(max-width: 1279px)", () => {
      clipMob.play();

      const mixerMob = clipMob.getMixer();
      const proxyMob = {
        get time() {
          return mixerMob.time;
        },
        set time(value) {
          clipMob.paused = false;
          mixerMob.setTime(value);
          clipMob.paused = true;
        },
      };

      // for some reason must be set to 0 otherwise the clip will not be properly paused.
      proxyMob.time = 0;

      tlMob.current = gsap.timeline({
        ease: "none",
        //immediateRender: false,
        scrollTrigger: {
          trigger: "#section-2",
          start: "top bottom",
          end: "bottom bottom",
          endTrigger: "#section-6",
          scrub: 1,
          toggleActions: "restart restart reverse reverse",
        },
      });
      tlMob.current.set(proxyMob, { time: 0 });

      tlMob.current.to(
        proxyMob,

        {
          time: maxMob,
          ease: "none",
          duration: whichDurationMob,
        }
      );
    });
  }, [windowSize]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Scene'>
        <spotLight
          name='k_soft_shadow_light'
          intensity={0.3087028}
          angle={0.323}
          penumbra={0.15}
          decay={2}
          position={[1.133, -0.005, -0.665]}
          rotation={[-3.06, 0.989, 1.641]}
        >
          <group position={[0, 0, -1]} />
        </spotLight>
        <spotLight
          name='Keylight'
          intensity={0.088046}
          angle={0.374}
          penumbra={0.15}
          decay={2}
          position={[1.105, 0.285, -0.311]}
          rotation={[-2.053, 1.188, 0.67]}
        >
          <group position={[0, 0, -1]} />
        </spotLight>
        <spotLight
          name='light-frame5'
          intensity={0.152217}
          angle={0.255}
          penumbra={0.335}
          decay={2}
          position={[-1.02, 0.187, -0.989]}
          rotation={[-2.854, -0.761, -2.481]}
          scale={0.714}
        >
          <group position={[0, 0, -1]} />
        </spotLight>
        <directionalLight name='Sun' intensity={0.8879} decay={2} position={[-0.052, 0.456, -0.358]} rotation={[-2.208, -0.299, -0.049]}>
          <group position={[0, 0, -1]} />
        </directionalLight>
        <spotLight
          name='Rim_light'
          intensity={0.0217406}
          angle={Math.PI / 8}
          penumbra={0.15}
          decay={2}
          position={[0, 0.263, 1.554]}
          rotation={[-0.207, 0.005, 0.001]}
        >
          <group position={[0, 0, -1]} />
        </spotLight>
        <group name='Empty-Cover' position={[0, -0.315, -0.011]} scale={0.037}>
          <mesh
            name='Cover'
            castShadow
            receiveShadow
            geometry={nodes.Cover.geometry}
            material={materials["Cover material"]}
            position={[0.002, -0.172, 0.288]}
            scale={27.135}
          />
        </group>
        <group name='Empty-Powerbank' position={[-0.039, 0.097, -0.069]} scale={0.037}>
          <mesh
            name='numbers_as_mesh'
            castShadow
            receiveShadow
            geometry={nodes.numbers_as_mesh.geometry}
            material={materials.numbers_glow_material}
            position={[0.346, 1.601, 0.02]}
            rotation={[1.529, 0.077, -1.668]}
            scale={24.817}
          />
          <mesh
            name='Powerbank'
            castShadow
            receiveShadow
            geometry={nodes.Powerbank.geometry}
            material={materials["PB material"]}
            position={[0.002, -0.172, 0.304]}
            rotation={[Math.PI, 0, Math.PI]}
            scale={27.135}
          />
        </group>
        <group name='Empty-CameraDesk' position={[0.033, 0.009, -0.031]} rotation={[1.358, 0.031, 2.627]} scale={0.037}>
          <PerspectiveCamera
            name='Camera-Desktop'
            makeDefault={windowSize.deskCameraTrue}
            far={1000}
            near={0.1}
            fov={22.895}
            position={[0.002, 14.676, 0.288]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={5.896}
          />
        </group>
        <group name='Empty-CameraMob' position={[0.002, 0.103, -0.049]} rotation={[1.231, 0.08, 2.593]} scale={0.04}>
          <PerspectiveCamera
            name='Camera-Mob'
            makeDefault={windowSize.mobCameraTrue}
            far={1000}
            near={0.1}
            fov={22.895}
            position={[0.002, 14.676, 0.288]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={5.896}
          />
        </group>

        <group>
          <pointLight name='Bottom_light' intensity={0.1435} decay={2} position={[-0.038, -0.08, -0.211]} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./Dopo5.glb");
