const {
  validatePath,
  documentsRoute,
  validateUrl,
  getObjet,  

}= require('./functions.js')

const userPath = process.argv[2];
const userValidate = process.argv[3];

let response = {
  data: [], // array de objetos href, text, etc
  errors: '', 
}

function mdLinks (userPath = '' , options = {validate: false}) {
  const {validate} = options
  return new Promise ((resolve, reject)=>{
    const validateRoute = validatePath(userPath);
    const resultDocumentsRoute = documentsRoute(validateRoute);
    getObjet(resultDocumentsRoute)
    .then((resolve)=>{
      response.data = resolve;
    })
    .then (()=>{
      if(validate === '--validate'){
        let urlValidatedList = response.data.map(object => 
          validateUrl(object.href)
          .then( res => {
            object.status = res.statusCode;
            object.ok = 
              res.statusCode >= 200 && res.statusCode <= 399  ? 'ok' : 'fail';
          })
          .catch(error => {
            object.status = error.code;
            object.ok = 'fail';
          })
        )
        Promise.all(urlValidatedList).then(() => {
          resolve(response.data)
        });
      } else {
        
        if (!response.errors) {
          resolve(response.data);
        } else {
          reject(response.errors);
        }
      }

    })

  });
}
 
mdLinks(userPath, {validate: userValidate})
.then(links => console.log('links: ', links))
.catch(console.error)
