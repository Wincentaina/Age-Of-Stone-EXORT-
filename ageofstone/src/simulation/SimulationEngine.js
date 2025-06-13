export class Agent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.emoji = "❓";
    }

    step(gridSize, nearbyAgents = []) {
        // По умолчанию — случайное движение
        const dir = Math.floor(Math.random() * 4);
        if (dir === 0 && this.x > 0) this.x--;
        if (dir === 1 && this.x < gridSize - 1) this.x++;
        if (dir === 2 && this.y > 0) this.y--;
        if (dir === 3 && this.y < gridSize - 1) this.y++;
    }
}

export class Human extends Agent {
    constructor(x, y) {
        super(x, y);
        this.emoji = "🧍";
    }

    step(gridSize, nearbyAgents = []) {
        const threat = nearbyAgents.find(
            (a) => a instanceof Animal && a.dangerLevel >= 2
        );
        const prey = nearbyAgents.find(
            (a) => a instanceof Animal && a.dangerLevel === 1
        );

        if (threat) {
            this.x += this.x >= threat.x ? 1 : -1;
            this.y += this.y >= threat.y ? 1 : -1;
        } else if (prey) {
            this.x += this.x <= prey.x ? 1 : -1;
            this.y += this.y <= prey.y ? 1 : -1;
        } else {
            super.step(gridSize);
        }

        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }
}

export class Animal extends Agent {
    constructor(x, y, dangerLevel = 1) {
        super(x, y);
        this.dangerLevel = dangerLevel;
    }
}

export class Deer extends Animal {
    constructor(x, y) {
        super(x, y, 1);
        this.emoji = "🦌";
    }
}

export class Wolf extends Animal {
    constructor(x, y) {
        super(x, y, 3);
        this.emoji = "🐺";
    }
}

export class Plant extends Agent {
    constructor(x, y) {
        super(x, y);
        this.emoji = "🌿";
    }
}

export class Simulation {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.agents = [];
        for (let i = 0; i < 5; i++) {
            this.agents.push(new Human(this.rand(), this.rand()));
            this.agents.push(new Deer(this.rand(), this.rand()));
            this.agents.push(new Wolf(this.rand(), this.rand()));
            this.agents.push(new Plant(this.rand(), this.rand()));
        }
    }

    rand() {
        return Math.floor(Math.random() * this.gridSize);
    }

    getNearbyAgents(x, y, radius) {
        return this.agents.filter((a) => {
            const dx = Math.abs(a.x - x);
            const dy = Math.abs(a.y - y);
            return dx <= radius && dy <= radius && !(dx === 0 && dy === 0);
        });
    }

    step() {
        for (const agent of this.agents) {
            const nearby = this.getNearbyAgents(agent.x, agent.y, 2);
            agent.step(this.gridSize, nearby);
        }
    }

    getGrid() {
        const grid = Array(this.gridSize * this.gridSize).fill(null);
        for (const agent of this.agents) {
            const index = agent.y * this.gridSize + agent.x;
            grid[index] = agent;
        }
        return grid;
    }

    addAgent(type) {
        const x = this.rand();
        const y = this.rand();
        if (type === "human") this.agents.push(new Human(x, y));
        if (type === "animal") this.agents.push(new Animal(x, y));
        if (type === "deer") this.agents.push(new Deer(x, y));
        if (type === "wolf") this.agents.push(new Wolf(x, y));
        if (type === "plant") this.agents.push(new Plant(x, y));
    }

    clear() {
        this.agents = [];
    }
}