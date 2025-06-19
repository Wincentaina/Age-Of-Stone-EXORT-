import { Animal } from "./Animal.js";
import { Wolf } from "./Wolf.js";
import { Plant } from "./Plant.js";

export class Deer extends Animal {
    constructor(x, y) {
        super(x, y, 1);
        this.emoji = "🦌";
    }

    step(gridSize, nearbyAgents = [], spawnCallback = () => {}) {
        const threat = nearbyAgents.find((a) => a instanceof Wolf);
        const plantsNearby = nearbyAgents.filter((a) => a instanceof Plant);
        const otherDeer = nearbyAgents.filter((a) => a instanceof Deer);

        if (threat) {
            this.moveAwayFrom(threat.x, threat.y, gridSize);
        } else if (this.energy >= 8 && otherDeer.length > 0 && Math.random() > 0.9) {
            this.energy = this.energy - 4
            spawnCallback(this.x, this.y)
        } else if (plantsNearby.length > 0) {
            const plant = plantsNearby[0];
            // Если олень ещё не в одной клетке с растением — двигайся к нему
            if (this.x !== plant.x || this.y !== plant.y) {
                this.moveTowards(plant.x, plant.y, gridSize);
            }
        } else {
            super.step(gridSize);
        }
    }
}