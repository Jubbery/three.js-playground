// InfiniteScrollingCanvas.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const InfiniteScrollingCanvas = () => {
    const canvasRef = useRef();

    useEffect(() => {
        // Set up the basic Three.js scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(renderer.domElement);

        // Create a texture, a material, and a plane geometry for the background
        const loader = new THREE.TextureLoader();
        const texture = loader.load('../../scp.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const geometry = new THREE.PlaneGeometry(10, 10);

        // Create two background meshes and add them to the scene
        const background1 = new THREE.Mesh(geometry, material);
        const background2 = new THREE.Mesh(geometry, material);

        background1.position.set(0, 0, -5);
        background2.position.set(0, 0, -15);

        scene.add(background1, background2);

        // Position the camera
        camera.position.z = 5;

        // Create the update loop for the infinite scrolling effect
        const scrollSpeed = 0.03;
        const animate = () => {
            requestAnimationFrame(animate);

            // Move the backgrounds
            background1.position.z += scrollSpeed;
            background2.position.z += scrollSpeed;

            // Reset the position of the backgrounds when they go past the camera
            if (background1.position.z > 5) {
                background1.position.z = -15;
            }
            if (background2.position.z > 5) {
                background2.position.z = -15;
            }

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup function
        return () => {
            renderer.dispose();
            material.dispose();
            geometry.dispose();
            texture.dispose();
        };
    }, []);

    return <div ref={canvasRef} />;
};

export default InfiniteScrollingCanvas;
