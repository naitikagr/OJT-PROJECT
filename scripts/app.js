import { eventBus } from './core/eventBus.js';
import { Router } from './core/router.js';
import { SearchComponent } from './components/search.js';
import { ProfileCard } from './components/profileCard.js';
import { SavedProfilesComponent } from './components/savedProfiles.js';

/**
 * Application Entry Point
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('GitHub Profile Viewer Initialized');

    new Router();
    new SearchComponent('search-container');
    new ProfileCard('profile-container');
    new SavedProfilesComponent('saved-profiles-container');

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed', err));
    }
});
