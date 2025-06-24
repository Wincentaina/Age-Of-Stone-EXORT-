import { makeAutoObservable, runInAction, reaction } from "mobx";

class ProfilesStore {
    profiles = {
        stable: {
            gridSize: 20,
            tickSpeed: 500,
            initialCounts: {
                humans: 5,
                deer: 5,
                wolves: 5,
                plants: 5,
            },
            plantGrowthRate: 0.001,
            maxPlants: 100,
            vision: 3,
            reproduction: {
                deerProbability: 0.2,
                humanProbability: 0.15,
                wolfProbability: 0.05,
            },
        },
    };

    currentProfile = "default";

    constructor(settingsStore) {
        makeAutoObservable(this, {}, { autoBind: true });
        this.settingsStore = settingsStore;

        this.loadProfiles();

        // Автосохранка профилей (кроме stable)
        reaction(
            () => JSON.stringify(this.getSavableProfiles()),
            () => this.saveProfiles()
        );
    }

    getSavableProfiles() {
        const { stable, ...rest } = this.profiles;
        return rest;
    }

    saveCurrentAsProfile(name) {
        if (name === "stable") return;

        runInAction(() => {
            this.profiles[name] = this.settingsStore.toJSON();
            this.currentProfile = name;
        });
    }

    loadProfile(name) {
        const data = this.profiles[name];
        if (data) {
            this.settingsStore.update(data);
            runInAction(() => {
                this.currentProfile = name;
            });
        }
    }

    deleteProfile(name) {
        if (name === "stable") return;

        runInAction(() => {
            delete this.profiles[name];
            if (this.currentProfile === name) {
                this.currentProfile = "default";
            }
        });
        this.saveProfiles();
    }

    saveProfiles() {
        const savable = this.getSavableProfiles();
        localStorage.setItem("sim-profiles", JSON.stringify(savable));
    }

    loadProfiles() {
        const saved = localStorage.getItem("sim-profiles");
        if (saved) {
            runInAction(() => {
                const parsed = JSON.parse(saved);
                this.profiles = { ...this.profiles, ...parsed };
            });
        }
    }
}

export default ProfilesStore;