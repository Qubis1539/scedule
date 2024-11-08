import App from "./src/index.js";
import fs from "node:fs";
import path from "node:path";
import config from "./src/config.js";

const pkg = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "./package.json")).toString()
);

new App({ ...config, version: pkg.version });
