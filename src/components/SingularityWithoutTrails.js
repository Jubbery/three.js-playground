import React, { useRef, createRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { World, NaiveBroadphase, Sphere, Body, Vec3 } from "cannon-es";
import {
    SphereGeometry,
    MeshPhongMaterial,
    Vector3,
} from 'three';

import Cannon from 'cannon';

const randomColor = () => {
    return Math.floor(Math.random() * 16777215);
};

const Holes = ({ holesRef, world, trailsRef }) => {
    const sphereSize = 50;
    const holeRadius = 1.5;
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
        world.current.gravity.set(0, 0, 0); // Zero gravity

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
            friction: 0.0,
            restitution: 0.6,
        });
        world.current.addContactMaterial(contactMaterial);

        // Set materials for container and holes
        containerBody.material = containerMaterial;

        // Add holes bodies
        const newBodies = points.map((point, index) => {
            // Calculate a random position outside the container sphere
            const randomDirection = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            const randomDistance = sphereSize + holeRadius + Math.random() * 1000; // Adjust the 50 to control the distance from the container sphere
            const randomPosition = randomDirection.multiplyScalar(randomDistance);
            const randomVelocity = new Vector3(randomDistance * 1000, randomDistance * 1000, randomDistance * 1000).normalize();

            const body = new Body({
                mass: 0.1,
                position: new Vec3(...randomPosition.toArray()),
                shape: new Sphere(holeRadius),
                material: holeMaterial,
                velocity: new Vec3(...randomVelocity.toArray()),
            });
            world.current.addBody(body);
            return body;
        });
        bodies.current = newBodies;
    }, [world]);



    const fixedTimeStep = 1 / 75; // Assuming 60 FPS
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
            if ((position.length() + holeRadius) <= 1) {
                // Convert Cannon.js Vec3 to Three.js Vector3
                const positionThree = new Vector3(position.x + Math.random() - 0.5, position.y + Math.random() - 0.5, position.z + Math.random() - 0.5);

                // Calculate the direction vector from the container center to the hole
                const direction = positionThree.normalize();

                // Move the hole to the container's surface
                const newPosition = direction.multiplyScalar((Math.random() * 1000 + 100));

                // Update the body's position and velocity
                body.position.copy(newPosition);
                body.velocity.set(10 + newPosition.x, 10 + newPosition.y, 10 + newPosition.z);

                // Update the Three.js mesh position
                holesRef.current.children[index].position.copy(newPosition);
            } else {
                // Calculate the force vector between the container center and the hole
                const forceDirection = new Vector3(-position.x, -position.y, -position.z);
                const distance = forceDirection.length();
                const forceStrength = 500000; // Change this value to control the strength of the magnetic force
                const direction = forceDirection.normalize();
                direction.multiplyScalar(forceStrength / Math.pow(distance, 2));
                body.velocity.set(direction.x, direction.y, direction.z);

                // Add centripetal force
                const centripetalForce = new Vector3().crossVectors(body.velocity, direction).normalize();
                const centripetalStrength = 1.5; // Adjust this value to control the strength of the centripetal force
                centripetalForce.multiplyScalar(centripetalStrength);
                direction.add(centripetalForce);

                // Apply the force to the body
                body.applyForce(new Vec3(...direction), new Vec3(0, 0, 0));

                // Update the Three.js mesh position and quaternion
                holesRef.current.children[index].position.set(position.x, position.y, position.z);
                holesRef.current.children[index].quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
            }
        });
    });





    // Create a single geometry and material instance to be shared by all holes
    const holeGeometry = new SphereGeometry(holeRadius, 16, 16);
    // const holeMaterial = new MeshPhongMaterial({ color: "white" });

    return (
        <group ref={holesRef}>
            {points.map((point, index) => (
                <mesh key={index} position={point.toArray()} geometry={holeGeometry} material={new MeshPhongMaterial({ color: "white" })} />
            ))}
        </group>
    );

};

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


const SingularityWithoutTrails = () => {
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
    }, [resetKey]); // Add resetKey to the dependencies

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
                <TransparentSphere />
                <Holes holesRef={holesRefs.current} world={world} />
                <OrbitControls />
            </Canvas>
        </>
    );
};

export default SingularityWithoutTrails;