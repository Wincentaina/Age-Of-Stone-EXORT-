export class Agent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.emoji = "❓";
    }

    step(gridSize) {
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
            this.agents.push(new Animal(this.rand(), this.rand()));
            this.agents.push(new Plant(this.rand(), this.rand()));
        }
    }

    rand() {
        return Math.floor(Math.random() * this.gridSize);
    }

    step() {
        for (const agent of this.agents) {
            agent.step(this.gridSize);
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
        if (type === "plant") this.agents.push(new Plant(x, y));
        if (type === "deer") this.agents.push(new Deer(x, y));
        if (type === "wolf") this.agents.push(new Wolf(x, y));
    }

    clear() {
        this.agents = [];
    }
}