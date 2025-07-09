// components/SettingField.js
import React from "react";
import s from "./SettingField.module.css";

export default function SettingField({ label, value, onChange, min = 0, max = 100, step = 1, unit = "" }) {
    const handleInputChange = (e) => {
        const val = e.target.value;
        if (val === "") return;
        const num = parseFloat(val);
        if (!isNaN(num)) onChange(num);
    };

    const handleRangeChange = (e) => {
        onChange(parseFloat(e.target.value));
    };

    return (
        <div className={s.fieldWrapper}>
            <label className={s.label}>{label}</label>
            <input
                type="number"
                value={value ?? ""}
                onChange={handleInputChange}
                className={s.input}
            />
            <input
                type="range"
                value={value ?? 0}
                min={min}
                max={max}
                step={step}
                onChange={handleRangeChange}
                className={s.slider}
            />
            {unit && <span className={s.unit}>{unit}</span>}
        </div>
    );
}