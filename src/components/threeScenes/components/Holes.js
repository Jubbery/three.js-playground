import React, { useRef, useMemo, useEffect, createRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { NaiveBroadphase, Sphere, Body, Vec3 } from "cannon-es";
import {
    SphereGeometry,
    MeshPhongMaterial,
    Vector3,
} from 'three';
import Cannon from 'cannon';



const Holes = ({ holesRef, world }) => {
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

    const bodies = useRef([]);

    useEffect(() => {
        world.current.broadphase = new NaiveBroadphase();
        world.current.solver.iterations = 10;
        world.current.gravity.set(0, 0, 0); // Earth gravity

        // Add sphere container body
        const containerBody = new Body({
            mass: 1, // Change mass to 1
            position: new Vec3(0, 0, 0),
            shape: new Sphere(sphereSize),
            type: Body.DYNAMIC, // Change type to DYNAMIC
        });
        world.current.addBody(containerBody);

        // Add contact material
        const containerMaterial = new Cannon.Material();
        const holeMaterial = new Cannon.Material();
        const contactMaterial = new Cannon.ContactMaterial(containerMaterial, holeMaterial, {
            friction: 0.3,
            restitution: 0.6,
        });
        world.current.addContactMaterial(contactMaterial);

        // Set materials for container and holes
        containerBody.material = containerMaterial;

        // Add holes bodies
        const newBodies = points.map((point, index) => {
            const body = new Body({
                mass: 0.1,
                position: new Vec3(...point.toArray()),
                shape: new Sphere(holeRadius),
                material: holeMaterial,
            });
            world.current.addBody(body);
            return body;
        });
        bodies.current = newBodies;
    }, [world]);



    const fixedTimeStep = 1 / 60; // Assuming 60 FPS
    let accumulator = 0;

    useFrame((state, delta) => {
        // Update the physics simulation
        accumulator += delta;
        while (accumulator >= fixedTimeStep) {
            world.current.step(fixedTimeStep);
            accumulator -= fixedTimeStep;
        }

        // Update positions of Cannon.js bodies based on physics simulation
        bodies.current.forEach((body, index) => {
            const position = body.position;

            // Check if the hole is outside the bounds of the container sphere
            if (position.length() + holeRadius > sphereSize * 10) {
                // Convert Cannon.js Vec3 to Three.js Vector3
                const positionThree = new Vector3(position.x, position.y, position.z);

                // Calculate the direction vector from the container center to the hole
                const direction = positionThree.normalize();

                // Move the hole to the container's surface
                const newPosition = direction.multiplyScalar(sphereSize - holeRadius);

                // Update the body's position and velocity
                body.position.copy(newPosition);
                body.velocity.set(newPosition.x * 5, newPosition.y * 5, newPosition.z * 5);

                // Update the Three.js mesh position
                holesRef.current.children[index].position.copy(newPosition);
            } else {
                // Calculate the force vector between the container center and the hole
                const forceDirection = new Vector3(-position.x, -position.y, -position.z);
                const distance = forceDirection.length();
                const forceStrength = 100; // Change this value to control the strength of the magnetic force
                const direction = forceDirection.normalize();
                direction.multiplyScalar(forceStrength / Math.pow(distance, 1));

                // Apply the force to the body
                body.velocity.set(forceDirection.x * sphereSize, forceDirection.y * sphereSize, forceDirection.z * sphereSize);

                // Update the Three.js mesh position and quaternion
                holesRef.current.children[index].position.set(position.x, position.y, position.z);
                holesRef.current.children[index].quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
            }
        });
    });





    // Create a single geometry and material instance to be shared by all holes
    const holeGeometry = new SphereGeometry(holeRadius, 16, 16);
    const holeMaterial = new MeshPhongMaterial({ color: "white" });

    return (
        <group ref={holesRef}>
            {points.map((point, index) => (
                <mesh key={index} position={point.toArray()} geometry={holeGeometry} material={holeMaterial} />
            ))}
        </group>
    );

};

export default Holes;