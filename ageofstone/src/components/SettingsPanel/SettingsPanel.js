import SettingField from "../SettingField/SettingField";
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../stores/RootStore";
import { runInAction } from "mobx";
import s from "./SettingsPanel.module.css";

const profileNames = ["stable", "profile1", "profile2"];

const SettingsPanel = observer(() => {
    const { settings, profiles } = useRootStore();
    const [selectedProfileName, setSelectedProfileName] = useState("stable");
    const [justSaved, setJustSaved] = useState(false);

    const handleProfileClick = (name) => {
        setSelectedProfileName(name);
        profiles.loadProfile(name); // ✅ Загрузка всех профилей, включая stable
    };

    const handleSaveProfile = () => {
        if (selectedProfileName !== "stable") {
            profiles.saveCurrentAsProfile(selectedProfileName);
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 1000);
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
                            selectedProfileName === name ? s.activeProfileButton : s.profileButton
                        }
                    >
                        {name}
                    </button>
                ))}
            </div>
            <button
                className={`${s.saveProfileButton} ${justSaved ? s.success : ""}`}
                onClick={handleSaveProfile}
                disabled={selectedProfileName === "stable"}
            >
                {justSaved ? "Сохранено!" : "Сохранить профиль"}
            </button>

            <h3 className={s.heading}>Настройки</h3>

            <SettingField
                label="Скорость тиков (мс)"
                value={settings.tickSpeed}
                onChange={val => runInAction(() => { settings.tickSpeed = val })}
                min={100}
                max={2000}
                step={50}
            />
            <SettingField
                label="Стартовое кол-во людей"
                value={settings.initialCounts.humans}
                onChange={val => runInAction(() => { settings.initialCounts.humans = val})}
                min={2}
                max={200}
                step={2}
            />
            <SettingField
                label="Стартовое кол-во оленей"
                value={settings.initialCounts.deer}
                onChange={val => runInAction(() => {settings.initialCounts.deer = val})}
                min={2}
                max={200}
                step={2}
            />
            <SettingField
                label="Стартовое кол-во волков"
                value={settings.initialCounts.wolves}
                onChange={val => runInAction(() => {settings.initialCounts.wolves = val})}
                min={2}
                max={200}
                step={2}
            />
            <SettingField
                label="Стартовое кол-во растений"
                value={settings.initialCounts.plants}
                onChange={val => runInAction(() => {settings.initialCounts.plants = val})}
                min={2}
                max={200}
                step={2}
            />
            <SettingField
                label="Рост растений (0-1)"
                value={settings.plantGrowthRate}
                onChange={val => runInAction(() => { settings.plantGrowthRate = val })}
                min={0}
                max={0.1}
                step={0.0001}
            />
            <SettingField
                label="Макс. растений"
                value={settings.maxPlants}
                onChange={val => runInAction(() => { settings.maxPlants = val })}
                min={1}
                max={1000}
                step={1}
            />
            <SettingField
                label="Радиус зрения агентов"
                value={settings.vision}
                onChange={val => runInAction(() => { settings.vision = val })}
                min={1}
                max={10}
                step={1}
            />
            <SettingField
                label="Шанс размножения оленей (%)"
                value={Math.round((settings.reproduction.deerProbability ?? 0) * 100)}
                onChange={val => runInAction(() => { settings.reproduction.deerProbability = val / 100 })}
                min={0}
                max={100}
                step={1}
            />
            <SettingField
                label="Шанс размножения людей (%)"
                value={Math.round((settings.reproduction.humanProbability ?? 0) * 100)}
                onChange={val => runInAction(() => { settings.reproduction.humanProbability = val / 100 })}
                min={0}
                max={100}
                step={1}
            />
            <SettingField
                label="Шанс размножения волков (%)"
                value={Math.round((settings.reproduction.wolfProbability ?? 0) * 100)}
                onChange={val => runInAction(() => { settings.reproduction.wolfProbability = val / 100 })}
                min={0}
                max={100}
                step={1}
            />
        </div>
    );
});

export default SettingsPanel;