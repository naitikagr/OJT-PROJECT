import { githubApi } from '../services/githubApi.js';

export class SettingsComponent {
    constructor(containerId, buttonId) {
        this.container = document.getElementById(containerId);
        this.button = document.getElementById(buttonId);
        this.render();
        this.attachEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="settings-modal" id="settings-modal" aria-hidden="true" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Settings</h2>
                        <button class="close-btn" aria-label="Close settings">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="api-key">GitHub Personal Access Token</label>
                            <p class="help-text">Add a token to increase rate limits. <a href="https://github.com/settings/tokens" target="_blank">Generate one here</a>.</p>
                            <input type="password" id="api-key" placeholder="ghp_..." autocomplete="off">
                        </div>
                        <div id="settings-message" class="message"></div>
                    </div>
                    <div class="modal-footer">
                        <button id="save-settings" class="btn-primary">Save</button>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop" id="modal-backdrop" style="display: none;"></div>
        `;
    }

    attachEvents() {
        const modal = this.container.querySelector('#settings-modal');
        const backdrop = this.container.querySelector('#modal-backdrop');
        const closeBtn = this.container.querySelector('.close-btn');
        const saveBtn = this.container.querySelector('#save-settings');
        const input = this.container.querySelector('#api-key');
        const message = this.container.querySelector('#settings-message');

        const openModal = () => {
            const currentKey = githubApi.getApiKey();
            input.value = currentKey || '';
            modal.style.display = 'block';
            backdrop.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            message.textContent = '';
            message.className = 'message';
        };

        const closeModal = () => {
            modal.style.display = 'none';
            backdrop.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        };

        this.button.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        saveBtn.addEventListener('click', () => {
            const key = input.value.trim();
            githubApi.setApiKey(key);

            message.textContent = 'Settings saved!';
            message.className = 'message success';

            setTimeout(() => {
                closeModal();
            }, 1000);
        });
    }
}
