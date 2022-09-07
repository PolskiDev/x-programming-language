import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'

function card_reader(file:string) {
    let data = fs.readFileSync(file,'utf-8')
    let result = data.split(/\n/);
    for(var i in result) {
        console.log(result[i])
        let module_package = result[i].slice(result[i].lastIndexOf("/")+1,result[i].length)

        if (!fs.existsSync(`${__dirname}/deno_modules`)){
            fs.mkdirSync(`${__dirname}/deno_modules`, { recursive: true });
        }


        if(result[i].includes("http://")) {
            http.get(result[i], (res) => {
              const path = `${__dirname}/deno_modules/${module_package}`;
              const writeStream = fs.createWriteStream(path);
            
              res.pipe(writeStream);
            
              writeStream.on("finish", () => {
                writeStream.close();
                console.log(`Module ${URL} was successfully stored at ${file}!`)
              });
            });

        } else if(result[i].includes("https://")) {
            https.get(result[i], (res) => {
                const path = `${__dirname}/deno_modules/${module_package}`;
                const writeStream = fs.createWriteStream(path);
              
                res.pipe(writeStream);
              
                writeStream.on("finish", () => {
                  writeStream.close();
                  console.log(`Module ${URL} was successfully stored at ${file}!`)
                });
              });
        }
    }   
}

card_reader("deps.config")