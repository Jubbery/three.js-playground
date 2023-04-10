import React, { useRef, createRef, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DoubleSide, SphereGeometry, MeshPhongMaterial, Vector3, TextureLoader } from 'three';

const Holes = ({ holesRef, imageSrc }) => {
    const sphereSize = 100;
    const holeRadius = 0.8;
    const innerSphereRadius = sphereSize - 2 * holeRadius;
    const [renderedPoints, setRenderedPoints] = useState([]);

    useEffect(() => {
        const loadPointsFromImage = async () => {
            return new Promise((resolve) => {
                const points = [];
                const img = new Image();
                img.src = imageSrc;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    const imgData = ctx.getImageData(0, 0, img.width, img.height).data;

                    const numPoints = img.width * img.height;

                    for (let i = 0; i < numPoints; i++) {
                        const idx = i * 4;
                        const brightness = (imgData[idx] + imgData[idx + 1] + imgData[idx + 2]) / 3;
                        if (brightness < 128) { // Only create holes for dark pixels
                            const u = (i % img.width) / img.width;
                            const v = Math.floor(i / img.width) / img.height;
                    
                            const theta = 2 * Math.PI * u;
                            const phi = Math.acos(2 * v - 1);
                    
                            const x = innerSphereRadius * Math.sin(phi) * Math.cos(theta);
                            const y = innerSphereRadius * Math.sin(phi) * Math.sin(theta);
                            const z = innerSphereRadius * Math.cos(phi);
                    
                            points.push(new Vector3(x, y, z));
                        }
                    }
                    
                    resolve(points);
                };
            });
        };

        loadPointsFromImage().then((points) => setRenderedPoints(points));
    }, [imageSrc, innerSphereRadius]);


    return (
        <group ref={holesRef}>
            <sphereGeometry args={[sphereSize, 32, 32]} />
            <meshPhongMaterial color="white" side={DoubleSide} />
            {renderedPoints.map((point, index) => (
                <mesh key={index} position={point.toArray()}>
                    <sphereGeometry args={[holeRadius, 32, 32]} />
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
                    <Holes holesRef={holesRefs.current[index]} imageSrc="../scp.png" />
                </group>
            ))}

            <TransparentSphere />

            <OrbitControls enableZoom={true} enablePan={true} target={[0, 0, 0]} />
        </Canvas>
    );
};
export default SphereOfHoles;
