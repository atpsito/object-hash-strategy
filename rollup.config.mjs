import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";

import globalPackageJSON from "./package.json" assert { type: "json" };

const dist = "dist/bundle";

const bundleConfig = packageJSON => {
  const external = [
    ...Object.keys(packageJSON.devDependencies ?? {}),
    ...Object.keys(packageJSON.dependencies ?? {})
  ];

  return {
    input: "src/index.ts",
    output: [
      {
        file: `${dist}.cjs.js`,
        format: "cjs",
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: `${dist}.esm.js`,
        format: "esm",
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    plugins: [
      commonjs(),
      esbuild({
        sourceMap: true,
        target: "ES2016",
        minify: false,
        tsconfig: "./tsconfig.json" // default
      })
    ],
    external
  };
};

const declarationsConfig = {
  input: "src/index.ts",
  output: [
    {
      file: `${dist}.d.ts`,
      format: "es"
    }
  ],
  plugins: [dts()],
  external: []
};

const bundleConfigConst = bundleConfig(globalPackageJSON);

export default [bundleConfigConst, declarationsConfig];
