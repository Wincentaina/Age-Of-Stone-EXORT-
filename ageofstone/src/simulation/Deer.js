import { Animal } from "./Animal.js";
import { Wolf } from "./Wolf.js";
import { Plant } from "./Plant.js";

export class Deer extends Animal {
    constructor(x, y) {
        super(x, y, 1);
        this.emoji = "🦌";
    }

    step(gridSize, nearbyAgents = []) {
        const threat = nearbyAgents.find((a) => a instanceof Wolf);
        const plantsNearby = nearbyAgents.filter((a) => a instanceof Plant);

        if (threat) {
            this.moveAwayFrom(threat.x, threat.y, gridSize);
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