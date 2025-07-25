import { Human } from "./Human.js";
import { Deer } from "./Deer.js";
import { Wolf } from "./Wolf.js";
import { Plant } from "./Plant.js";
import { Animal } from "./Animal.js";
import { shouldDie } from "./mortality.js";

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export class Simulation {
    constructor(gridSize, initialCounts = { humans: 5, deer: 5, wolves: 5, plants: 5 }) {
        this.gridSize = gridSize;
        this.agents = [];
        for (let i = 0; i < initialCounts.humans; i++) this.agents.push(new Human(this.rand(), this.rand()));
        for (let i = 0; i < initialCounts.deer; i++) this.agents.push(new Deer(this.rand(), this.rand()));
        for (let i = 0; i < initialCounts.wolves; i++) this.agents.push(new Wolf(this.rand(), this.rand()));
        for (let i = 0; i < initialCounts.plants; i++) this.agents.push(new Plant(this.rand(), this.rand()));
        this.settings = null;
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

    plantRandomly(chancePerCell = 0.0025, maxPlants = 100) {
        let currentPlants = this.agents.filter(a => a instanceof Plant).length;
        if (currentPlants >= maxPlants) return;

        let added = 0;

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (Math.random() < chancePerCell) {
                    const exists = this.agents.some(
                        (a) => a.x === x && a.y === y && a instanceof Plant
                    );
                    if (!exists) {
                        this.agents.push(new Plant(x, y));
                        added++;
                        if (currentPlants + added >= maxPlants) return;
                    }
                }
            }
        }
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
            const plants = agents.filter((a) => a instanceof Plant);

            // Волки нападают на человека, если человек один
            if (wolves.length > 0 && humans.length === 1) {
                for (const human of humans) toRemove.add(human);
                for (const wolf of wolves) wolf.energy += 15;
            }

            // Волки нападают на оленя всегда
            if (wolves.length > 0 && deers.length > 0) {
                for (const deer of deers) toRemove.add(deer);
                for (const wolf of wolves) wolf.energy += 25;
            }

            // Люди охотятся на оленей только если их больше 1
            if (humans.length > 1 && deers.length > 0) {
                for (const deer of deers) toRemove.add(deer);
                for (const human of humans) human.energy += 15;
            }

            // Олени едят растения
            if (deers.length > 0 && plants.length > 0) {
                for (const deer of deers) {
                    const plant = plants.pop();
                    if (!plant) break;

                    toRemove.add(plant);
                    deer.energy += 8;
                    break;
                }
            }
        }

        this.agents = this.agents.filter((a) => !toRemove.has(a));
    }

    step() {
        const agentsToStep = shuffle([...this.agents]);
        for (const agent of agentsToStep) {
            const nearby = this.getNearbyAgents(agent.x, agent.y, this.settings?.vision ?? 3);
            agent.step(this.gridSize, nearby, (x, y, energy=30) => {
                if (agent instanceof Deer) {
                    this.agents.push(new Deer(x, y, energy))
                }
                if (agent instanceof Human) {
                    this.agents.push(new Human(x, y, energy))
                }
                if (agent instanceof Wolf) {
                    this.agents.push(new Wolf(x, y, energy))
                }
            });
        }

        this.plantRandomly(this.settings?.plantGrowthRate ?? 0.001, this.settings?.maxPlants ?? 80);
        this.resolveConflicts();
        // Удаляем мёртвых агентов (энергия <= 0, старость и т.д.)
        this.agents = this.agents.filter((a) => !shouldDie(a));
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