#!/usr/bin/env node

const { mdLinks } = require("./index.js");

const userPath = process.argv[2];
// let validateFromConsole = process.argv[3];
const optionsUser = process.argv;

const validate =
  optionsUser.includes("--v") || optionsUser.includes("--validate")
    ? true
    : false;
const stats =
  optionsUser.includes("--s") || optionsUser.includes("--stats") ? true : false;

mdLinks(userPath, { validate, stats }).then((resolve) => {
  if (stats || (validate && stats)) console.table(resolve);
  else console.log(resolve);
});
