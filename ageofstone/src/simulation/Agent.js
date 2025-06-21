export class Agent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.emoji = "❓";
        this.energy = 30; // базовая энергия (можно расширить)
    }

    step(gridSize, nearbyAgents = []) {
        const dir = Math.floor(Math.random() * 4);
        if (dir === 0 && this.x > 0) this.x--;
        else if (dir === 1 && this.x < gridSize - 1) this.x++;
        else if (dir === 2 && this.y > 0) this.y--;
        else if (dir === 3 && this.y < gridSize - 1) this.y++;
    }

    moveTowards(targetX, targetY, gridSize) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;

        // Приоритет оси: например, сначала по X, потом по Y
        if (Math.abs(dx) > Math.abs(dy)) {
            this.x += Math.sign(dx);
        } else {
            this.y += Math.sign(dy);
        }

        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }

    moveAwayFrom(targetX, targetY, gridSize) {
        const dx = this.x - targetX;
        const dy = this.y - targetY;

        if (Math.abs(dx) > Math.abs(dy)) {
            this.x += Math.sign(dx);
        } else if (dy !== 0) {
            this.y += Math.sign(dy);
        }

        // Ограничение в пределах поля
        this.x = Math.max(0, Math.min(gridSize - 1, this.x));
        this.y = Math.max(0, Math.min(gridSize - 1, this.y));
    }
}