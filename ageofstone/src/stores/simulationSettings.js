import { makeAutoObservable } from "mobx";

class SimulationSettings {
    gridSize = 20;
    tickSpeed = 500;

    initialCounts = {
        humans: 5,
        deer: 5,
        wolves: 5,
        plants: 5
    };

    plantGrowthRate = 0.001;
    maxPlants = 100;
    vision = 3;

    reproduction = {
        deerProbability: 0.2,
        humanProbability: 0.15,
        wolfProbability: 0.05
    };

    constructor() {
        makeAutoObservable(this);
        this.load();
    }

    update(payload) {
        Object.assign(this, payload);
        this.save();
    }

    toJSON() {
        return {
            gridSize: this.gridSize,
            tickSpeed: this.tickSpeed,
            initialCounts: this.initialCounts,
            plantGrowthRate: this.plantGrowthRate,
            maxPlants: this.maxPlants,
            vision: this.vision,
            reproduction: this.reproduction
        };
    }

    save() {
        localStorage.setItem("sim-settings", JSON.stringify(this.toJSON()));
    }

    load() {
        const saved = localStorage.getItem("sim-settings");
        if (saved) {
            this.update(JSON.parse(saved));
        }
    }
}

export default new SimulationSettings();