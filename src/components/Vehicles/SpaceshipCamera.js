import React, { useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';

const SpaceshipCamera = React.forwardRef((props, ref) => {
    return <PerspectiveCamera ref={ref} makeDefault position={[0, 0, 1000]} />;
});

export default SpaceshipCamera;


