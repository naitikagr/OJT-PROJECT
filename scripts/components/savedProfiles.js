import { eventBus } from '../core/eventBus.js';
import { storageService } from '../services/storage.js';

export class SavedProfilesComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.attachEvents();
    }

    attachEvents() {
        eventBus.on('PROFILE_SAVED', () => this.render());
        eventBus.on('PROFILE_REMOVED', () => this.render());

        this.container.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-btn');
            const viewBtn = e.target.closest('.view-profile-btn');

            if (removeBtn) {
                const id = parseInt(removeBtn.dataset.id);
                storageService.removeProfile(id);
                eventBus.emit('PROFILE_REMOVED');
            } else if (viewBtn) {
                const username = viewBtn.dataset.username;
                window.location.hash = `#/user/${username}`;
            }
        });
    }

    render() {
        const profiles = storageService.getSavedProfiles();

        if (profiles.length === 0) {
            this.container.innerHTML = `
                <h3>Saved Profiles</h3>
                <p class="empty-state">No saved profiles yet.</p>
            `;
            return;
        }

        this.container.innerHTML = `
            <h3>Saved Profiles (${profiles.length})</h3>
            <ul class="saved-list">
                ${profiles.map(p => `
                    <li class="saved-item">
                        <img src="${p.avatar_url}" alt="${p.login}" class="saved-avatar">
                        <div class="saved-info">
                            <span class="saved-name">${p.login}</span>
                            <div class="saved-actions">
                                <button class="view-profile-btn" data-username="${p.login}">View</button>
                                <button class="remove-btn" data-id="${p.id}" aria-label="Remove ${p.login}">×</button>
                            </div>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}
