const fs = require('fs');
const path = require('path');

function fetchCommitId() {
    const headFile = path.resolve(__dirname, '../.git/HEAD');
    if (!fs.existsSync(headFile)) return null;
    const headContent = fs.readFileSync(headFile, 'utf8');

    const targetReference = headContent.match(/^ref: (?<ref>[^\r\n]*)[\r\n]*$/)?.groups['ref'];
    if (targetReference === null) return null;

    const referenceFile = path.resolve(__dirname, `../.git/${targetReference}`);
    if (!fs.existsSync(referenceFile)) return null;

    const commitId = fs.readFileSync(referenceFile, 'utf8');
    return commitId.replace(/[\r\n]/g, '');
}

function fetchVersion() {
    const environmentVersion = process.env.LIKO_VERSION ?? process.env.GITHUB_REF_NAME;
    if (environmentVersion) return environmentVersion;

    const commitId = fetchCommitId();
    if (commitId) return commitId;

    return 'custom';
}

module.exports = { fetchVersion };