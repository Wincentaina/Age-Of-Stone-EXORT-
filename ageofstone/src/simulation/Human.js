import { Agent } from "./Agent.js";
import { Deer } from "./Deer.js";
import { Wolf } from "./Wolf.js";

export class Human extends Agent {
    constructor(x, y, e=70) {
        super(x, y);
        this.emoji = "🧍";
        this.target = null;
        this.maxAge = 180;
        this.energy = e;
    }

    step(gridSize, nearbyAgents = [], spawnCallback = () => {}) {
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
        else if (this.energy >= 35 && humansNearby.length > 0 && Math.random() > 0.85) {
            this.energy = this.energy - 12
            spawnCallback(this.x, this.y, 30)
        }

        if (Math.random() < 0.15) {
            super.step(gridSize);
        }
    }

}