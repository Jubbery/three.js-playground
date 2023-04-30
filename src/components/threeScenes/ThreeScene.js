import React, { useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { DirectionalLight, AmbientLight, Color } from 'three';

const Box = () => {
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(new Color(0xff0000));

    const randomColor = () => {
        return Math.floor(Math.random() * 16777215);
    };

    const handleClick = () => {
        setColor(new Color(randomColor()));
    };

    return (
        <mesh
            onPointerOver={() => (setHovered(true), handleClick())}
            onPointerOut={() => (setHovered(false), handleClick())}
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
            fov={25}
            aspect={window.innerWidth / window.innerHeight}
            near={0.1}
            far={1000}
            position={[6, 6, 6]}
        />
    );
};

const MyDirectionalLight = () => {
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
    }, [scene]);

    return null;
};

const ThreeScene = () => {
    return (
        <Canvas shadows={'percentage'} style={{ height: '100vh', backgroundColor: 'white' }}>
            <CustomCamera />
            <color attach="background" args={[0.8, 0.2, 0.5]} />
            <Box />
            <MyDirectionalLight />
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 10]} intensity={1} castShadow />
            <OrbitControls enableZoom={true} enablePan={true} target={[0, 0, 0]} />
        </Canvas>
    );
};

export default ThreeScene;
