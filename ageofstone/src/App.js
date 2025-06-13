// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Simulation } from "./simulation/SimulationEngine";
import styles from "./App.module.css";
import ControlPanel from "./components/ControlPanel";

const GRID_SIZE = 20;
const CELL_SIZE = 24;

export default function App() {
    const [sim, setSim] = useState(new Simulation(GRID_SIZE));
    const [tick, setTick] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                sim.step();
                setTick((t) => t + 1);
            }, 500);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running, sim]);

    return (
        <div style={{ padding: 16 }}>
            <h1 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
                Primitive Life Sim
            </h1>

            <ControlPanel
                running={running}
                onStart={() => setRunning(true)}
                onPause={() => setRunning(false)}
                onStep={() => {
                    sim.step();
                    setTick((t) => t + 1);
                }}
                onReset={() => {
                    const newSim = new Simulation(GRID_SIZE);
                    setSim(newSim);
                    setTick(0);
                    setRunning(false);
                }}
            />

            <div
                className={styles.grid}
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}
            >
                {sim.getGrid().map((cell, idx) => (
                    <div key={idx} className={styles.cell}>
                        {cell?.emoji || ""}
                    </div>
                ))}
            </div>
            <p style={{ marginTop: 12, fontSize: 14 }}>Tick: {tick}</p>
        </div>
    );
}