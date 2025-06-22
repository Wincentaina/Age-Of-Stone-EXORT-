import SettingField from "../SettingField/SettingField";
import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../stores/RootStore";
import s from "./SettingsPanel.module.css";

const profileNames = ["stable", "profile1", "profile2"];

const SettingsPanel = observer(() => {
    const { settings, profiles } = useRootStore();

    const handleProfileClick = (name) => {
        if (profiles.profiles[name]) {
            profiles.loadProfile(name);
        } else {
            profiles.saveCurrentAsProfile(name);
        }
    };

    return (
        <div className={s.panel}>
            <h3 className={s.heading}>Профили</h3>
            <div className={s.profiles}>
                {profileNames.map((name) => (
                    <button
                        key={name}
                        onClick={() => handleProfileClick(name)}
                        className={
                            profiles.currentProfile === name ? s.activeProfileButton : s.profileButton
                        }
                    >
                        {name}
                    </button>
                ))}
            </div>

            <h3 className={s.heading}>Настройки</h3>

            <SettingField
                label="Скорость тиков (мс)"
                value={settings.tickSpeed}
                onChange={val => settings.tickSpeed = val}
                min={100}
                max={2000}
                step={50}
            />
            <SettingField
                label="Рост растений (0-1)"
                value={settings.plantGrowthRate}
                onChange={val => settings.plantGrowthRate = val}
                min={0}
                max={0.1}
                step={0.0001}
            />
            <SettingField
                label="Макс. растений"
                value={settings.maxPlants}
                onChange={val => settings.maxPlants = val}
                min={1}
                max={1000}
                step={1}
            />
            <SettingField
                label="Радиус зрения агентов"
                value={settings.vision}
                onChange={val => settings.vision = val}
                min={1}
                max={10}
                step={1}
            />
            <SettingField
                label="Шанс размножения оленей (%)"
                value={Math.round((settings.reproduction.deerProbability ?? 0) * 100)}
                onChange={val => settings.reproduction.deerProbability = val / 100}
                min={0}
                max={100}
                step={1}
            />
            <SettingField
                label="Шанс размножения людей (%)"
                value={Math.round((settings.reproduction.humanProbability ?? 0) * 100)}
                onChange={val => settings.reproduction.humanProbability = val / 100}
                min={0}
                max={100}
                step={1}
            />
            <SettingField
                label="Шанс размножения волков (%)"
                value={Math.round((settings.reproduction.wolfProbability ?? 0) * 100)}
                onChange={val => settings.reproduction.wolfProbability = val / 100}
                min={0}
                max={100}
                step={1}
            />
        </div>
    );
});

export default SettingsPanel;