#!/usr/bin/env node
console.log("hello");
var fs = require("fs");
var code = fs.readFileSync("/tmp/x.ts", "utf-8");
console.log(code);
require("@babel/parser").parse(code, {
  // parse in strict mode and allow module declarations
  sourceType: "module",
  presets: ["@babel/preset-typescript"],
  plugins: [
    // enable jsx and flow syntax
    "ts",
    "jsx",
    "flow"
  ]
});
