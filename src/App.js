import { useState } from 'react';
import './App.css';
import BoxOfHoles from './components/BoxOfHoles';
import Singularity from './components/Singularity';
import SingularityWithTrails from './components/SingularityWithTrails';
import SphereOfHoles from './components/SphereOfHoles';
import SphereOfHolesCannon from './components/SphereOfHolesCannon';
import ThreeScene from './components/ThreeScene';
import SingularityWithoutTrails from './components/SingularityWithoutTrails';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function App() {
  const [trailsActive, setTrailsActive] = useState(false);
  const [activeComponent, setActiveComponent] = useState('ThreeScene');

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'ThreeScene':
        return <ThreeScene />;
      case 'SphereOfHoles':
        return <SphereOfHoles />;
      case 'BoxOfHoles':
        return <BoxOfHoles />;
      case 'SphereOfHolesCannon':
        return <SphereOfHolesCannon />;
      case 'Singularity':
        return <Singularity />;
      case 'SingularityWithTrails':
        return (
          <>
            <Button sx={{ paddingTop: "10px" }} variant='outlined' onClick={() => setTrailsActive(!trailsActive)}>Toggle Trails</Button>
            {trailsActive ? <SingularityWithTrails /> : <SingularityWithoutTrails />}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Three.js Playground
          </Typography>
          <Button color="inherit" onClick={() => handleComponentChange('ThreeScene')}>
            ThreeScene
          </Button>
          <Button color="inherit" onClick={() => handleComponentChange('BoxOfHoles')}>
            BoxOfHoles
          </Button>
          <Button color="inherit" onClick={() => handleComponentChange('SphereOfHoles')}>
            SphereOfHoles
          </Button>
          <Button color="inherit" onClick={() => handleComponentChange('SphereOfHolesCannon')}>
            SphereOfHolesCannon
          </Button>
          <Button color="inherit" onClick={() => handleComponentChange('Singularity')}>
            Singularity
          </Button>
          <Button color="inherit" onClick={() => handleComponentChange('SingularityWithTrails')}>
            SingularityWithTrails
          </Button>
        </Toolbar>
      </AppBar>
      <Box>{renderComponent()}</Box>
    </div>
  );
}

export default App;


