#!/usr/bin/env node

const child_process = require("child_process");
const util = require("util");
const minimist = require("minimist");
const replaceInFiles = require("replace-in-files");
const pkg = require("../package.json");

const exec = util.promisify(child_process.exec);
const argv = minimist(process.argv.slice(2));

const name = argv._[0];
const archiveUrl =
  "https://github.com/piecioshka/create-ts-project/archive/main.zip";

function help() {
  console.log("Usage\n\n  create-ts-project <name>\n\nCopyright @ 2019");
}

if (argv.version || argv.v) {
  console.log(pkg.version);
  process.exit(0);
}

if (argv.help || argv.h) {
  help();
  process.exit(0);
}

if (!name) {
  help();
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
  to: name,
};

async function isFileExist(name) {
  try {
    await exec(`stat ${name}`);
    return true;
  } catch (ignore) {
    // console.log(ignore);
    return false;
  }
}

const log = (text) => console.info("[+] " + text);
const fail = (text) => console.error("[-] " + text);

function task(command) {
  log("Command: " + command);
  return exec(command);
}

(async () => {
  log(`Creating: ${name}`);
  try {
    const isDirectoryExist = await isFileExist(name);
    if (isDirectoryExist) {
      throw new Error(`Directory exist - ${name}`);
    }
    // Fetch github.com/piecioshka/create-ts-project
    await task(`wget ${archiveUrl} -O create-ts-project.zip`);
    await task(`unzip create-ts-project.zip`);
    await task(`mv create-ts-project-main ${name}`);
    await task(`rm -rf create-ts-project.zip`);
    // Replace all "create-ts-project" by "NAME"
    await replaceInFiles(options);
    // Git setup & commit
    await task(
      `cd ${name} && git init && git add . && git commit -am "Generate project"`
    );
    log("Project created successfully!");
  } catch (reason) {
    fail(`Project does not created properly: ${reason.message}`);
  }
})();
