import React, { useRef, createRef, useMemo, useEffect, useState, lazy, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { World, NaiveBroadphase, Sphere, Body, Vec3 } from "cannon-es";


const Holes = lazy(() => import('./components/Holes')); // Load the Holes component lazily


const Singularity = () => {
    const holesRefs = useRef([...Array(1)].map(() => createRef()));
    const world = useRef(new World());
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        // Reinitialize the useRef values
        holesRefs.current = [...Array(1)].map(() => createRef());
        world.current = new World();

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
    }, [resetKey]);

    return (
        <>
            <Canvas
                key={resetKey}
                camera={{ position: [0, 0, 250], fov: 70 }}
                style={{ height: '100vh', backgroundColor: 'black' }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 1000]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                    {/* <TransparentSphere /> */}
                    <Holes holesRef={holesRefs.current} world={world} />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </>
    );
};

export default Singularity;