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
            this.x += this.x >= threat.x ? 1 : -1;
            this.y += this.y >= threat.y ? 1 : -1;
        } else if (plantsNearby.length > 0) {
            this.x += this.x <= plantsNearby[0].x ? 1 : -1;
            this.y += this.y <= plantsNearby[0].y ? 1 : -1;
        } else {
            super.step(gridSize);
        }

        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }
}