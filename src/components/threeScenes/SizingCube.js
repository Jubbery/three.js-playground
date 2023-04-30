// InfinityMirror.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import mirrorTexturePath from '../../mirrorTexture.jpg';

const SizingCube = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const textureLoader = new THREE.TextureLoader();
    const mirrorTexture = textureLoader.load(mirrorTexturePath);

    const material = new THREE.MeshBasicMaterial({ map: mirrorTexture, side: THREE.DoubleSide });
    const innerCube = new THREE.Mesh(geometry, material);

    const outerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const outerCube = new THREE.Mesh(geometry, outerMaterial);

    scene.add(innerCube, outerCube);

    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate and scale the cubes
      innerCube.rotation.x += 0.005;
      innerCube.rotation.y += 0.005;
      outerCube.rotation.x += 0.005;
      outerCube.rotation.y += 0.005;

      innerCube.scale.set(Math.sin(Date.now() * 0.001) * 0.5 + 0.5, Math.sin(Date.now() * 0.001) * 0.5 + 0.5, Math.sin(Date.now() * 0.001) * 0.5 + 0.5);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      outerMaterial.dispose();
      mirrorTexture.dispose();
    };
  }, []);

  return <div ref={canvasRef} />;
};

export default SizingCube;
