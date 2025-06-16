import React from "react";
import s from "./ControlPanel.module.css"

export default function ControlPanel({ onStart, onPause, onStep, onReset, running }) {
    return (
        <div className={s.control_block}>
            <button onClick={onStart} disabled={running}>▶️ Start</button>
            <button onClick={onPause} disabled={!running}>⏸ Pause</button>
            <button onClick={onStep}>🔁 Step</button>
            <button onClick={onReset}>♻️ Reset</button>
        </div>
    );
}