const { fstat } = require("fs");
const path = require("path");
const fs = require("fs");
const { error } = require("console");
const https = require("https");
var colors = require("colors");

function validatePath(pathUser) {
  if (!fs.existsSync(pathUser)) {
    console.log("☹ ✾ La ruta ingresada no es valida o no existe ✾ ☹".magenta);
    process.exit();
  } else if (path.isAbsolute(pathUser)) {
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
      let directory = pathUser;
      let contentDirectory = fs.readdirSync(directory);
      contentDirectory.forEach((elem) => {
        documentsRoute(pathUser + separator + elem).forEach((elem) => {
          filesPath.push(elem);
        });
      });
    }
  }
  if (filesPath.length === 0) {
    console.log("No se encontraron archivos markdown".magenta);
    process.exit();
  }

  return filesPath;
}

// esta función lee los archivos md, busca links en cada archivo y guarda los links

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
const getObjet = (mdArray) => {
  let urlsOnly = [];
  let pathOnly = [];
  let objets = [];
  return Promise.all(mdArray.map(readDocument))
    .then((data) => {
      const expRegLinks = /!*\[(.+?)\]\((.+?)\)/gi;
      data.forEach((item) => {
        const linksAll = item.fileContent.match(expRegLinks);

        if (linksAll) {
          linksAll.forEach((elem) => {
            urlsOnly.push(elem);
            pathOnly.push(item.route);
          });
        }
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
    .catch((error) => console.error(error));
};

function validateUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => resolve(res)).on("error", (e) => reject(false));
  });
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
  return Promise.all(urlValidatedList).then(() => {
    // Para mostrar la tabla con broken se debe esperar a que termine la validacion con .then
    if (optionsUser.stats) {
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
      // console.table(result);
      return result;
    } else {
      // (colors.cyan("Estos son los enlaces validados: ",
      return data;
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
  return result;
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
