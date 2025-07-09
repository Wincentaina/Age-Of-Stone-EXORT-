import React from "react";
import { observer } from "mobx-react-lite";
import s from "./StatsPanel.module.css";

const StatsPanel = observer(({sim, tick}) => {

    const totalAgents = sim.agents.length;
    const humans = sim.agents.filter(a => a.constructor.name === "Human").length;
    const deer = sim.agents.filter(a => a.constructor.name === "Deer").length;
    const wolves = sim.agents.filter(a => a.constructor.name === "Wolf").length;
    const plants = sim.agents.filter(a => a.constructor.name === "Plant").length;

    // Средняя энергия (учитываем только агентов с определённой энергией)
    const energyAgents = sim.agents.filter(a => typeof a.energy === "number");
    const energies = energyAgents.map(a => a.energy);
    const avgEnergy = energyAgents.length > 0
        ? (energies.reduce((acc, e) => acc + e, 0) / energyAgents.length).toFixed(1)
        : 0;

    return (
        <div className={s.panel}>
            <h3 className={s.heading}>Статистика</h3>
            <ul className={s.list}>
                <h4 style={{marginTop: "-20px"}}>Tick: {tick}</h4>
                <li>Всего агентов: {totalAgents}</li>
                <li>Людей: {humans}</li>
                <li>Оленей: {deer}</li>
                <li>Волков: {wolves}</li>
                <li>Растений: {plants}</li>
                <li>Средняя энергия: {avgEnergy}</li>
            </ul>
        </div>
    );
});

export default StatsPanel;