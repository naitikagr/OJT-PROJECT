const BASE_URL = 'https://api.github.com';

export class GithubApi {
    constructor() {
        this.headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
    }

    /**
     * Fetch user profile by username
     * @param {string} username 
     * @returns {Promise<Object>} User data
     */
    async getUser(username) {
        try {
            const response = await fetch(`${BASE_URL}/users/${username}`, {
                headers: this.headers
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('User not found');
                } else if (response.status === 403) {
                    throw new Error('API Rate limit exceeded. Please try again later.');
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
                { headers: this.headers }
            );

            if (!response.ok) {
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
