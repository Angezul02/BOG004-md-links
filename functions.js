const { fstat } = require("fs");
const path = require("path");
const fs = require("fs");
const { error } = require("console");
const https = require("https");

function validateUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => resolve(res)).on("error", (e) => reject(false));
  });
}

function validatePath(pathUser) {
  if (path.isAbsolute(pathUser)) {
    return pathUser;
  } else {
    const pathAbsolute = path.resolve(pathUser).normalize();
    return pathAbsolute;
  }
}

// Función aplicando recursividad para hacer recorrido de directorios y push de archivos .md

function documentsRoute(pathUser) {
  const separator =
    process.platform === "win32" || process.platform === "win64" ? "\\" : "/";
  let filesPath = [];
  if (fs.statSync(pathUser).isFile() && path.extname(pathUser) === ".md") {
    filesPath.push(pathUser);
  } else {
    if (fs.statSync(pathUser).isDirectory()) {
      const directory = pathUser;
      let contentDirectory = fs.readdirSync(directory);
      contentDirectory.forEach((elem) => {
        documentsRoute(pathUser + separator + elem).forEach((elem) => {
          filesPath.push(elem);
        });
      });
    }
  }
  return filesPath;
}

// esta función lee los archivos md, busca links en cada archivo y guarda los links

let urlsOnly = [];
let pathOnly = [];
let objets = [];

const readDocument = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (error, data) => {
      if (error) return reject(error);
      else {
        resolve({
          route: file,
          fileContent: data,
        });
      }
    });
  });
};
const getObjet = (mdArray) =>
  Promise.all(mdArray.map(readDocument))
    .then((data) => {
      const expRegLinks = /!*\[(.+?)\]\((.+?)\)/gi;
      data.forEach((item) => {
        const linksAll = [...item.fileContent.toString().match(expRegLinks)];
        linksAll.forEach((elem) => {
          urlsOnly.push(elem);
          pathOnly.push(item.route);
        });
      });
      objets = urlsOnly.map((links) => {
        let index = urlsOnly.indexOf(links);
        const splitUrl = links.split("](");
        const text = splitUrl[0].slice(1);
        const href = splitUrl[1].slice(0, -1);
        return {
          href,
          text: text.substring(0, 50),
          file: pathOnly[index],
        };
      });
      return objets;
    })
    .catch((error) =>
      console.log("Debe ingresar la ruta de un archivo o carpeta", error)
    );

function stats(linksArray) {
  let validateLinks = 0;
  let invalidateLinks = 0;

  let unique = new set(linksArray.map((link) => link.href === link.file));
}

function CreateObjectWithvalidateUrl(data, optionsUser) {
  let urlValidatedList = data.map((object) =>
    validateUrl(object.href)
      .then((res) => {
        object.status = res.statusCode;
        object.ok =
          res.statusCode >= 200 && res.statusCode <= 399 ? "ok" : "fail";
      })
      .catch((error) => {
        object.status = error.code;
        object.ok = "fail";
      })
  );
  Promise.all(urlValidatedList).then(() => {
    // Para mostrar la tabla con broken se debe esperar a que termine la validacion con .then
    if (optionsUser.stats === "--s" || optionsUser.stats === "--stats") {
      const filterDataWithHref = getTotalLinks(data);
      const filterDataWithStatus = data.filter(
        (object) => object.ok === "fail"
      );
      const unique = getUnique(data);

      result = {
        Total: filterDataWithHref.length,
        Unique: unique.length,
        Broken: filterDataWithStatus.length,
      };
      console.table(result);
    } else {
      console.log("Links desde promesa: ", data); //pinta aqui
    }
  });
}

function objectfitStat(data) {
  const filterDataWithHref = getTotalLinks(data);
  const unique = getUnique(data);

  result = {
    Total: filterDataWithHref.length,
    Unique: unique.length,
  };
  console.table(result);
}

function getUnique(data) {
  return [...new Set(data.map((object) => object.href))];
}

function getTotalLinks(data) {
  return data.filter((object) => object.hasOwnProperty("href"));
}

module.exports = {
  validatePath,
  documentsRoute,
  validateUrl,
  getObjet,
  CreateObjectWithvalidateUrl,
  objectfitStat,
};
