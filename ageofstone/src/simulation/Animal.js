import { Agent } from "./Agent.js";

export class Animal extends Agent {
    constructor(x, y, dangerLevel = 1) {
        super(x, y);
        this.dangerLevel = dangerLevel;
    }
}