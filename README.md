# Independent Study - Three.js Simulations
## Spring 2023
### Jack Roberts

This project was made using:
- React.js -> [https://react.dev/](https://react.dev/)
- Material UI -> [https://mui.com/](https://mui.com/)
- Three.js -> [https://threejs.org/](http://threejs.org/)
- Cannon.js -> [Cannon.js on GitHub](https://github.com/schteppe/cannon.js/)

## How to run

In the project directory, you can run:
### `npm install`
### `npm start`

The app currently can only run "efficiently" in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

## The Scenes

This project consists of several interactive 3D scenes built with Three.js, Cannon.js and React. Each scene showcases different concepts and techniques in 3D graphics, physics simulations, and user interactions. I am new to using Three.js and Cannon.js, so bare with me.

You can navigate through the scenes using the user interface provided by Material UI. Each scene has its own unique set of controls and interactions (`WIP`), allowing you to explore the 3D environment in various ways.

1. **Color Box**: A simple 3D box that changes color when you hover over it or click on it. The color of the box is randomly generated, showcasing user interactions and object manipulation within the 3D environment.

2. **Box of Holes**: A large box filled with smaller spheres representing holes. The spheres are randomly distributed within the box, and some spheres are connected with lines based on a probability factor. This scene demonstrates the use of advanced geometries and the combination of multiple objects to create a visually engaging 3D environment.

3. **Hyper Cube**: A 3D visualization of a hypercube created by rendering eight cubes connected by their vertices. The hypercube rotates around its X and Y axes, showcasing complex geometries and transformations in Three.js.

### **The following spheres were positioned using Poisson Distribution**

4. **Sphere of Holes**: A sphere with randomly distributed holes throughout its surface. The holes are connected by lines based on their close and far proximities to each other, creating an intricate web of connections.

5. **Starfield**: A simulation of a starfield, where stars are represented as spheres in the 3D space. The camera can be panned and zoomed through the starfield, giving the viewer a sense of motion and depth.

6. **Singularity**: A singularity at the center of a sphere with holes getting gradually pulled in. Once a hole reaches the center it will be randomly position elsewhere in the space with an adjusted velocity.

6. **Singularity With Trails**: A singularity at the center of a sphere with holes followed by trails. The holes gradually get pulled to the singularity. The trails update dynamically to create a captivating visual experience. The trails can be toggled on/off using the button at top.
