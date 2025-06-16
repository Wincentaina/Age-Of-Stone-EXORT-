import React, {useState} from "react";
import s from "./DevConsole.module.css"

export default function DevConsole({ onCommand }) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && input.trim()) {
            onCommand(input.trim());
            setInput("");
        }
    };

    return (
        <div className={s.console_text}>
            <div>$ <input
                className={s.console_style}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            /></div>
        </div>
    );
}