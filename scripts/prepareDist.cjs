// The GraphQL Testing Library source that is published to npm is located in the
// "dist" directory. This script is called when building the library, to prepare
// the "dist" directory for publishing.
//
// This script will:
//
// - Copy the current root package.json into "dist" after adjusting it for
//   publishing.
// - Copy the supporting files from the root into "dist" (e.g. `README.MD`,
//   `LICENSE`, etc.).
// - Copy the .changeset folder into "dist" so Changesets can pick up the
//   markdown changesets when generating the release.
// - Copy CHANGELOG.md into "dist" so Changesets can use it to generate release
//   notes.
// - Add both .changeset and CHANGELOG.md to an .npmignore so they are not
//   included in the published package.

const fs = require("fs");
const path = require("path");
const distRoot = `${__dirname}/../dist`;
const srcDir = `${__dirname}/..`;
const destDir = `${srcDir}/dist`;

/* @apollo/graphql-testing-library */

const packageJson = require("../package.json");

// The root package.json is marked as private to prevent publishing
// from happening in the root of the project. This sets the package back to
// public so it can be published from the "dist" directory.
packageJson.private = false;

// Remove package.json items that we don't need to publish
delete packageJson.relay;
delete packageJson.msw;
delete packageJson.devDependencies;
delete packageJson.scripts;

// The root package.json points to the CJS/ESM source in "dist", to support
// on-going package development (e.g. running tests, supporting npm link, etc.).
// When publishing from "dist" however, we need to update the package.json
// to point to the files within the same directory.
const distPackageJson = JSON.stringify(packageJson, null, 2) + "\n";

// Recursive copy function
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? copyDir(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }
}

// Save the modified package.json to "dist"
fs.writeFileSync(`${distRoot}/package.json`, distPackageJson);

// Copy supporting files into "dist"
fs.copyFileSync(`${srcDir}/README.md`, `${destDir}/README.md`);
fs.copyFileSync(`${srcDir}/LICENSE`, `${destDir}/LICENSE`);
fs.copyFileSync(`${srcDir}/CHANGELOG.md`, `${destDir}/CHANGELOG.md`);

// Copy changesets to "dist"
copyDir(`${srcDir}/.changeset`, `${destDir}/.changeset`);

// Add .changeset and CHANGELOG.md to .npmignore in "dist"
fs.writeFileSync(`${destDir}/.npmignore`, `.changeset\nCHANGELOG.md`);
