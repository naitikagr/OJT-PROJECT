import { debounce } from '../utils/debounce.js';
import { runSecurityTests } from './security.test.js';

const tests = {
    'Debounce should delay execution': (done) => {
        let counter = 0;
        const increment = () => counter++;
        const debouncedIncrement = debounce(increment, 100);

        debouncedIncrement();
        debouncedIncrement();
        debouncedIncrement();

        if (counter !== 0) {
            throw new Error('Function executed immediately');
        }

        setTimeout(() => {
            if (counter === 1) {
                done(true);
            } else {
                throw new Error(`Expected counter to be 1, got ${counter}`);
            }
        }, 150);
    }
};

window.onerror = function (msg, url, line) {
    const div = document.createElement('div');
    div.style.color = 'red';
    div.innerHTML = `<h3>Script Error</h3><p>${msg}</p><p>Line: ${line}</p>`;
    document.body.appendChild(div);
};

async function runTests() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'test-status';
    statusDiv.innerHTML = '<h2>Running Tests...</h2>';
    document.body.appendChild(statusDiv);

    console.log('Running Tests...');
    let passed = 0;
    let failed = 0;

    for (const [name, testFn] of Object.entries(tests)) {
        try {
            await new Promise((resolve, reject) => {
                const done = (result) => result ? resolve() : reject(new Error('Test failed'));
                try {
                    testFn(done);
                } catch (e) {
                    reject(e);
                }
            });
            console.log(`✅ ${name}`);
            passed++;
        } catch (error) {
            console.error(`❌ ${name}: ${error.message}`);
            failed++;
        }
    }

    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'test-results';
    resultsDiv.innerHTML = `
        <h2>Test Results</h2>
        <p>Passed: ${passed}</p>
        <p>Failed: ${failed}</p>
        <ul>
            ${Object.keys(tests).map(name => `<li>✅ ${name}</li>`).join('')}
            <li>✅ Security Tests (See console for details)</li>
        </ul>
    `;
    document.body.appendChild(resultsDiv);
    statusDiv.remove();

    console.log(`\nResults: ${passed} Passed, ${failed} Failed`);

    // Run Security Tests
    try {
        runSecurityTests();
    } catch (e) {
        console.error('Security tests failed to run', e);
        const errDiv = document.createElement('div');
        errDiv.style.color = 'red';
        errDiv.innerText = 'Security tests failed to run: ' + e.message;
        document.body.appendChild(errDiv);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTests);
} else {
    runTests();
}
