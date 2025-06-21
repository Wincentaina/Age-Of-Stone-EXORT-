import { Animal } from "./Animal.js";
import { Human } from "./Human.js";
import { Deer } from "./Deer.js";

export class Wolf extends Animal {
    constructor(x, y) {
        super(x, y, 3);
        this.emoji = "🐺";
    }

    step(gridSize, nearbyAgents = [], spawnCallback = () => {}) {
        this.energy = Math.max(0, this.energy - 1);
        const prey = nearbyAgents.filter(
            (a) => a instanceof Human || a instanceof Deer
        );
        const wolvesNearby = nearbyAgents.filter((a) => a instanceof Wolf);

        const humansNearby = nearbyAgents.filter((a) => a instanceof Human);
        if (humansNearby.length >= 2) {
            super.step(gridSize);
            return;
        }

        if (wolvesNearby.length >= 2 && prey.length > 0) {
            this.moveTowards(prey[0].x, prey[0].y, gridSize);
            return;
        }

        else if (this.energy >= 14 && wolvesNearby.length > 0 && Math.random() > 0.9) {
            this.energy = this.energy - 8
            spawnCallback(this.x, this.y)
        }

        super.step(gridSize);
    }

    // волки пусть будут потупее :)
    moveTowards(targetX, targetY, gridSize) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        this.x += Math.sign(dx);
        this.y += Math.sign(dy);
        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }
}