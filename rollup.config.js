import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-import-css";
import dsv from "@rollup/plugin-dsv";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/index.js",
  plugins: [
    commonjs(),
    css(),
    dsv(),
    json(),
    nodeResolve({
      preferBuiltins: true,
    }),
    terser(),
  ],
  output: [
    {
      name: "@bdelab/roar-swr",
      file: pkg.module,
      format: "es",
    },
  ],
};
