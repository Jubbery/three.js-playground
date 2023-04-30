// InfinityMirror.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import mirrorTexturePath from '../../mirrorTexture.jpg';

const InfinityMirror = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const outerShape = new THREE.Shape();
    outerShape.moveTo(-2, -2);
    outerShape.lineTo(-2, 2);
    outerShape.lineTo(2, 2);
    outerShape.lineTo(2, -2);
    outerShape.lineTo(-2, -2);

    const innerHole = new THREE.Path();
    innerHole.moveTo(-0.5, -0.5);
    innerHole.lineTo(-0.5, 0.5);
    innerHole.lineTo(0.5, 0.5);
    innerHole.lineTo(0.5, -0.5);
    innerHole.lineTo(-0.5, -0.5);

    outerShape.holes.push(innerHole);

    const geometry = new THREE.ExtrudeGeometry(outerShape, { depth: 0.01, bevelEnabled: false });
    const textureLoader = new THREE.TextureLoader();
    const mirrorTexture = textureLoader.load(mirrorTexturePath);

    const numPlanes = 4000;
    const planeDistance = 0.1;

    for (let i = 0; i < numPlanes; i++) {
      const opacity = 1 - (i / numPlanes);
      const material = new THREE.MeshBasicMaterial({
        map: mirrorTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: opacity,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.z = -i * planeDistance;
      scene.add(plane);
    }

    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      renderer.dispose();
      geometry.dispose();
      mirrorTexture.dispose();
    };
  }, []);

  return <div ref={canvasRef} />;
};

export default InfinityMirror;