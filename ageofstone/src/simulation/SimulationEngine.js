export class Agent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.emoji = "❓";
    }

    step(gridSize, nearbyAgents = []) {
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
        this.target = null;
    }

    step(gridSize, nearbyAgents = []) {
        // Периодически пересматриваем цель
        if (!this.target || Math.random() < 0.1) {
            const threat = nearbyAgents.find(a => a instanceof Animal && a.dangerLevel >= 2);
            const prey = nearbyAgents.find(a => a instanceof Animal && a.dangerLevel === 1);

            if (threat) {
                this.target = { x: threat.x, y: threat.y, flee: true };
            } else if (prey) {
                this.target = { x: prey.x, y: prey.y, flee: false };
            } else {
                this.target = null;
            }
        }

        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            this.x += Math.sign(this.target.flee ? -dx : dx);
            this.y += Math.sign(this.target.flee ? -dy : dy);
        } else {
            if (Math.random() < 0.15) {
                super.step(gridSize);
            }
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

export class Wolf extends Animal {
    constructor(x, y) {
        super(x, y, 3);
        this.emoji = "🐺";
    }

    step(gridSize, nearbyAgents = []) {
        const prey = nearbyAgents.find(a => a instanceof Human || a instanceof Deer);
        if (prey) {
            this.x += this.x <= prey.x ? 1 : -1;
            this.y += this.y <= prey.y ? 1 : -1;
        } else {
            super.step(gridSize);
        }
        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }
}

export class Deer extends Animal {
    constructor(x, y) {
        super(x, y, 1);
        this.emoji = "🦌";
    }

    step(gridSize, nearbyAgents = []) {
        const threat = nearbyAgents.find(a => a instanceof Wolf);
        if (threat) {
            this.x += this.x >= threat.x ? 1 : -1;
            this.y += this.y >= threat.y ? 1 : -1;
        } else {
            super.step(gridSize);
        }
        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }
}

export class Plant extends Agent {
    constructor(x, y) {
        super(x, y);
        this.emoji = "🌿";
    }

    step(gridSize, nearbyAgents = []) {
        // Растения не двигаются
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

    getGrid() {
        const grid = Array(this.gridSize * this.gridSize).fill(null).map(() => []);
        for (const agent of this.agents) {
            const index = agent.y * this.gridSize + agent.x;
            grid[index].push(agent);
        }
        return grid;
    }

    resolveConflicts() {
        const toRemove = new Set();
        const grid = this.getGrid();

        for (let i = 0; i < grid.length; i++) {
            const agents = grid[i];
            if (agents.length < 2) continue;

            const wolves = agents.filter((a) => a instanceof Wolf);
            const humans = agents.filter((a) => a instanceof Human);
            const deers = agents.filter((a) => a instanceof Deer);

            if (wolves.length > 0 && humans.length > 0) {
                for (const human of humans) toRemove.add(human);
            }
            if (wolves.length > 0 && deers.length > 0) {
                for (const deer of deers) toRemove.add(deer);
            }
            if (humans.length > 0 && deers.length > 0) {
                for (const deer of deers) toRemove.add(deer);
            }
        }

        this.agents = this.agents.filter((a) => !toRemove.has(a));
    }

    step() {
        const agentsToStep = shuffle([...this.agents]);
        for (const agent of agentsToStep) {
            const nearby = this.getNearbyAgents(agent.x, agent.y, 2);
            agent.step(this.gridSize, nearby);
        }
        this.resolveConflicts();
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