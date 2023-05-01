import React, { useRef, createRef, useEffect, useState, lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { World } from "cannon-es";
import {
    SphereGeometry,
    MeshPhongMaterial,
} from 'three';

import Cannon from 'cannon';

const randomColor = () => {
    return Math.floor(Math.random() * 16777215);
};

// Load the Holes component lazily
const Holes = lazy(() => import('./components/HolesWithTrails'));

const TransparentSphere = () => {
    const sphereGeometry = new SphereGeometry(5, 32, 32);

    const transparentSphereMaterial = new MeshPhongMaterial({
        color: "black",
        transparent: false,
        opacity: 0.9,
        shininess: 0,
        // side: DoubleSide,
    });

    return (
        <mesh geometry={sphereGeometry} material={transparentSphereMaterial} />
    );
};


const SingularityWithTrails = ({ useTrails }) => {
    const holesRefs = useRef([...Array(1)].map(() => createRef()));
    const trailsRefs = useRef([]);
    const world = useRef(new World());
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        // Reinitialize the useRef values
        holesRefs.current = [...Array(1)].map(() => createRef());
        world.current = new World();
        trailsRefs.current = [];

        const handleRefresh = () => {
            setResetKey((prevKey) => prevKey + 1);
            const url = new URL(window.location);
            url.searchParams.set("timestamp", Date.now());
            window.location.href = url.href;
        };

        window.addEventListener("beforeunload", handleRefresh);
        return () => {
            window.removeEventListener("beforeunload", handleRefresh);
        };
    }, [resetKey]); // Add resetKey to the dependencies

    return (
        <>
            <Canvas
                key={resetKey}
                camera={{ position: [0, 0, 250], fov: 70 }}
                style={{ height: '100vh', backgroundColor: 'black' }}
            >
                <PerspectiveCamera
                    makeDefault
                    position={[0, 0, 1000]}
                    aspect={window.innerWidth / window.innerHeight}
                />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <TransparentSphere />
                <Suspense fallback={null}>
                    <TransparentSphere />
                    <Holes holesRef={holesRefs.current} world={world} trailsRef={useTrails ? trailsRefs : null} />
                </Suspense>

                <OrbitControls />
            </Canvas>
        </>
    );
};

export default SingularityWithTrails;