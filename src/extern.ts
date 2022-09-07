import * as fs from "fs";
import * as process from "process";
import * as tok from "./lex"
import * as cc from "./xcc"

//     s.slice(0,s.indexOf("."))
export function load_global(inputf,outf) {
    let filein = fs.readFileSync(inputf,'utf8');    

    // colocar declaracao jasm
    filein = filein.replace(/(var)(?=(?:[^'"]|["'][^'"]*["'])*$)/g,"let")
    filein = filein.replace(/(assign)(?=(?:[^'"]|["'][^'"]*["'])*$)/g,"")
    filein = filein.replace(/#/gi,"//")
    filein = filein.replace(/:=/gi,"=")
    fs.writeFileSync(outf,filein);
}