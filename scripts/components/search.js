import { eventBus } from '../core/eventBus.js';
import { debounce } from '../utils/debounce.js';

export class SearchComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.attachEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="search-box">
                <label for="github-search" class="sr-only">Search GitHub Username</label>
                <input 
                    type="text" 
                    id="github-search" 
                    placeholder="Search GitHub username..." 
                    autocomplete="off"
                    aria-label="Search GitHub username"
                >
            </div>
        `;
    }

    attachEvents() {
        const input = this.container.querySelector('#github-search');

        const handleInput = debounce((e) => {
            const query = e.target.value.trim();
            if (query) {
                window.location.hash = `#/user/${query}`;
            } else {
                window.location.hash = '#/';
            }
        }, 500);

        input.addEventListener('input', handleInput);

        // Sync input with external search events (e.g. from URL or saved profile click)
        eventBus.on('SEARCH_INITIATED', (username) => {
            if (input.value !== username) {
                input.value = username;
            }
        });

        eventBus.on('SEARCH_CLEARED', () => {
            input.value = '';
        });
    }
}
