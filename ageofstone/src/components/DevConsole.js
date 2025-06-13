import React, { useState } from "react";

export default function DevConsole({ onCommand }) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && input.trim()) {
            onCommand(input.trim());
            setInput("");
        }
    };

    return (
        <div style={{
            background: "#111", color: "#0f0", padding: "8px",
            fontFamily: "monospace", marginTop: "12px"
        }}>
            <div>$ <input
                style={{ background: "black", color: "#0f0", border: "none", width: "90%" }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            /></div>
        </div>
    );
}