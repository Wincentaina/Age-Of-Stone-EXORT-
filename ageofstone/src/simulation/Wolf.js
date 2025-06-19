import { Animal } from "./Animal.js";
import { Human } from "./Human.js";
import { Deer } from "./Deer.js";

export class Wolf extends Animal {
    constructor(x, y) {
        super(x, y, 3);
        this.emoji = "🐺";
    }

    step(gridSize, nearbyAgents = []) {
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

        super.step(gridSize);
    }

    moveTowards(targetX, targetY, gridSize) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        this.x += Math.sign(dx);
        this.y += Math.sign(dy);
        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }
}