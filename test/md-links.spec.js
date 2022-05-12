const { mdLinks } = require("../index.js");

describe("Función mdLinks", () => {
  it("es una función", () => {
    expect(typeof mdLinks).toBe("function");
  });

  it("Al ejecutar la función mdLinks con option false, la función retorna solo el objeto con 3 keys: href, text, file ", () => {
    let pathTestMd =
      "C:\\Users\\LABORATORIA\\Documents\\PROYECTOS LABORATORIA\\BOG004-md-links\\documents\\prueba3.md";
    let objectExpectMd = [
      {
        href: "https://internetpasoapaso.com/simbolos/#especiales",
        text: "Enlace prueba 3",
        file: "C:\\Users\\LABORATORIA\\Documents\\PROYECTOS LABORATORIA\\BOG004-md-links\\documents\\prueba3.md",
      },
    ];
    return mdLinks(pathTestMd).then((arrayObjects) => {
      expect(arrayObjects).toEqual(objectExpectMd);
    });
  });

  it("Al ejecutar la función mdLinks con option true, la función retorna solo el objeto con 5 keys: href, text, file, status, ok ", () => {
    let pathTestValidate =
      "C:\\Users\\LABORATORIA\\Documents\\PROYECTOS LABORATORIA\\BOG004-md-links\\documents\\prueba3.md";
    let objectExpectValidate = [
      {
        file: "C:\\Users\\LABORATORIA\\Documents\\PROYECTOS LABORATORIA\\BOG004-md-links\\documents\\prueba3.md",
        href: "https://internetpasoapaso.com/simbolos/#especiales",
        ok: "ok",
        status: 200,
        text: "Enlace prueba 3",
      },
    ];
    return mdLinks(pathTestValidate, { validate: true }).then(
      (arrayObjects) => {
        expect(arrayObjects).toEqual(objectExpectValidate);
      }
    );
  });
  it("Al ejecutar la función mdLinks con path y option --s retorna un objeto con total y Unique", () => {
    let pathTestValidate =
      "C:\\Users\\LABORATORIA\\Documents\\PROYECTOS LABORATORIA\\BOG004-md-links\\documents\\prueba3.md";
    let objectExpectValidate = { Total: 1, Unique: 1 };

    return mdLinks(pathTestValidate, { stats: true }).then((arrayObjects) => {
      expect(arrayObjects).toEqual(objectExpectValidate);
    });
  });
  it("Al ejecutar la función mdLinks con path y option --v --s retorna un objeto con Total, Unique y Broken", () => {
    let pathTestValidate =
      "C:\\Users\\LABORATORIA\\Documents\\PROYECTOS LABORATORIA\\BOG004-md-links\\documents\\prueba3.md";
    let objectExpectValidate = { Broken: 0, Total: 1, Unique: 1 };

    return mdLinks(pathTestValidate, { validate: true, stats: true }).then(
      (arrayObjects) => {
        expect(arrayObjects).toEqual(objectExpectValidate);
      }
    );
  });
});
