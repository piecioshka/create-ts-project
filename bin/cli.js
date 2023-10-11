#!/usr/bin/env node

const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(child_process.exec);

const yargs = require('yargs');
const ora = require('ora');
const replaceInFiles = require('replace-in-files');

const argv = yargs
    .usage('Usage\n\n  create-ts-project <name>')
    .epilog('Copyright @ 2019')
    .argv;

const name = argv._[0];
const package = 'https://github.com/piecioshka/create-ts-project/archive/master.zip';

if (!name) {
    yargs.showHelp();
    process.exit(1);
}

const options = {
    files: [
        `${name}/README.md`,
        `${name}/package.json`,
        `${name}/package-lock.json`,
        `${name}/bin/cli.js`,
    ],
    from: /create-ts-project/g,
    to: name
};

const state = ora();
state.start();

async function isFileExist(name) {
    try {
        await exec(`stat ${name}`);
        return true;
    } catch (ignore) {
        // console.log(ignore);
        return false;
    }
}

(async () => {
    state.info(`Create project: ${name}`);
    try {
        const isDirectoryExist = await isFileExist(name);
        if (isDirectoryExist) {
            throw new Error(`Directory exist - ${name}`);
        }
        // Fetch github.com/piecioshka/create-ts-project
        await exec(`wget ${package} -O create-ts-project.zip`);
        await exec(`unzip create-ts-project.zip`);
        await exec(`mv create-ts-project-master ${name}`);
        await exec(`rm -rf create-ts-project.zip`);
        // Replace all "create-ts-project" by "NAME"
        await replaceInFiles(options);
        // Git setup & commit
        await exec(`cd ${name} && git init && git add . && git commit -am "Generate project"`);
        state.succeed('Project created');
        state.stop();
    } catch (reason) {
        state.fail(`Project does not created properly: ${reason.message}`);
    }
})();
