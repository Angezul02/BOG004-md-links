const {
  validatePath,
  documentsRoute,
  getObjet,
  CreateObjectWithvalidateUrl,
  objectfitStat,
} = require("./functions.js");

// const userPath = process.argv[2];
// const userValidate = process.argv[3];
// const optionsUser = process.argv;

let response = {
  data: [], // array de objetos href, text, etc
  errors: "",
};

function mdLinks(path = "", optionsUser = { validate: false, stats: "" }) {
  // const { validate, stats } = options;

  return new Promise((resolve, reject) => {
    const validateRoute = validatePath(path);
    const resultDocumentsRoute = documentsRoute(validateRoute);
    getObjet(resultDocumentsRoute) // intentar dejaar solo la función mdlinks
      .then((resolve) => {
        response.data = resolve;
      })
      .then(() => {
        if (
          optionsUser?.validate === "--validate" ||
          optionsUser?.validate === "--v"
        ) {
          CreateObjectWithvalidateUrl(response.data, optionsUser);
        } else if (
          (optionsUser?.validate !== "--validate" ||
            optionsUser?.validate !== "--v") &&
          (optionsUser?.stats === "--stats" || optionsUser?.stats === "--s")
        ) {
          objectfitStat(response.data);
        } else {
          if (!response.errors) {
            console.log(response.data);
            resolve(response.data);
          } else {
            reject(response.errors);
          }
        }
      });
  });
}

// mdLinks(userPath, { validate: optionsUser, stats: optionsUser })
//   .then((links) => console.log("links: ", links))
//   .catch(console.error);

module.exports = {
  mdLinks,
};
