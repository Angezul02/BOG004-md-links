const {
  validatePath,
  documentsRoute,
  validateUrl,
  getObjet,
} = require("./functions.js");

const userPath = process.argv[2];
const userValidate = process.argv[3];
const optionsUser = process.argv;

// const opValidateStats =
//   (optionsUser.includes("--validate") || optionsUser.includes("--v")) &&
//   (optionsUser.includes("--stats") || optionsUser.includes("--s"));

// Es mejor crear una funcion que cree un nuevo array con los argumentos que debe retornar options:18 = [--validate, --stast]
// utilizamos indexOf() para obtener en index del un elemento si no lo contiene nos retorna -1

let response = {
  data: [], // array de objetos href, text, etc
  errors: "",
};

function mdLinks(userPath = "", options = { validate: false, stats: false }) {
  const { validate, stats } = options;

  return new Promise((resolve, reject) => {
    const validateRoute = validatePath(userPath);
    const resultDocumentsRoute = documentsRoute(validateRoute);
    getObjet(resultDocumentsRoute) // intentar dejaar solo la función mdlinks
      .then((resolve) => {
        response.data = resolve;
      })
      .then(() => {
        // teniendo el array de las opciones debemos validar si se incluye las opciones --validate y --stats en todos sus casos
        // utilizamos includes() para validar si existe un objeto en un array
        if (optionsUser.includes("--validate") || optionsUser.includes("--v")) {
          let urlValidatedList = response.data.map((object) =>
            validateUrl(object.href)
              .then((res) => {
                object.status = res.statusCode;
                object.ok =
                  res.statusCode >= 200 && res.statusCode <= 399
                    ? "ok"
                    : "fail";
              })
              .catch((error) => {
                object.status = error.code;
                object.ok = "fail";
              })
          );

          Promise.all(urlValidatedList).then(() => {
            resolve(response.data);
          });
        } else if (
          optionsUser.includes("--stats") ||
          optionsUser.includes("--s")
        ) {
          let filterDataWithHref = response.data.filter((object) =>
            object.hasOwnProperty("href")
          );

          let result = {
            Total: filterDataWithHref.length,
            Unique: filterDataWithHref.length,
          };
          console.table(result);
          // console.log(result);
        } else if (
          optionsUser.includes("--p")
          // (optionsUser.includes("--validate") || optionsUser.includes("--v")) &&
          // (optionsUser.includes("--stats") || optionsUser.includes("--s"))
        ) {
          let filterDataWithHref = response.data.filter((object) =>
            object.hasOwnProperty("href")
          );
          // console.log("esto es filterdata:", filterDataWithHref);
          let filterDataWithStatus = response.data.filter((object) =>
            object.hasOwnProperty("")
          );
          // console.log("filter estatus es esto:", filterDataWithStatus);
          let result = {
            Total: filterDataWithHref.length,
            Unique: filterDataWithHref.length,
            Broken: filterDataWithStatus.length,
          };
          console.table(result);
        } else {
          if (!response.errors) {
            resolve(response.data);
          } else {
            reject(response.errors);
          }
        }
      });
  });
}

mdLinks(userPath, { validate: optionsUser, stats: optionsUser })
  .then((links) => console.log("links: ", links))
  .catch(console.error);
