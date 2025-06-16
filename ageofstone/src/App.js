import React, { useState, useEffect, useRef } from "react";
import { Simulation } from "./simulation/SimulationEngine";
import s from "./App.module.css";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import DevConsole from "./components/DevConsole/DevConsole";

const GRID_SIZE = 20;
const CELL_SIZE = 24;

export default function App() {
    const [sim, setSim] = useState(new Simulation(GRID_SIZE));
    const [tick, setTick] = useState(0);
    const [running, setRunning] = useState(false);
    const [consoleVisible, setConsoleVisible] = useState(false);
    const [speed, setSpeed] = useState(500);
    const intervalRef = useRef(null);
    const [selectedCell, setSelectedCell] = useState(null);

    useEffect(() => {
        const listener = (e) => {
            if (e.key === "~") {
                e.preventDefault();
                e.stopPropagation();
                setConsoleVisible((v) => !v);
            }
        };
        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, []);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                sim.step();
                setTick((t) => t + 1);
            }, speed);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running, sim, speed]);

    const handleCommand = (cmd) => {
        const args = cmd.trim().split(" ");
        const [action, ...rest] = args;

        if (action === "add") {
            const type = rest[0];
            const count = parseInt(rest[1]) || 1;
            for (let i = 0; i < count; i++) {
                if (["human", "animal", "plant", "deer", "wolf"].includes(type)) {
                    sim.addAgent(type);
                }
            }
            setTick((t) => t + 1);
        }

        if (action === "set" && rest[0] === "speed") {
            const val = parseInt(rest[1]);
            if (!isNaN(val)) setSpeed(val);
        }

        if (action === "clear") {
            sim.clear();
            setTick((t) => t + 1);
        }

        if (action === "help") {
            alert(
                "Команды:\n" +
                "add [human|animal|plant|deer|wolf] [count]\n" +
                "set speed [ms]\n" +
                "clear\n" +
                "help"
            );
        }
    };

    const handleCellClick = (x, y) => {
        const agents = sim.agents.filter((a) => a.x === x && a.y === y);
        setSelectedCell({ x, y, agents });
    };

    const closeInfo = () => setSelectedCell(null);

    return (
        <div className={s.container}>
            <h1 className={s.title}>Primitive Life Sim</h1>

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
                className={s.grid}
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}
            >
                {sim.getGrid().map((cell, idx) => (
                    <div
                        key={idx}
                        className={s.cell}
                        onClick={() => handleCellClick(idx % GRID_SIZE, Math.floor(idx / GRID_SIZE))}
                    >
                        {cell.length > 0 ? cell[0].emoji : ""}
                        {cell.length > 1 && <span className={s.multiple}>+{cell.length - 1}</span>}
                    </div>
                ))}
            </div>

            <p className={s.tick}>Tick: {tick}</p>

            {consoleVisible && <DevConsole onCommand={handleCommand} />}

            {selectedCell && (
                <div className={s.infoPopup}>
                    <button onClick={closeInfo}>Close</button>
                    <h3>Клетка ({selectedCell.x}, {selectedCell.y})</h3>
                    <ul>
                        {selectedCell.agents.map((agent, i) => (
                            <li key={i}>
                                {agent.emoji} {agent.constructor.name} {agent.dangerLevel ? `(Опасность: ${agent.dangerLevel})` : ""}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}