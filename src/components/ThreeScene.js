import React, { useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { DirectionalLight, AmbientLight, Color } from 'three';

const Box = () => {
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(new Color(0xff0000));

    const handleClick = () => {
        setColor(new Color(Math.random() * 0xffffff));
    };

    return (
        <mesh
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={handleClick}
            receiveShadow
            castShadow
        >
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 0x00ff00 : color} />
        </mesh>
    );
};

const CustomCamera = () => {
    const cameraRef = React.useRef();
    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault // Makes this camera the default camera for the canvas
            fov={75}
            aspect={window.innerWidth / window.innerHeight}
            near={0.1}
            far={1000}
            position={[6, 6, 6]}

        />
    );
};

const CustomDirectionalLight = () => {
    const { scene } = useThree();

    React.useEffect(() => {
        const light = new DirectionalLight(0xfffffff, 1);
        light.position.set(0, 10, 5);
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.far = 50;
        light.shadow.camera.left = -10;
        light.shadow.camera.right = 10;
        light.shadow.camera.top = 10;
        light.shadow.camera.bottom = -10;

        scene.add(light);

        return () => {
            scene.remove(light);
        };
    }, [scene]);

    return null;
};

const ThreeScene = () => {
    return (
        <Canvas shadows={'percentage'}>
            <CustomCamera />
            <color attach="background" args={[0.8, 0.2, 0.5]} />
            <Box />
            <CustomDirectionalLight />
            {/* <AmbientLight intensity={0.5} /> */}
            <OrbitControls />
        </Canvas>
    );
};

export default ThreeScene;