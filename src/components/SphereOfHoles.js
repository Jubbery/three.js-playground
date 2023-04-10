import React, { useRef, createRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
    DoubleSide,
    SphereGeometry,
    MeshPhongMaterial,
    Vector3,
} from 'three';

const Holes = ({ holesRef }) => {
    const sphereSize = 100;
    const holeRadius = 0.8;
    const innerSphereRadius = sphereSize - 2 * holeRadius;
    const numPoints = 2000;

    const points = useMemo(() => {
        const points = [];
        const lambda = numPoints / (4 / 3 * Math.PI * Math.pow(innerSphereRadius, 3));
        let i = 0;
        while (i < numPoints) {
            const r = Math.pow(Math.random(), 1 / 3) * innerSphereRadius; // Poisson process
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI - Math.PI / 2;
            const x = r * Math.cos(phi) * Math.cos(theta);
            const y = r * Math.sin(phi);
            const z = r * Math.cos(phi) * Math.sin(theta);
            points.push(new Vector3(x, y, z));
            i++;
            if (Math.random() > lambda) i++; // randomly skip points to follow Poisson process
        }
        return points;
    }, [innerSphereRadius, numPoints]);

    return (
        <group ref={holesRef}>
            <sphereGeometry args={[sphereSize, 32, 32]} />
            <meshPhongMaterial color="white" side={DoubleSide} />
            {points.map((point, index) => (
                <mesh key={index} position={point.toArray()}>
                    <sphereGeometry args={[holeRadius, 32, 32]} />
                    {/* <meshPhongMaterial color={randomColor()} /> */}
                    <meshPhongMaterial color="white" />
                </mesh>
            ))}
        </group>
    );
};

const TransparentSphere = () => {
    const sphereGeometry = new SphereGeometry(100, 32, 32);

    const transparentSphereMaterial = new MeshPhongMaterial({
        color: "white",
        transparent: true,
        opacity: 0.5,
        shininess: 10,
    });

    return (
        <mesh geometry={sphereGeometry} material={transparentSphereMaterial} />
    );
};

const SphereOfHoles = () => {
    const holesRefs = useRef([...Array(1)].map(() => createRef()));

    return (
        <Canvas
            camera={{ position: [0, 0, 250], fov: 70 }}
            style={{ height: '100vh', backgroundColor: 'black' }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 10]} intensity={1} castShadow />

            {[...Array(1)].map((_, index) => (
                <group key={index} position={[0, 0, -index * 1]}>
                    <Holes holesRef={holesRefs.current[index]} />
                </group>
            ))}

            <TransparentSphere />

            <OrbitControls enableZoom={true} enablePan={true} target={[0, 0, 0]} />
        </Canvas>
    );
};

export default SphereOfHoles;