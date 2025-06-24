// stores/RootStore.js
import React, { createContext, useContext } from "react";
import settings from "./simulationSettings";
import ProfilesStore from "./profilesStore";

export class RootStore {
    constructor() {
        this.settings = settings;
        this.profiles = new ProfilesStore(this.settings);
    }
}

const rootStore = new RootStore();
const RootStoreContext = createContext(rootStore);

export function RootStoreProvider({ children }) {
    return (
        <RootStoreContext.Provider value={rootStore}>
            {children}
        </RootStoreContext.Provider>
    );
}

export function useRootStore() {
    return useContext(RootStoreContext);
}