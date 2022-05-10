const { mdLinks } = require("./index.js");

const userPath = process.argv[2];
// let validateFromConsole = process.argv[3];
const optionsUser = process.argv;

const validate =
  optionsUser.includes("--v") || optionsUser.includes("--validate")
    ? "--v"
    : "";
const stats =
  optionsUser.includes("--s") || optionsUser.includes("--stats") ? "--s" : "";

mdLinks(userPath, { validate, stats });
