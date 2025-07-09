import {makeAutoObservable, reaction, runInAction, observable} from "mobx";

class SimulationSettings {
    gridSize = 20;
    tickSpeed = 500;

    initialCounts = observable.object({
        humans: 5,
        deer: 5,
        wolves: 5,
        plants: 5,
    });

    plantGrowthRate = 0.001;
    maxPlants = 100;
    vision = 3;

    reproduction = {
        deerProbability: 0.2,
        humanProbability: 0.15,
        wolfProbability: 0.05,
    };

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true }); // autoBind важно
        this.load();

        // автоматическое сохранение при изменениях
        reaction(
            () => [
                this.gridSize,
                this.tickSpeed,
                this.plantGrowthRate,
                this.maxPlants,
                this.vision,
                this.initialCounts.humans,
                this.initialCounts.deer,
                this.initialCounts.wolves,
                this.initialCounts.plants,
                this.reproduction.deerProbability,
                this.reproduction.humanProbability,
                this.reproduction.wolfProbability
            ],
            () => {
                this.save();
            }
        );
    }

    update(payload) {
        runInAction(() => {
            Object.assign(this, payload);
            this.save();
        });
    }

    toJSON() {
        return {
            gridSize: this.gridSize,
            tickSpeed: this.tickSpeed,
            initialCounts: this.initialCounts,
            plantGrowthRate: this.plantGrowthRate,
            maxPlants: this.maxPlants,
            vision: this.vision,
            reproduction: this.reproduction,
        };
    }

    save() {
        localStorage.setItem("sim-settings", JSON.stringify(this.toJSON()));
    }

    load() {
        const saved = localStorage.getItem("sim-settings");
        if (saved) {
            const data = JSON.parse(saved);
            runInAction(() => {
                this.gridSize = data.gridSize;
                this.tickSpeed = data.tickSpeed;
                Object.assign(this.initialCounts, data.initialCounts);
                this.plantGrowthRate = data.plantGrowthRate;
                this.maxPlants = data.maxPlants;
                this.vision = data.vision;
                Object.assign(this.reproduction, data.reproduction);
            });
        }
    }
}
const simulationSettings = new SimulationSettings();
export default simulationSettings;