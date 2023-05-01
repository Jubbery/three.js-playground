import React, { useRef, createRef, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
    DoubleSide,
    Vector3,
} from 'three';

import { LineConnectionsClosest, LineConnectionsFarthest } from './components/Lines';

const createPoints = (sphereSize, holeRadius, numPoints) => {
    const innerSphereRadius = sphereSize - 2 * holeRadius;

    const points = [];
    const lambda = numPoints / (4 / 3 * Math.PI * Math.pow(innerSphereRadius, 3));
    let i = 0;
    // Poisson process
    while (i < numPoints) {
        const r = Math.pow(Math.random(), 1 / 3) * innerSphereRadius;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI - Math.PI / 2;
        const x = r * Math.cos(phi) * Math.cos(theta);
        const y = r * Math.sin(phi);
        const z = r * Math.cos(phi) * Math.sin(theta);
        points.push(new Vector3(x, y, z));
        i++;
        // randomly skip points to follow Poisson process
        if (Math.random() > lambda) i++;
    }
    return points;

}

const Holes = ({ holesRef, resetKey }) => {
    const sphereSize = 100;
    const holeRadius = 0.8;
    const innerSphereRadius = sphereSize - 2 * holeRadius;
    const numPoints = 2000;

    const points = useMemo(() => {
        return createPoints(sphereSize, holeRadius, numPoints);
    }, [innerSphereRadius, numPoints, resetKey]);

    return (
        <group ref={holesRef}>
            <sphereGeometry args={[sphereSize, 32, 32]} />
            <meshPhongMaterial color="white" side={DoubleSide} />
            {points.map((point, index) => (
                <mesh key={index} position={point.toArray()}>
                    <sphereGeometry args={[holeRadius, 32, 32]} />
                    <meshPhongMaterial color="white" />
                </mesh>
            ))}
        </group>
    );
};

const SphereOfHoles = () => {
    const holesRefs = useRef([...Array(1)].map(() => createRef()));
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        // Reinitialize the useRef values
        holesRefs.current = [...Array(1)].map(() => createRef());

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
        <Canvas
            key={resetKey}
            camera={{ position: [0, 0, 250], fov: 70 }}
            style={{ height: '100vh', backgroundColor: 'black' }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 10]} intensity={1} castShadow />

            {[...Array(1)].map((_, index) => (
                <group key={index} position={[0, 0, -index * 1]}>
                    <Holes
                        holesRef={holesRefs.current[index]}
                        resetKey={resetKey}
                    />
                    <LineConnectionsFarthest
                        holesRef={holesRefs.current[index]}
                    />
                    <LineConnectionsClosest
                        holesRef={holesRefs.current[index]}
                    />
                </group>
            ))}

            <OrbitControls enableZoom={true} enablePan={true} target={[0, 0, 0]} />
        </Canvas>
    );
};

export default SphereOfHoles;