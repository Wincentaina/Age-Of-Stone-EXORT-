export function shouldDie(agent) {
    // Смерть от энергии
    if (typeof agent.energy === "number" && agent.energy <= 0) {
        return true;
    }

    // Смерть от старости
    if (typeof agent.age === "number" && typeof agent.maxAge === "number") {
        if (agent.age >= agent.maxAge) return true;
    }

    return false;
}