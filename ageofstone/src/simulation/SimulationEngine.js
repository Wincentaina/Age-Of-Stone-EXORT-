
class Agent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(gridSize) {
        const dx = Math.floor(Math.random() * 3) - 1;
        const dy = Math.floor(Math.random() * 3) - 1;
        this.x = Math.max(0, Math.min(gridSize - 1, this.x + dx));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y + dy));
    }

    get emoji() {
        return "❔";
    }
}

export class Human extends Agent {
    get emoji() {
        return "👤";
    }
}

export class Animal extends Agent {
    get emoji() {
        return "🐗";
    }
}

export class Plant extends Agent {
    get emoji() {
        return "🌿";
    }
}

export class Simulation {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.agents = [];
        this.initAgents();
    }

    initAgents() {
        for (let i = 0; i < 5; i++) {
            this.agents.push(new Human(this.rand(), this.rand()));
            this.agents.push(new Animal(this.rand(), this.rand()));
            this.agents.push(new Plant(this.rand(), this.rand()));
        }
    }

    rand() {
        return Math.floor(Math.random() * this.gridSize);
    }

    step() {
        for (const agent of this.agents) {
            if (!(agent instanceof Plant)) {
                agent.move(this.gridSize);
            }
        }
    }

    getGrid() {
        const grid = Array(this.gridSize * this.gridSize).fill(null);
        for (const agent of this.agents) {
            const idx = agent.y * this.gridSize + agent.x;
            grid[idx] = agent;
        }
        return grid;
    }
}