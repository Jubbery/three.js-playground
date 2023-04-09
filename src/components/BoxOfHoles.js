import React, { useRef, useState, useEffect, createRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
    DoubleSide,
    BufferGeometry,
    BufferAttribute,
    LineSegments,
    LineBasicMaterial,
    EdgesGeometry,
    BoxGeometry,
    MeshPhongMaterial,
    PlaneGeometry,
    MeshBasicMaterial,
} from 'three';

const Holes = ({ holesRef }) => {
    const boxSize = 100;
    const holeRadius = 0.8;
    return (
        <group ref={holesRef}>
            <boxGeometry args={[2000, 2000, 2000]} />
            <meshPhongMaterial color="white" side={DoubleSide} />
            {[...Array(2000)].map((_, index) => (
                <mesh
                    key={index}
                    position={[
                        Math.random() * (boxSize - 2 * holeRadius) - (boxSize - 2 * holeRadius) / 2,
                        Math.random() * (boxSize - 2 * holeRadius) - (boxSize - 2 * holeRadius) / 2,
                        Math.random() * (boxSize - 2 * holeRadius) - (boxSize - 2 * holeRadius) / 2,
                    ]}
                >
                    <sphereGeometry args={[holeRadius, 32, 32]} />
                    <meshPhongMaterial color={randomColor()} />
                </mesh>
            ))}
        </group>
    );
};

const BoxWithBorders = () => {
    const boxGeometry = new BoxGeometry(100, 100, 100);
    const edgesGeometry = new EdgesGeometry(boxGeometry);
    const lineMaterial = new LineBasicMaterial({ color: "black" });

    const transparentBoxMaterial = new MeshPhongMaterial({
        color: "white",
        transparent: true,
        opacity: 0.1,
        shininess: 50,
    });

    // const planeGeometry = new PlaneGeometry(100, 100, 10, 10);
    // const planeMaterial = new MeshBasicMaterial({ wireframe: true, color: "black" });

    return (
        <>
            <mesh geometry={boxGeometry} material={transparentBoxMaterial} />
            <lineSegments>
                <primitive object={edgesGeometry} />
                <primitive object={lineMaterial} />
            </lineSegments>
            {/* <mesh geometry={planeGeometry} material={planeMaterial} rotation={[-Math.PI / 2, 0, 0]} /> */}
        </>
    );
};


const randomColor = () => {
    return Math.floor(Math.random() * 16777215);
};


const LineConnections = ({ holesRef }) => {
    const linesRef = useRef();
    const [linesGenerated, setLinesGenerated] = useState(false);

    useEffect(() => {
        if (linesGenerated) return;

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
                    color: randomColor(),
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


const BoxOfHoles = () => {
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

            <BoxWithBorders />

            <OrbitControls enableZoom={true} enablePan={true} target={[0, 0, 0]} />
        </Canvas>
    );
};

export default BoxOfHoles;
// style={{ height: '80vh', width: '80vw', backgroundColor: 'white' }}