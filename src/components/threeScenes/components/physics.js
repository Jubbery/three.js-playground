
import { Vec3, Sphere, Body, NaiveBroadphase } from 'cannon-es';
import { Vector3 } from 'three';
import Cannon from 'cannon';

export function setupPhysics(world, points, sphereSize, holeRadius, bodies) {
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
}

const fixedTimeStep = 1 / 60; // Assuming 60 FPS
let accumulator = 0;

export function updatePhysics(world, bodies, holesRef, trailsRef, holeRadius, delta) {
    // Update the physics simulation
    accumulator += delta;
    while (accumulator >= fixedTimeStep) {
        world.current.step(fixedTimeStep);
        accumulator -= fixedTimeStep;
    }

    // Update positions of Cannon.js bodies based on physics simulation
    bodies.current.forEach((body, index) => {
        const position = body.position;
        let trailReturns = null;

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

            // Update the trail if trailsRef is not null
            if (trailsRef !== null) {
                newTrailPosition(trailsRef, newPosition, position, index);
            }
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
            body.applyForce(new Vec3(...direction), new Vec3(1, 10, 100));

            // Update the Three.js mesh position and quaternion
            holesRef.current.children[index].position.set(position.x, position.y, position.z);
            holesRef.current.children[index].quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
        }
        if (trailsRef !== null) {
            updateTrailPosition(trailsRef, position, index)
        }
    });
}

const newTrailPosition = (trailsRef, newPosition, index) => {
    const trail = trailsRef.current[index];
    const geometry = trail.geometry;
    const positions = geometry.attributes.position.array;
    const maxTrailLength = positions.length / 3 - 1;

    // Trail updates
    positions[3 * (maxTrailLength)] = newPosition.x;
    positions[3 * (maxTrailLength) + 1] = newPosition.y;
    positions[3 * (maxTrailLength) + 2] = newPosition.z;

    geometry.attributes.position.needsUpdate = true;
}

const updateTrailPosition = (trailsRef, position, index) => {
    const trail = trailsRef.current[index];
    const geometry = trail.geometry;
    const positions = geometry.attributes.position.array;
    const maxTrailLength = positions.length / 3 - 1;
    // Shift the entire trail by one position towards the end
    for (let i = 0; i < maxTrailLength; i++) {
        positions[3 * i] = positions[3 * (i + 1)];
        positions[3 * i + 1] = positions[3 * (i + 1) + 1];
        positions[3 * i + 2] = positions[3 * (i + 1) + 2];
    }
    positions[3 * (maxTrailLength)] = position.x;
    positions[3 * (maxTrailLength) + 1] = position.y;
    positions[3 * (maxTrailLength) + 2] = position.z;

    geometry.attributes.position.needsUpdate = true;
}


