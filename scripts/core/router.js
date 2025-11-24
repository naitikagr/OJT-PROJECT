import { eventBus } from './eventBus.js';

export class Router {
    constructor() {
        this.handleHashChange = this.handleHashChange.bind(this);
        window.addEventListener('hashchange', this.handleHashChange);
        window.addEventListener('load', this.handleHashChange);
    }

    handleHashChange() {
        const hash = window.location.hash;

        if (hash.startsWith('#/user/')) {
            const username = hash.split('#/user/')[1];
            if (username) {
                eventBus.emit('SEARCH_INITIATED', username);
            }
        } else if (hash === '' || hash === '#/') {
            eventBus.emit('SEARCH_CLEARED');
        }
    }
}
