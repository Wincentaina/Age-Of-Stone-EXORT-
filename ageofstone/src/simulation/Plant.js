import { Agent } from "./Agent.js";

export class Plant extends Agent {
    constructor(x, y) {
        super(x, y);
        this.emoji = "🌿";
        this.maxAge = 70;
    }

    step(gridSize, nearbyAgents = []) {
        // Растения не двигаются
    }
}