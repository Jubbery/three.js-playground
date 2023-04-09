import React, { useRef, useState, useEffect, createRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
    DoubleSide,
    BufferGeometry,
    BufferAttribute,
    LineSegments,
    LineBasicMaterial,
    EdgesGeometry,
    SphereGeometry,
    MeshPhongMaterial,
    PlaneGeometry,
    MeshBasicMaterial,
    CircleGeometry,
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
                    <meshPhongMaterial color={"black"} />
                </mesh>
            ))}
        </group>
    );
};


const SphereWithBorders = () => {
    const sphereGeometry = new SphereGeometry(100, 32, 32);
    const edgesGeometry = new EdgesGeometry(sphereGeometry);
    const lineMaterial = new LineBasicMaterial({ color: "black" });

    const transparentSphereMaterial = new MeshPhongMaterial({
        color: "white",
        transparent: true,
        opacity: 0.1,
        shininess: 50,
    });

    return (
        <>
            <mesh geometry={sphereGeometry} material={transparentSphereMaterial} />
            <lineSegments>
                <primitive object={edgesGeometry} />
                <primitive object={lineMaterial} />
            </lineSegments>
        </>
    );
};

const TransparentSphere = () => {
    const sphereGeometry = new SphereGeometry(100, 32, 32);

    const transparentSphereMaterial = new MeshPhongMaterial({
        color: "white",
        transparent: true,
        opacity: 0.0,
        shininess: 50,
    });

    return (
        <mesh geometry={sphereGeometry} material={transparentSphereMaterial} />
    );
};


const randomColor = () => {
    return Math.floor(Math.random() * 16777215);
};


const LineConnections = ({ holesRef }) => {
    const linesRef = useRef();
    const [linesGenerated, setLinesGenerated] = useState(false);

    useEffect(() => {
        // if (linesGenerated) return;

        const holes = holesRef.current.children;
        const usedHoles = new Set();
        const probability = 0.5; // 50% probability of generating a line

        // Iterate through each hole and generate one random connection to another unused hole
        holes.forEach((hole) => {
            if (usedHoles.has(hole)) return;

            const unusedHoles = holes.filter((h) => !usedHoles.has(h) && h !== hole);
            if (unusedHoles.length === 0) return;

            // Generate a random number between 0 and 1
            const randomNum = Math.random();

            // If the random number is less than the probability, generate a line
            if (randomNum < probability) {
                const randomIndex = Math.floor(Math.random() * unusedHoles.length);
                const randomHole = unusedHoles[randomIndex];
                usedHoles.add(hole);
                usedHoles.add(randomHole);

                const vertices = new Float32Array([
                    hole.position.x,
                    hole.position.y,
                    hole.position.z,
                    randomHole.position.x,
                    randomHole.position.y,
                    randomHole.position.z,
                ]);

                const lineGeometry = new BufferGeometry();
                lineGeometry.setAttribute("position", new BufferAttribute(vertices, 3));
                const lineMaterial = new LineBasicMaterial({
                    // color: randomColor(),
                    color: "black",
                    depthWrite: true,
                    depthTest: true,
                    transparent: true,
                    opacity: 0.5,
                    thickness: 12,
                });

                const lineSegment = new LineSegments(lineGeometry, lineMaterial);
                linesRef.current.add(lineSegment);
            }
        });

        setLinesGenerated(true);
    }, [holesRef, linesGenerated]);

    return <group ref={linesRef} />;
};


const SphereOfHoles = () => {
    const holesRefs = useRef([...Array(1)].map(() => createRef()));

    return (
        <Canvas
            camera={{ position: [0, 0, 250], fov: 70 }}
            style={{ height: '100vh', backgroundColor: 'white' }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 10]} intensity={1} castShadow />

            {[...Array(1)].map((_, index) => (
                <group key={index} position={[0, 0, -index * 1]}>
                    <Holes holesRef={holesRefs.current[index]} />
                    <LineConnections holesRef={holesRefs.current[index]} />
                </group>
            ))}

            {/* <SphereWithBorders /> */}
            <TransparentSphere />

            <OrbitControls enableZoom={true} enablePan={true} target={[0, 0, 0]} />
        </Canvas>
    );
};

export default SphereOfHoles;