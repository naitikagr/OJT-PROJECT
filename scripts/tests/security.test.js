import { escapeHTML } from '../utils/sanitize.js';

export const runSecurityTests = () => {
    console.log('Running Security Tests...');

    const testCases = [
        { input: '<script>alert(1)</script>', expected: '&lt;script&gt;alert(1)&lt;/script&gt;', name: 'Script Tag' },
        { input: 'Hello & World', expected: 'Hello &amp; World', name: 'Ampersand' },
        { input: '"Quote"', expected: '&quot;Quote&quot;', name: 'Double Quote' },
        { input: "'Single'", expected: '&#039;Single&#039;', name: 'Single Quote' },
        { input: '<b>Bold</b>', expected: '&lt;b&gt;Bold&lt;/b&gt;', name: 'HTML Tag' }
    ];

    let passed = 0;
    testCases.forEach(test => {
        const result = escapeHTML(test.input);
        if (result === test.expected) {
            console.log(`✅ ${test.name} Passed`);
            passed++;
        } else {
            console.error(`❌ ${test.name} Failed. Expected "${test.expected}", got "${result}"`);
        }
    });

    console.log(`Security Tests: ${passed}/${testCases.length} Passed`);
    return passed === testCases.length;
};
