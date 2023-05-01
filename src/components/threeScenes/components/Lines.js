import React, { useRef, useState, useEffect } from 'react';
import {
    BufferGeometry,
    BufferAttribute,
    LineSegments,
    LineBasicMaterial,
} from 'three';

export const LineConnectionsFarthest = ({ holesRef }) => {
    const linesRef = useRef();
    const [linesGenerated, setLinesGenerated] = useState(false);

    useEffect(() => {
        if (linesGenerated) return;

        const holes = holesRef.current.children;
        const usedHoles = new Set();
        const probability = 0.5; // 50% probability of generating a line

        // Iterate through each hole and generate one random connection to another unused hole
        holes.forEach((hole) => {
            if (usedHoles.has(hole)) return;

            const unusedHoles = holes.filter((h) => !usedHoles.has(h) && h !== hole);
            if (unusedHoles.length === 0) return;

            // Find the farthest unused hole to the current hole
            let farthestHole;
            let farthestDistance = 0;
            unusedHoles.forEach((h) => {
                const distance = hole.position.distanceTo(h.position);
                if (distance > farthestDistance) {
                    farthestDistance = distance;
                    farthestHole = h;
                }
            });

            // Connect the current hole to the farthest unused hole
            usedHoles.add(hole);
            usedHoles.add(farthestHole);

            const vertices = new Float32Array([
                hole.position.x,
                hole.position.y,
                hole.position.z,
                farthestHole.position.x,
                farthestHole.position.y,
                farthestHole.position.z,
            ]);

            const lineGeometry = new BufferGeometry();
            lineGeometry.setAttribute("position", new BufferAttribute(vertices, 3));
            const lineMaterial = new LineBasicMaterial({
                // color: randomColor(),
                color: "red",
                depthWrite: true,
                depthTest: true,
                transparent: true,
                opacity: 0.5,
                thickness: 12,
            });

            const lineSegment = new LineSegments(lineGeometry, lineMaterial);
            linesRef.current.add(lineSegment);
        });

        setLinesGenerated(true);
    }, [holesRef, linesGenerated]);

    return <group ref={linesRef} />;
};

export const LineConnectionsClosest = ({ holesRef }) => {
    const linesRef = useRef();
    const [linesGenerated, setLinesGenerated] = useState(false);

    useEffect(() => {
        if (linesGenerated) return;

        const holes = holesRef.current.children;
        const usedHoles = new Set();
        const probability = 0.5; // 50% probability of generating a line

        // Iterate through each hole and generate one random connection to another unused hole
        holes.forEach((hole) => {
            if (usedHoles.has(hole)) return;

            const unusedHoles = holes.filter((h) => !usedHoles.has(h) && h !== hole);
            if (unusedHoles.length === 0) return;

            // Find the closest unused hole to the current hole
            let closestHole;
            let closestDistance = Infinity;
            unusedHoles.forEach((h) => {
                const distance = hole.position.distanceTo(h.position);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestHole = h;
                }
            });

            // Connect the current hole to the closest unused hole
            usedHoles.add(hole);
            usedHoles.add(closestHole);

            const vertices = new Float32Array([
                hole.position.x,
                hole.position.y,
                hole.position.z,
                closestHole.position.x,
                closestHole.position.y,
                closestHole.position.z,
            ]);

            const lineGeometry = new BufferGeometry();
            lineGeometry.setAttribute("position", new BufferAttribute(vertices, 3));
            const lineMaterial = new LineBasicMaterial({
                // color: randomColor(),
                color: "white",
                depthWrite: true,
                depthTest: true,
                transparent: true,
                opacity: 0.5,
            });

            const lineSegment = new LineSegments(lineGeometry, lineMaterial);
            linesRef.current.add(lineSegment);
        });

        setLinesGenerated(true);
    }, [holesRef, linesGenerated]);

    return <group ref={linesRef} />;
};