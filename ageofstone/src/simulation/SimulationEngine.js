export class Agent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.emoji = "❓";
        this.energy = 10; // базовая энергия (можно расширить)
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
        // Энергия тратится каждый шаг
        this.energy = Math.max(0, this.energy - 1);

        // Ищем людей рядом для группировки
        const humansNearby = nearbyAgents.filter((a) => a instanceof Human);

        // Олени рядом (еда)
        const deerNearby = nearbyAgents.filter((a) => a instanceof Deer);

        // Волки рядом (угроза)
        const wolvesNearby = nearbyAgents.filter((a) => a instanceof Wolf);

        // Поведение: избегаем одиночества — идём к людям, если меньше 2 рядом
        if (humansNearby.length < 2) {
            // Ищем ближайшего человека (из всей популяции, не только nearby)
            // Для простоты - двигаемся в случайном направлении пока не найдем цель
            const groupTarget = humansNearby[0] || null;

            if (groupTarget) {
                this.moveTowards(groupTarget.x, groupTarget.y, gridSize);
                return;
            }
            // если никого нет - случайное движение
            super.step(gridSize);
            return;
        }

        // Если рядом >= 2 человека, охотимся на оленей
        if (humansNearby.length >= 2 && deerNearby.length > 0) {
            this.moveTowards(deerNearby[0].x, deerNearby[0].y, gridSize);
            return;
        }

        // Если рядом волки, бежим от них (в любом случае)
        if (wolvesNearby.length > 0) {
            // Бежим от ближайшего волка
            const threat = wolvesNearby[0];
            this.moveAwayFrom(threat.x, threat.y, gridSize);
            return;
        }

        // Иначе случайное движение (включая шанс стоять на месте)
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
        const prey = nearbyAgents.filter(a => a instanceof Human || a instanceof Deer);
        const wolvesNearby = nearbyAgents.filter(a => a instanceof Wolf);

        // Волк боится нападать, если рядом >= 2 человека (толпа)
        const humansNearby = nearbyAgents.filter(a => a instanceof Human);
        if (humansNearby.length >= 2) {
            // Стадо людей — не атакуем
            super.step(gridSize);
            return;
        }

        // Волк атакует только если рядом >= 2 волка (стая)
        if (wolvesNearby.length >= 2 && prey.length > 0) {
            // Направляемся к первой жертве
            this.moveTowards(prey[0].x, prey[0].y, gridSize);
            return;
        }

        // Иначе волк просто случайно двигается
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

export class Deer extends Animal {
    constructor(x, y) {
        super(x, y, 1);
        this.emoji = "🦌";
    }

    step(gridSize, nearbyAgents = []) {
        const threat = nearbyAgents.find(a => a instanceof Wolf);
        const plantsNearby = nearbyAgents.filter(a => a instanceof Plant);

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

export class Plant extends Agent {
    constructor(x, y) {
        super(x, y);
        this.emoji = "🌿";
    }

    step(gridSize, nearbyAgents = []) {
        // Растения не двигаются
    }
}

// Перемешивание массива для случайного порядка агентов в шаге
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
        const grid = Array(this.gridSize * this.gridSize)
            .fill(null)
            .map(() => []);
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

            // Волки нападают на человека, если человек один
            if (wolves.length > 0 && humans.length === 1) {
                for (const human of humans) toRemove.add(human);
            }

            // Волки нападают на оленя всегда
            if (wolves.length > 0 && deers.length > 0) {
                for (const deer of deers) toRemove.add(deer);
            }

            // Люди охотятся на оленей только если их больше 1
            if (humans.length > 1 && deers.length > 0) {
                for (const deer of deers) toRemove.add(deer);
            }
        }

        this.agents = this.agents.filter((a) => !toRemove.has(a));
    }

    step() {
        const agentsToStep = shuffle([...this.agents]);
        for (const agent of agentsToStep) {
            const nearby = this.getNearbyAgents(agent.x, agent.y, 1);
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