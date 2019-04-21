import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

let createBuild = (format, file) => ({
  input: pkg.source,
  ...(pkg.peerDependencies && { external: Object.keys(pkg.peerDependencies) }),
  output: { file, format },
  plugins: [terser(), filesize()]
});

export default [createBuild("cjs", pkg.main), createBuild("es", pkg.module)];
