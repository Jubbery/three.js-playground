import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import {
    SphereGeometry,
    MeshPhongMaterial,
    Vector3,
    BufferGeometry,
    BufferAttribute,
    Points,
    PointsMaterial,
} from 'three';
import { setupPhysics, updatePhysics } from './physics';

function generatePoints(innerSphereRadius, numPoints, trailsRef) {
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

    if (trailsRef != null) {

        const trails = points.map((point, index) => {
            const maxTrailLength = 200; // Adjust this value to control the length of the trails
            const geometry = new BufferGeometry();
            const positions = new Float32Array(3 * maxTrailLength);
            geometry.setAttribute('position', new BufferAttribute(positions, 3));
            const material = new PointsMaterial({ color: "red", size: 1 }); // Use PointsMaterial instead of LineBasicMaterial

            // Used Points instead of Lines
            return new Points(geometry, material);
        });
        trailsRef.current = trails;
    }

    return points;
}

const HolesWithTrails = ({ holesRef, world, trailsRef }) => {
    const sphereSize = 50;
    const holeRadius = 1.5;
    const innerSphereRadius = sphereSize - 2 * holeRadius;
    const numPoints = 2000;

    const points = useMemo(() => {
        return generatePoints(innerSphereRadius, numPoints, trailsRef);
    }, [innerSphereRadius, numPoints]);

    const bodies = useRef([]);

    useEffect(() => {
        setupPhysics(world, points, sphereSize, holeRadius, bodies);
    }, [world]);

    useFrame((state, delta) => {
        updatePhysics(world, bodies, holesRef, trailsRef, holeRadius, delta);
    });

    // Create a single geometry and material instance to be shared by all holes
    const holeGeometry = new SphereGeometry(holeRadius, 16, 16);
    // const holeMaterial = new MeshPhongMaterial({ color: "white" });

    return (
        <group ref={holesRef}>
            {points.map((point, index) => (
                <mesh key={index} position={point.toArray()} geometry={holeGeometry} material={new MeshPhongMaterial({ color: "white" })} />
            ))}
            {trailsRef && trailsRef.current.map((trail, index) => (
                <primitive key={`trail-${index}`} object={trail} />
            ))}
        </group>
    );

};

export default HolesWithTrails;