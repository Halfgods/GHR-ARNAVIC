import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function CompassAR() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    /* ===============================
       1️⃣ CAMERA SETUP (FULL SCREEN)
    =============================== */

    const constraints = {
      video: {
        facingMode: { ideal: "environment" }
      }
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera error:", err));

    /* ===============================
       2️⃣ THREE.JS SETUP
    =============================== */

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.set(0, 4, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    containerRef.current.appendChild(renderer.domElement);

    /* ===============================
       3️⃣ LIGHTING
    =============================== */

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    /* ===============================
       4️⃣ LOAD ARROW MODEL
    =============================== */

    let arrow;

    const loader = new GLTFLoader();
    loader.load("/direction_arrow.glb", (gltf) => {
      arrow = gltf.scene;

      arrow.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x33a1ff,
            roughness: 0.3,
            metalness: 0.2
          });
        }
      });

      arrow.scale.set(2.5, 2.5, 2.5);
      arrow.position.set(0, -7, 0);

      arrow.rotation.x = -Math.PI / 8;
      arrow.rotation.y = Math.PI / 2;

      scene.add(arrow);
    });

    /* ===============================
       5️⃣ IMMERSIVE FLIGHT ROTATION
    =============================== */

    let lastHeading = 0;
    let turnIntensity = 0;

    let targetYaw = 0;
    let targetRoll = 0;
    let targetPitch = 0;

    let currentYaw = 0;
    let currentRoll = 0;
    let currentPitch = 0;

    function handleOrientation(event) {
      if (!arrow) return;

      const heading = event.alpha || 0; // YAW
      const pitch = event.beta || 0;    // PITCH
      const roll = event.gamma || 0;    // ROLL

      let deltaHeading = heading - lastHeading;

      if (deltaHeading > 180) deltaHeading -= 360;
      if (deltaHeading < -180) deltaHeading += 360;

      // 🔥 Strong turn detection
      turnIntensity = THREE.MathUtils.lerp(
        turnIntensity,
        deltaHeading * 3.5,
        0.3
      );

      lastHeading = heading;

      // 🔥 Strong immersive movement
      targetYaw = THREE.MathUtils.degToRad(heading);

      targetPitch = THREE.MathUtils.degToRad(-pitch * 1.5);

      const bankingFromTurn = THREE.MathUtils.degToRad(
        -turnIntensity * 7.0
      );

      targetRoll =
        THREE.MathUtils.degToRad(-roll * 3.0) + bankingFromTurn;
    }

    window.addEventListener("deviceorientation", handleOrientation);

    /* ===============================
       6️⃣ RESIZE HANDLER
    =============================== */

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    /* ===============================
       7️⃣ ANIMATION LOOP
    =============================== */

    function animate() {
      requestAnimationFrame(animate);

      if (arrow) {
        currentYaw = THREE.MathUtils.lerp(currentYaw, targetYaw, 0.3);
        currentRoll = THREE.MathUtils.lerp(currentRoll, targetRoll, 0.4);
        currentPitch = THREE.MathUtils.lerp(currentPitch, targetPitch, 0.3);

        arrow.rotation.y = Math.PI / 2 + currentYaw;
        arrow.rotation.z = currentRoll;
        arrow.rotation.x = -Math.PI / 8 + currentPitch;
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  /* ===============================
     8️⃣ FULLSCREEN LAYOUT
  =============================== */

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "black"
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0
        }}
      />

      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none"
        }}
      />
    </div>
  );
}