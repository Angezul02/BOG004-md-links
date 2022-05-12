// const mdLinks = require('../');

// describe('mdLinks', () => {

//   it('should...', () => {
//     console.log('FIX ME!');
//   });

// });
const validatePath = require("../functions").validatePath;
const documentsRoute = require("../functions").documentsRoute;
const getObjet = require("../functions").getObjet;

describe("validacion del path", () => {
  it("es una función", () => {
    expect(typeof validatePath).toBe("function");
  });

  it("recibe una ruta relativa y la convierte a absoluta", () => {
    let userPathTest = "documents";
    let result =
      "C:\\Users\\LABORATORIA\\Documents\\PROYECTOS LABORATORIA\\BOG004-md-links\\documents";
    return expect(validatePath(userPathTest)).toEqual(result);
  });

  it("recibe un archivo valida si es .md, si es un directorio lo recorre y encuentra archivos .md, si lo es, entonces lo almacena en un array", () => {
    let userDirectoryTest = "documents";
    let result = [
      "documents\\prueba1.md",
      "documents\\prueba2.md",
      "documents\\prueba3.md",
    ];
    return expect(documentsRoute(userDirectoryTest)).toEqual(result);
  });

  it("valida los archivos .md, y encuentra links, los cuales almacena en un objeto", () => {
    let arrayTest = ["documents\\prueba1.md"];
    let objectExpect = [
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach",
        text: "Array.prototype.forEach() - MDN",
        file: "documents\\prueba1.md",
      },
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map",
        text: "Array.prototype.map() - MDN",
        file: "documents\\prueba1.md",
      },
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter",
        text: "Array.prototype.filter() - MDN",
        file: "documents\\prueba1.md",
      },
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce",
        text: "Array.prototype.reduce() - MDN",
        file: "documents\\prueba1.md",
      },
      {
        href: "https://www.omelet.com/error",
        text: "este no funciona",
        file: "documents\\prueba1.md",
      },
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce",
        text: "Array.prototype.reduce() - MDN",
        file: "documents\\prueba1.md",
      },
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach",
        text: "Array.prototype.forEach() - MDN",
        file: "documents\\prueba1.md",
      },
    ];

    return getObjet(arrayTest).then((arrayTest) => {
      expect(arrayTest).toEqual(objectExpect);
    });
  });
});
