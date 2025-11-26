export class StorageService {
    constructor(storageKey = 'github_profiles_v1') {
        this.storageKey = storageKey;
        this.historyKey = 'github_search_history';
    }

    getSavedProfiles() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveProfile(profile) {
        const profiles = this.getSavedProfiles();
        if (!profiles.find(p => p.id === profile.id)) {
            profiles.push(profile);
            localStorage.setItem(this.storageKey, JSON.stringify(profiles));
            return true;
        }
        return false;
    }

    removeProfile(profileId) {
        let profiles = this.getSavedProfiles();
        profiles = profiles.filter(p => p.id !== profileId);
        localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    }

    // History for Undo functionality
    addToHistory(action) {
        // Implementation for undo stack could go here
    }
}

export const storageService = new StorageService();
