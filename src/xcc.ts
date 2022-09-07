import * as fs from 'fs';
import { stdout } from 'process';
import { exec } from 'child_process';
import * as tok from './lex';
import * as ext from './extern';
import * as os from './os';


let execfile = process.argv[1];
const version = "1.0"


var procmode;
export var inputfile;
export var asm;
export let segment; // HERE
export let linked_file; // HERE
if (process.argv[2]) { procmode = process.argv[2]; }
if (process.argv[3]) {
    inputfile = process.argv[3]
    asm = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.OBJECT_FILE; //HERE
    segment = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.EXTERN_FILE_EXTENSIONS; //HERE
    linked_file = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.OUTPUT_FILE_EXTENSIONS; //HERE
}



let t:any = [];
let filein:any;
if(procmode == "-c") {
    filein = fs.readFileSync(inputfile,'utf8');
    t = filein.split(/\s+/);
    //t = filein.split(/"[^"]+"|([^"]+)/g)
    //t = filein.split(/([a-z][A-Z])(?=(?:[^'"]|["'][^'"]*["'])*$)/g)

    if (fs.existsSync("./"+asm)) {
        fs.unlinkSync("./"+asm);
    }
    if (fs.existsSync("./"+linked_file)) {
        fs.unlinkSync("./"+linked_file);
    }
}


export function asmCompileFunction() {
    for(var token in t) {
        t.push(token);
        stdout.write("{"+t[token]+"} ");
    }    
    // TST - Token Syntax Tree    
    for (var i=0; i < t.length; i++) {
        var export_locked
        if(t[i] == tok.use_node) {
            export_locked = true
        }

        var global
        if(t[i] == tok.use_global) {
            global = true
        }

        /** Begin program */
        if (t[i] == tok.start) {
            fs.writeFileSync(asm,"/* INICIO */\n")
                /*if(os.windows) {
                    for(var i=0; i<os.libs.length; i++) {
                        fs.appendFileSync(asm,fs.readFileSync(os.libs_path_win32+os.libs[i]))
                    }
                } else if(os.darwin) {
                    for(var i=0; i<os.libs.length; i++) {
                        fs.appendFileSync(asm,fs.readFileSync(os.libs_path_darwin+os.libs[i]))
                    }
                } else if(os.linux) {
                    for(var i=0; i<os.libs.length; i++) {
                        fs.appendFileSync(asm,fs.readFileSync(os.libs_path_linux+os.libs[i]))
                    }
                } else if(os.freebsd) {
                    for(var i=0; i<os.libs.length; i++) {
                        fs.appendFileSync(asm,fs.readFileSync(os.libs_path_freebsd+os.libs[i]))
                    }
                } else if(os.openbsd) {
                    for(var i=0; i<os.libs.length; i++) {
                        fs.appendFileSync(asm,fs.readFileSync(os.libs_path_openbsd+os.libs[i]))
                    }
                } else if(os.solaris) {
                    for(var i=0; i<os.libs.length; i++) {
                        fs.appendFileSync(asm,fs.readFileSync(os.libs_path_solaris+os.libs[i]))
                    }
                } else {
                    for(var i=0; i<os.libs.length; i++) {
                        fs.appendFileSync(asm,fs.readFileSync(os.libs_path_other+os.libs[i]))
                    }
                }*/
            //}      
            //let extern = fs.readFileSync(process.argv[3].slice(0,process.argv[3].search(/\./))+tok.GLOBAL_VAR_EXTENSIONS)
            //fs.writeFileSync(asm,extern)
        }
        if (t[i] == tok.end) {
            fs.appendFileSync(asm,"main();\n/* FIM */")
        }
        
        /* Comentários */
        if (t[i] == tok.comment) {
            fs.appendFileSync(asm,"//")
        }


        if(t[i] == tok.webimport) {
            let path = t[i+1].slice(1,-1)
            if(os.linux) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_linux}/${path}`))
            }
            if(os.darwin) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_darwin}/${path}`))
            }
            if(os.freebsd) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_freebsd}/${path}`))
            }
            if(os.openbsd) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_openbsd}/${path}`))
            }
            if(os.solaris) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_solaris}/${path}`))
            }
            if(os.windows) {
            }

        }
        if (t[i] == tok.extern_import) {
            let extern = fs.readFileSync(t[i+1]+tok.EXTERN_FILE_EXTENSIONS)
            fs.appendFileSync(asm,extern+"\n")
        }
        if (t[i] == tok.require_import) {
            let name = t[i+3]
            let path = t[i+1]

            if(t[i+2] != tok.as_import) {
                throw new Error(`Use: import ${path} ${tok.as_import} ${name}`);
            } else {
                fs.appendFileSync(asm,`import * as ${name} from ${path};\n`)
            }
            
        }


        if (t[i] == tok.assign_new) {
            let name = t[i+1]
            let val = t[i+3]
            if (t[i+2] != tok.assign) {
                throw new Error(`Use ${tok.assign} to variable assignment`);
            } else {
                fs.appendFileSync(asm,`${name} = ${val};\n`)
            }
        }
        if (t[i] == tok.variable) {
            let name = t[i+1].slice(0,t[i+1].search(/:/))
            let tof = t[i+1].slice(t[i+1].search(/:/)+1,t[i+1].length)
            let val = t[i+3]

            if (t[i+2] != tok.assign) {
                throw new Error(`Use ${tok.assign} to variable assignment`);
            } else {
                tof = tof.replace(tok.datatypes[0],tok.datatypes_target[0])
                tof = tof.replace(tok.datatypes[1],tok.datatypes_target[1])
                tof = tof.replace(tok.datatypes[2],tok.datatypes_target[2])
                tof = tof.replace(tok.datatypes[3],tok.datatypes_target[3])
                tof = tof.replace(tok.datatypes[4],tok.datatypes_target[4])

                let isExported
                if (export_locked) {
                    isExported = "export"
                } else {
                    isExported = ""
                }

                val = val.replace(/\.\./,"+") // HERE
                fs.appendFileSync(asm,`${isExported} let ${name}:${tof} = ${val};\n`)
            }
        }

        if(t[i] == tok.function_token) {
            let name = t[i+1].slice(0,t[i+1].search(/\(/))
            let params = t[i+1].slice(t[i+1].search(/\(/),t[i+1].length)
            let tof = t[i+3]

            if(t[i+2] != tok.function_delimiter) {
                throw new Error(`Use ${tok.function_delimiter} to split function name and function type.`);
            } else {
                params = params.replace(tok.datatypes[0],tok.datatypes_target[0])
                params = params.replace(tok.datatypes[1],tok.datatypes_target[1])
                params = params.replace(tok.datatypes[2],tok.datatypes_target[2])
                params = params.replace(tok.datatypes[3],tok.datatypes_target[3])
                params = params.replace(tok.datatypes[4],tok.datatypes_target[4])
 
                tof = tof.replace(tok.datatypes[0],tok.datatypes_target[0])
                tof = tof.replace(tok.datatypes[1],tok.datatypes_target[1])
                tof = tof.replace(tok.datatypes[2],tok.datatypes_target[2])
                tof = tof.replace(tok.datatypes[3],tok.datatypes_target[3])
                tof = tof.replace(tok.datatypes[4],tok.datatypes_target[4])
                
                let isExported
                if (export_locked) {
                    isExported = "export"
                } else {
                    isExported = ""
                }
                fs.appendFileSync(asm,`${isExported} function ${name}${params}: ${tof}\n`)
            }
        }

        // HERE
        if(t[i] == tok.return_tok) {
            fs.appendFileSync(asm,`return ${t[i+1]};\n`)
        }

        if(t[i] == tok.function_call) {
            let name = t[i+1].slice(0,t[i+1].search(/\(/))
            let params = t[i+1].slice(t[i+1].search(/\(/),t[i+1].length)
            let tof = t[i+3]

            if(t[i+2] != tok.function_call_symbol) {
                throw new Error(`Use ${tok.function_delimiter} to get function return.`);
            } else { 
                if(tof == tok.datatypes[4]) {
                    fs.appendFileSync(asm,`${name}${params}\n`)
                } else {
                    fs.appendFileSync(asm,`let ${tof} = ${name}${params}\n`)
                }
                
            }
        }

        if (t[i] == tok.std_out) {
            let val = t[i+1]
            val = val.replace(/\.\./,"+") // HERE
            fs.appendFileSync(asm,`process.stdout(${val});\n`)
        }
        if (t[i] == tok.std_outln) {
            let val = t[i+1]
            val = val.replace(/\.\./,"+") // HERE
            fs.appendFileSync(asm,`console.log(${val});\n`)
        }

        if (t[i] == tok.if_block) {
            let first = t[i+1]
            let operator = t[i+2]
            let second = t[i+3]
            fs.appendFileSync(asm,`if(${first} ${operator} ${second})`)
        }
        if (t[i] == tok.elsif_block) {
            let first = t[i+1]
            let operator = t[i+2]
            let second = t[i+3]
            fs.appendFileSync(asm,`} else if(${first} ${operator} ${second})`)
        }
        if (t[i] == tok.else_block) {
            fs.appendFileSync(asm,`} else {\n`)
        }
        

        if (t[i] == tok.while_tok) {
            let first = t[i+1]
            let operator = t[i+2]
            let second = t[i+3]
            fs.appendFileSync(asm,`while(${first} ${operator} ${second})`)
        }
        if(t[i] == tok.break_tok) {
            fs.appendFileSync(asm,`break;\n`)
        }
        if (t[i] == tok.for_tok) {
            let iterator = t[i+1]
            let min = t[i+3].slice(0,t[i+3].search(/\./))
            let max = t[i+3].slice(t[i+3].search(/\./)+2,t[i+3].length)

            if(t[i+2] != tok.in_tok) {
                throw new Error(`Use: for ${iterator} ${tok.in_tok} ${min}..${max} do`);
            } else {
                fs.appendFileSync(asm,`for(var ${iterator}=${min};${iterator}<${max};${iterator}++)`)
            }
            
        }

        if(t[i] == tok.function_then) {
            fs.appendFileSync(asm,"{\n")
        }
        if(t[i] == tok.end_block) {
            fs.appendFileSync(asm,"}\n")
        }
    }
}
function deleteObjectCache() {
    let extern_cache = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.EXTERN_FILE_EXTENSIONS;
    fs.unlinkSync(extern_cache)

    let k_cache = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.OBJECT_FILE;
    fs.unlinkSync(k_cache)
}
function asmLinkFunction() { //HERE
    let module_file = fs.readFileSync(asm)
    let segment_file = fs.readFileSync(segment)
    //fs.writeFileSync(linked_file,segment_file)
    fs.appendFileSync(linked_file,module_file)
    deleteObjectCache()
}
function TypeScriptBuildFunction() {
    let tsfile = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.OUTPUT_FILE_EXTENSIONS; //HERE
    exec(`npx tsc ${tsfile}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        if(fs.existsSync(linked_file)) {
            fs.unlinkSync(linked_file)
        }
    });
    
}



if(procmode == "-c") {
    let infile = inputfile.slice(0,inputfile.indexOf("."))+tok.GLOBAL_VAR_EXTENSIONS
    let out_filef = inputfile.slice(0,inputfile.indexOf("."))+tok.EXTERN_FILE_EXTENSIONS
    ext.load_global(infile,out_filef);
    asmCompileFunction();
    asmLinkFunction();
    TypeScriptBuildFunction();
    
} else if(procmode == "-version") {
    console.log(`\nCurrent X version: v${version}\n`)

} else {
    console.log("\n--- X Programming Language Compiler Syntax ---")
    console.log("Unix:  ./xcc -c <source>")
    console.log("Windows: xcc -c <source>")
    console.log("Example: xcc -c Main.m\n")

    console.log("Unix:  ./xcc -version")
    console.log("Windows: xcc -version\n") 
} 
