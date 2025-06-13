// ControlPanel.jsx
import React from "react";

export default function ControlPanel({ onStart, onPause, onStep, onReset, running }) {
    return (
        <div style={{ marginTop: 16 }}>
            <button onClick={onStart} disabled={running}>▶️ Start</button>
            <button onClick={onPause} disabled={!running}>⏸ Pause</button>
            <button onClick={onStep}>🔁 Step</button>
            <button onClick={onReset}>♻️ Reset</button>
        </div>
    );
}