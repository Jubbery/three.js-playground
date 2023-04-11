import { useState } from 'react';
import './App.css';
import BoxOfHoles from './components/BoxOfHoles';
import Singularity from './components/Singularity';
import SingularityWithTrails from './components/SingularityWithTrails';
import SphereOfHoles from './components/SphereOfHoles';
import SphereOfHolesCannon from './components/SphereOfHolesCannon';
import ThreeScene from './components/ThreeScene';
import SingularityWithoutTrails from './components/SingularityWithoutTrails';

function App() {
  const [trailsActive, setTrailsActive] = useState(false);
  return (
    <div className="App">
      <button onClick={() => setTrailsActive(!trailsActive)}>Toggle Trails</button>
      {/* <ThreeScene /> */}
      {/* <SphereOfHoles/> */}
      {/* <BoxOfHoles /> */}
      {/* <SphereOfHolesCannon /> */}
      {/* <Singularity /> */}
      {trailsActive == true ? (<SingularityWithoutTrails/>) : (<SingularityWithTrails />)}
    </div>
  );
}

export default App;
