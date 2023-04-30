// HyperCube.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const HyperCube = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const edgeLength = 1;
    const geometry = new THREE.BoxGeometry(edgeLength, edgeLength, edgeLength);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const cubes = Array.from({ length: 8 }, () => new THREE.Mesh(geometry, material));

    cubes.forEach((cube, i) => {
      const xOffset = (i & 1) ? edgeLength / 2 : -edgeLength / 2;
      const yOffset = (i & 2) ? edgeLength / 2 : -edgeLength / 2;
      const zOffset = (i & 4) ? edgeLength / 2 : -edgeLength / 2;
      cube.position.set(xOffset, yOffset, zOffset);
      scene.add(cube);
    });

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      const rotationSpeed = 0.005;

      // Rotate the hypercube around the X and Y axes
      cubes.forEach((cube) => {
        cube.rotation.x += rotationSpeed;
        cube.rotation.y += rotationSpeed;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={canvasRef} />;
};

export default HyperCube;

