import { eventBus } from '../core/eventBus.js';
import { githubApi } from '../services/githubApi.js';
import { storageService } from '../services/storage.js';

export class ProfileCard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.errorContainer = document.getElementById('error-container');
        this.attachEvents();
    }

    attachEvents() {
        eventBus.on('SEARCH_INITIATED', this.handleSearch.bind(this));
        eventBus.on('SEARCH_CLEARED', this.clear.bind(this));
    }

    async handleSearch(username) {
        this.showLoading();
        this.clearError();

        try {
            const [user, repos] = await Promise.all([
                githubApi.getUser(username),
                githubApi.getRepos(username)
            ]);

            this.render(user, repos);
        } catch (error) {
            this.showError(error.message);
            this.clear();
        }
    }

    showLoading() {
        this.container.innerHTML = '<div class="placeholder-text">Loading...</div>';
    }

    clearError() {
        this.errorContainer.innerHTML = '';
        this.errorContainer.style.display = 'none';
    }

    showError(message) {
        this.errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
        this.errorContainer.style.display = 'block';
    }

    clear() {
        this.container.innerHTML = '<p class="placeholder-text">Search for a GitHub user to see their profile.</p>';
    }

    render(user, repos) {
        const isSaved = storageService.getSavedProfiles().some(p => p.id === user.id);
        const saveBtnText = isSaved ? 'Saved' : 'Follow'; // Using "Follow" terminology for UI, but it saves locally
        const saveBtnClass = isSaved ? 'btn-secondary' : 'btn-primary';

        const repoList = repos.map(repo => {
            // Simple color mapping for common languages
            const langColors = {
                'JavaScript': '#f1e05a',
                'TypeScript': '#2b7489',
                'HTML': '#e34c26',
                'CSS': '#563d7c',
                'Python': '#3572A5',
                'Java': '#b07219'
            };
            const langColor = langColors[repo.language] || '#8b949e';

            return `
            <div class="repo-card">
                <div>
                    <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                    <p class="repo-desc">${repo.description || 'No description available'}</p>
                </div>
                <div class="repo-meta">
                    ${repo.language ? `
                        <span style="display: flex; align-items: center;">
                            <span class="repo-lang-color" style="background-color: ${langColor}"></span>
                            ${repo.language}
                        </span>
                    ` : ''}
                    <span>
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                        ${repo.stargazers_count}
                    </span>
                    <span>
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>
                        ${repo.forks_count}
                    </span>
                </div>
            </div>
        `}).join('');

        // Icons SVG
        const usersIcon = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-people" fill="currentColor" style="margin-right: 4px"><path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.507 5.507 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.49 3.49 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.75.75 0 0 1-1.498.079 3.502 3.502 0 0 0-5.16-2.984.75.75 0 0 1-.627-1.276A3 3 0 0 1 11 4Zm-9 1.5a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm2.5 6.5a4.5 4.5 0 0 1 0-9 4.5 4.5 0 0 1 0 9Z"></path></svg>';

        this.container.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="profile-avatar">
                    <div class="profile-info">
                        <h2>${user.name || user.login}</h2>
                        <p class="profile-login">${user.login}</p>
                        ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
                        
                        <div class="profile-stats">
                            <div class="stat-item">
                                ${usersIcon}
                                <span class="stat-value">${user.followers}</span>
                                <span class="stat-label">followers</span>
                            </div>
                            <div class="stat-item">
                                <span>·</span>
                                <span class="stat-value">${user.following}</span>
                                <span class="stat-label">following</span>
                            </div>
                        </div>

                        <button id="save-profile-btn" class="${saveBtnClass}" data-id="${user.id}">${saveBtnText}</button>
                    </div>
                </div>
                
                <h3 class="repo-list-header">Top Repositories</h3>
                <div class="repo-list">
                    ${repoList}
                </div>
            </div>
        `;

        // Attach save event
        const saveBtn = this.container.querySelector('#save-profile-btn');
        saveBtn.addEventListener('click', () => {
            if (!isSaved) {
                storageService.saveProfile(user);
                eventBus.emit('PROFILE_SAVED');
                this.render(user, repos); // Re-render to update button state
            }
        });
    }
}