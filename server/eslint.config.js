const globals = {
  require: "readonly",
  module: "readonly",
  exports: "readonly",
  process: "readonly",
  console: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  Buffer: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly"
}

module.exports = [
  {
    files: [
      "**/*.js"
    ],

    ignores: [
      "node_modules/**"
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals
    }
  }
]