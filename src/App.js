import { useEffect, useState } from 'react';
import './App.css';
import BoxOfHoles from './components/threeScenes/BoxOfHoles';
import Singularity from './components/threeScenes/Singularity';
import SingularityWithTrails from './components/threeScenes/SingularityWithTrails';
import SphereOfHoles from './components/threeScenes/SphereOfHoles';
import SphereOfHolesCannon from './components/threeScenes/SphereOfHolesCannon';
import ThreeScene from './components/threeScenes/ThreeScene';
import SphereImage from './components/threeScenes/SphereImage';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material'
import HyperCube from './components/threeScenes/HyperCube';

function App() {
  const [trailsActive, setTrailsActive] = useState(localStorage.getItem('trailsActive') === 'true');
  const [activeComponent, setActiveComponent] = useState(localStorage.getItem('activeComponent') || 'ThreeScene');

  useEffect(() => {
    localStorage.setItem('trailsActive', trailsActive);
  }, [trailsActive]);

  useEffect(() => {
    localStorage.setItem('activeComponent', activeComponent);
  }, [activeComponent]);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'ThreeScene':
        return <ThreeScene />;
      case 'SphereOfHoles':
        return <SphereOfHoles />;
      case 'SphereImage':
        return <SphereImage />;
      case 'BoxOfHoles':
        return <BoxOfHoles />;
      case 'HyperCube':
        return <HyperCube />;
      case 'SphereOfHolesCannon':
        return <SphereOfHolesCannon />;
      case 'Singularity':
        return <Singularity />;
      case 'SingularityWithTrails':
        return (
          <>
            <Button
              sx={{
                position: "absolute",
                justifyContent: "center",
                zIndex: 10,
                marginTop: "10px",
                backgroundColor: 'transparent',
                borderColor: (theme) => `rgba(${theme.palette.text.primary}, 0.5)`,
                '&:hover': {
                  backgroundColor: 'transparent',
                  borderColor: (theme) => `rgba(${theme.palette.text.primary}, 0.7)`,
                },
              }}
              fullWidth
              variant="outlined"
              onClick={() => setTrailsActive(!trailsActive)}
            >
              Toggle Trails
            </Button>
            {<SingularityWithTrails useTrails={trailsActive} />}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          zIndex: 10,
          borderColor: (theme) => `rgba(${theme.palette.text.primary}, 0.5)`,
          '&:hover': {
            backgroundColor: 'transparent',
            borderColor: (theme) => `rgba(${theme.palette.text.primary}, 0.7)`,
          },
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: 'transparent',
            zIndex: 10,
            borderColor: (theme) => `rgba(${theme.palette.text.primary}, 0.5)`,
            '&:hover': {
              backgroundColor: 'transparent',
              borderColor: (theme) => `rgba(${theme.palette.text.primary}, 0.7)`,
            },
          }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Three.js Playground
          </Typography>
          <Button
            color="inherit"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            Select Component
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleComponentChange('ThreeScene'); handleClose(); }}>
              Color Box
            </MenuItem>
            <MenuItem onClick={() => { handleComponentChange('BoxOfHoles'); handleClose(); }}>
              Box Of Holes
            </MenuItem>
            <MenuItem onClick={() => { handleComponentChange('SphereOfHoles'); handleClose(); }}>
              Sphere Of Holes
            </MenuItem>
            <MenuItem onClick={() => { handleComponentChange('HyperCube'); handleClose(); }}>
              Hyper Cube
            </MenuItem>
            <MenuItem onClick={() => { handleComponentChange('SphereOfHolesCannon'); handleClose(); }}>
              Starfield
            </MenuItem>
            <MenuItem onClick={() => { handleComponentChange('Singularity'); handleClose(); }}>
              Singularity
            </MenuItem>
            <MenuItem onClick={() => { handleComponentChange('SingularityWithTrails'); handleClose(); }}>
              Singularity With Trails
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ backgroundColor: 'transparent' }}>{renderComponent()}</Box>
    </div>
  );
}

export default App;


