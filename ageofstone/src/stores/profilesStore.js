import { makeAutoObservable } from "mobx";

class ProfilesStore {
    profiles = {};
    currentProfile = "default";

    constructor(settingsStore) {
        makeAutoObservable(this);
        this.settingsStore = settingsStore;
        this.loadProfiles();
    }

    saveCurrentAsProfile(name) {
        this.profiles[name] = this.settingsStore.toJSON();
        this.currentProfile = name;
        this.saveProfiles();
    }

    loadProfile(name) {
        const data = this.profiles[name];
        if (data) {
            this.settingsStore.update(data);
            this.currentProfile = name;
        }
    }

    deleteProfile(name) {
        delete this.profiles[name];
        if (this.currentProfile === name) {
            this.currentProfile = "default";
        }
        this.saveProfiles();
    }

    saveProfiles() {
        localStorage.setItem("sim-profiles", JSON.stringify(this.profiles));
    }

    loadProfiles() {
        const saved = localStorage.getItem("sim-profiles");
        if (saved) {
            this.profiles = JSON.parse(saved);
        }
    }
}

export default ProfilesStore;