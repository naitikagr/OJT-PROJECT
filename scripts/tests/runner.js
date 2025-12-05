import { debounce } from '../utils/debounce.js';

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

async function runTests() {
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

    console.log(`\nResults: ${passed} Passed, ${failed} Failed`);
}

runTests();
