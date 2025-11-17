# GitHub Developer Profile Insight Viewer

A performant, accessible, and offline-capable GitHub Developer Profile Viewer built with Vanilla JavaScript.

## Features

- **Search**: Find GitHub users by username (debounced input).
- **Profile View**: View user details, stats, and repositories.
- **Persistence**: Save favorite profiles locally (LocalStorage).
- **Offline Support**: Works offline via Service Worker.
- **Routing**: Shareable URLs for profiles (Hash-based routing).
- **Responsive Design**: Optimized for mobile and desktop.
- **Accessibility**: Semantic HTML and ARIA attributes.

## Architecture

- **Vanilla JS (ES6 Modules)**: No frameworks, just pure JS.
- **Pub/Sub Pattern**: `EventBus` for decoupled component communication.
- **Service Layer**: `GithubApi` for data fetching, `StorageService` for persistence.
- **Components**: Modular UI components (`Search`, `ProfileCard`, `SavedProfiles`).

## Setup

1. Clone the repository.
2. Open `index.html` in a modern browser.
   - Note: For ES6 modules to work locally, you might need a local server (e.g., `python3 -m http.server` or VS Code Live Server).

## Testing

Open `tests.html` in the browser and check the console for test results.

## License

MIT
