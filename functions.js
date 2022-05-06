const { fstat } = require("fs");
const path = require("path");
const fs = require("fs");
const { error } = require("console");
const https = require('https')

// const [, , route] = process.argv;


/* module.exports = (fileMdUrl, options = {validate: false}) => {
  
    let respuesta = {
      data: [],
      errors: ''
    }
  
    const {validate} = options; // destructuring
    
    const links = new Promise((resolve, reject) => {
      
      try {
        //Validar reuta absoluta o relativa
        //Recursividad en caso de que la ruta apunte a un directorio
        const contentMdFile = fs.readFileSync(fileMdUrl, {encoding: 'utf-8', flag: 'r'}).toString()
        //Extraer los links
        respuesta.data = getLinks(contentMdFile, fileMdUrl, validate)
        //Crear el objeto respuesta
      } catch (err) {
          respuesta.errors += "Error en la lectura del archivo, comprueba que la ruta sea correcta o el nombre del archivo esté bien escrito"
      }
    
      if (!respuesta.errors) {
        resolve(respuesta.data)
      } else {
        reject(respuesta.errors)
      }
    })
  
    return links
  }; // fin 
  
  function getLinks(contentMdFile = '', fileMdUrl = '', validate = false) {
    const getLinksRegex = /!*\[(.+?)\]\((.+?)\)/gi
    let getUrls = contentMdFile.match(getLinksRegex)
    const respuesta = createObjectResponse(getUrls, fileMdUrl, validate)
    return respuesta
  }
  
  function createObjectResponse (urls, fileMdUrl, validate) {
    // .map(), .foreach(), .filter(), .reduce()
    const urlProcessed = urls.map((url) => {
      
      const splitUrl = url.split("](")
      const text = splitUrl[0].slice(1)
      const href = splitUrl[1].slice(0, -1)
  
      let objeto = {
        href,
        text,
        file: fileMdUrl
      }
      if (validate) {
        // Validar si la url esta rota
        const getCheckUrl = checkUrl(href)
        console.log("console del validate. return", getCheckUrl)
        objeto.status =  getCheckUrl.status
        objeto.ok = getCheckUrl.ok
        //respuesta.errors = getCheckUrl.error
      }
  
      return objeto
    })
  
    return urlProcessed
  }
  
  function checkUrl (url) {
    let status = ''
    let ok = ''
    let error = ''
    try {
      https.get(url, (resp) => {
        status = resp.statusCode
        console.log("console log de status" ,status)
        if(resp.statusCode >= 200 && resp.statusCode< 400){
        ok = 'ok'
          
        } else {
        ok = 'failed'
          
        }
        console.log('dentro de get')
  
      {status=status, ok=ok} 
      })
    } catch (error) {
      error = error.code;
      ok = 'fail'
      
    }
    return {
      status, ok, error
    }
    
  }
  
  // Ejemplo cómo se va a consumir la libreria
  
  const mdLinks = require ('./index.js')
  
  mdLinks("./README.md", {validate: true})
  .then(links => console.log(links))
  .catch(console.error) */
// function validateUrl(url) {
//   return new Promise((resolve, reject) => {
//     https.get(url, res =>  resolve(res))
//       .on('error', e => reject(false));
//   });
// }
// 

function validateUrl(url) {
    return new Promise((resolve, reject) => {
      https.get(url, res =>  resolve(res))
        .on('error', e => reject(false));
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

// let resultValidatePath = validatePath(route);
// console.log("Resultado del las rutas", resultValidatePath);

// (pendiente)realizar la const los datos transformados al ejecutar la funcion validatePath
// Función aplicando recursividad para hacer recorrido de directorios y push de archivos .md

function documentsRoute(pathUser) {
    const separator = process.platform === "win32" || process.platform === "win64" ? "\\" : "/";
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

// let resultDocumentsRoute = documentsRoute(resultValidatePath);

// console.log(" Esto funciona : ", resultDocumentsRoute);

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
const getObjet = (mdArray)=>
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
  .catch(error => reject(error));

//   getObjet.then(response => {
//     console.log("HOLAAA SOY UN OBJETO",objets)
//   })

//  getObjet(resultDocumentsRoute)
//  .then(res=>{
//     console.log("esto es getObjet", res);
//  })
  
  module.exports = {
    validatePath,
    documentsRoute,
    validateUrl,
    getObjet,  

  }