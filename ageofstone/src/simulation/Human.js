import { Agent } from "./Agent.js";
import { Deer } from "./Deer.js";
import { Wolf } from "./Wolf.js";

export class Human extends Agent {
    constructor(x, y) {
        super(x, y);
        this.emoji = "🧍";
        this.target = null;
    }

    step(gridSize, nearbyAgents = []) {
        this.energy = Math.max(0, this.energy - 1);

        const humansNearby = nearbyAgents.filter((a) => a instanceof Human);
        const deerNearby = nearbyAgents.filter((a) => a instanceof Deer);
        const wolvesNearby = nearbyAgents.filter((a) => a instanceof Wolf);

        if (humansNearby.length < 2) {
            const groupTarget = humansNearby[0] || null;
            if (groupTarget) {
                this.moveTowards(groupTarget.x, groupTarget.y, gridSize);
                return;
            }
            super.step(gridSize);
            return;
        }

        if (humansNearby.length >= 2 && deerNearby.length > 0) {
            this.moveTowards(deerNearby[0].x, deerNearby[0].y, gridSize);
            return;
        }

        if (wolvesNearby.length > 0) {
            const threat = wolvesNearby[0];
            this.moveAwayFrom(threat.x, threat.y, gridSize);
            return;
        }

        if (Math.random() < 0.15) {
            super.step(gridSize);
        }
    }

    moveTowards(targetX, targetY, gridSize) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        this.x += Math.sign(dx);
        this.y += Math.sign(dy);
        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }

    moveAwayFrom(targetX, targetY, gridSize) {
        const dx = this.x - targetX;
        const dy = this.y - targetY;
        this.x += Math.sign(dx);
        this.y += Math.sign(dy);
        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }
}