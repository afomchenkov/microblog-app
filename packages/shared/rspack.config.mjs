import path from "node:path";

/** @type {import('@rspack/cli').Configuration} */
export default {
  mode: "production",
  entry: {
    index: path.resolve("src/index.ts")
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name].mjs",
    library: {
      type: "module"
    },
    clean: false
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: { syntax: "typescript" },
            target: "es2022"
          }
        }
      }
    ]
  }
};