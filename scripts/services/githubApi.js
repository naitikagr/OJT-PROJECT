const BASE_URL = 'https://api.github.com';

export class GithubApi {
    constructor() {
        this.apiKeyKey = 'github_api_key';
    }

    getHeaders() {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        const apiKey = this.getApiKey();
        if (apiKey) {
            headers['Authorization'] = `token ${apiKey}`;
        }
        return headers;
    }

    setApiKey(key) {
        if (key) {
            localStorage.setItem(this.apiKeyKey, key);
        } else {
            localStorage.removeItem(this.apiKeyKey);
        }
    }

    getApiKey() {
        return localStorage.getItem(this.apiKeyKey);
    }

    /**
     * Fetch user profile by username
     * @param {string} username 
     * @returns {Promise<Object>} User data
     */
    async getUser(username) {
        try {
            const response = await fetch(`${BASE_URL}/users/${username}`, {
                headers: this.getHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('User not found');
                } else if (response.status === 403) {
                    throw new Error('API Rate limit exceeded. Please add an API Key in settings.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API Key. Please check your settings.');
                }
                throw new Error(`GitHub API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    /**
     * Fetch user repositories
     * @param {string} username 
     * @param {number} page 
     * @param {number} perPage 
     * @returns {Promise<Array>} List of repositories
     */
    async getRepos(username, page = 1, perPage = 10) {
        try {
            const response = await fetch(
                `${BASE_URL}/users/${username}/repos?sort=updated&page=${page}&per_page=${perPage}`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('API Rate limit exceeded. Please add an API Key in settings.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API Key. Please check your settings.');
                }
                throw new Error('Failed to fetch repositories');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching repos:', error);
            throw error;
        }
    }
}

export const githubApi = new GithubApi();
