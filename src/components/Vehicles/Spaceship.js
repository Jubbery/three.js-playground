import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BoxGeometry, MeshStandardMaterial, Quaternion, Vector3 } from 'three';

const Spaceship = () => {
    const spaceshipRef = useRef();

    // Movement and rotation states
    const velocity = useRef(new Vector3());
    const acceleration = useRef(new Vector3());
    const rotation = useRef(new Vector3());
    const rotationSpeed = useRef(new Vector3());

    useEffect(() => {
        const handleKeyDown = (event) => {
            const speed = 50;
            const rotationSpeedValue = 2;

            switch (event.key) {
                case 'w':
                    acceleration.current.z = -speed;
                    break;
                case 'a':
                    acceleration.current.x = -speed;
                    break;
                case 's':
                    acceleration.current.z = speed;
                    break;
                case 'd':
                    acceleration.current.x = speed;
                    break;
                case 'ArrowUp':
                    rotationSpeed.current.z = -rotationSpeedValue;
                    break;
                case 'ArrowDown':
                    rotationSpeed.current.z = rotationSpeedValue;
                    break;
                case 'ArrowLeft':
                    rotationSpeed.current.y = -rotationSpeedValue;
                    break;
                case 'ArrowRight':
                    rotationSpeed.current.y = rotationSpeedValue;
                    break;
                default:
                    break;
            }
        };



        const handleKeyUp = (event) => {
            switch (event.code) {
                // Movement controls
                case 'KeyW':
                case 'KeyS':
                    acceleration.current.z = 0;
                    break;
                case 'KeyA':
                case 'KeyD':
                    acceleration.current.x = 0;
                    break;

                // Rotation controls
                case 'ArrowUp':
                case 'ArrowDown':
                    rotationSpeed.current.x = 0;
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    rotationSpeed.current.y = 0;
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        // Update spaceship position based on acceleration and delta time
        velocity.current.add(acceleration.current.clone().multiplyScalar(delta));
        spaceshipRef.current.position.add(velocity.current.clone().multiplyScalar(delta));

        // Update spaceship rotation based on rotationSpeed and delta time
        rotation.current.add(rotationSpeed.current.clone().multiplyScalar(delta));
        spaceshipRef.current.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), rotation.current.y);
    });

    return (
        <mesh ref={spaceshipRef}>
            <boxGeometry args={[100, 100, 100]} />
            <meshStandardMaterial color="red" />
        </mesh>
    );
};

export default Spaceship;
