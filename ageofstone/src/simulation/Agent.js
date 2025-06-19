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
        else if (dir === 1 && this.x < gridSize - 1) this.x++;
        else if (dir === 2 && this.y > 0) this.y--;
        else if (dir === 3 && this.y < gridSize - 1) this.y++;
    }
}