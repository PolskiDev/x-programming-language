import * as fs from 'fs';
import { stdout } from 'process';
import { exec } from 'child_process';
import * as tok from './lex';
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
    linked_file = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.OUTPUT_FILE_EXTENSIONS; //HERE
}



let t:any = [];
let filein:any;
if(procmode == "-c") {
    filein = fs.readFileSync(inputfile,'utf8');
    //t = filein.split(/\s+/);
    //t = filein.match(/\w+|"[^"]+"/g)
    //t = filein.match(/\w+|"[^"]+"|\([^)]*\)|\[[^\]]*\]|(:)|(=)|(\$)|(\+)/g)
    t = filein.match(/[A-Za-z0-9_$+.]+|"[^"]+"|\([^)]*\)|\[[^\]]*\]|(:)|(=)/g)
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
        if (t[i] == tok.require_import) {
            let path = t[i+1]
            let name = t[i+3]

            if(t[i+2] != tok.as_import) {
                console.log(`Use: (import ${path}) to import package ${name}`);
            } else {
                fs.appendFileSync(asm,`import * as ${name} from ${path};\n`)
            }
            
        }


        if (t[i] == tok.assign_new) {
            let name = t[i+1]
            let val = t[i+3]
            fs.appendFileSync(asm,`${name} = ${val};\n`)
        }
        if (t[i] == tok.variable) {
            let name = t[i+1]
            let tof = t[i+3]
            let val = t[i+5]
            let isArray = t[i+6]
            let index = t[i+7]
            val = val.replace(/\.\./,"+") // HERE


            if(t[i+4] != tok.assign) {
                console.log(`\n\nERROR 1000: Use (${tok.assign}) to do variable (${name}) assignment\n\n`);
                
            } else {
                tof = tof.replace(tok.datatypes[0],tok.datatypes_target[0])
                tof = tof.replace(tok.datatypes[1],tok.datatypes_target[1])
                tof = tof.replace(tok.datatypes[2],tok.datatypes_target[2])
                tof = tof.replace(tok.datatypes[3],tok.datatypes_target[3])
                tof = tof.replace(tok.datatypes[4],tok.datatypes_target[4])

                let isExported
                if (export_locked) {
                    isExported = "export "
                } else {
                    isExported = ""
                }

    
                if(isArray == tok.array_position_index) {
                    fs.appendFileSync(asm,`${isExported}let ${name}:${tof} = ${val}[${index}];\n`)
                } else {
                    fs.appendFileSync(asm,`${isExported}let ${name}:${tof} = ${val};\n`)
                }
            }

        }

        if(t[i] == tok.function_token) {
            let name = t[i+1]
            let params = t[i+2]
            let tof = t[i+4]

            if(t[i+3] != tok.function_delimiter) {
                console.log(`\n\nERROR 1001: Use (${tok.function_delimiter}) to split function ${name} and function type.\n\n`);
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
            let name = t[i+1]
            let params = t[i+2]
            let tof = t[i+4]
            let return_name = t[i+5]

            if(t[i+3] != tok.function_call_symbol) {
                console.log(`\n\nERROR 1002: Use (${tok.function_delimiter}) to get function ${name} return.\n\n`);
            } else { 
                if(tof == tok.datatypes[4]) {
                    fs.appendFileSync(asm,`${name}${params}\n`)
                } else {
                    fs.appendFileSync(asm,`let ${return_name}:${tof} = ${name}${params}\n`)
                }
                
            }
        }

        if (t[i] == tok.std_out) {
            let val = t[i+1]

            let isArray = t[i+2]
            let index = t[i+3]

            if(isArray == tok.array_position_index) {
                fs.appendFileSync(asm,`process.stdout(${val}[${index}]);\n`)
            } else {
                fs.appendFileSync(asm,`process.stdout(${val});\n`)
            }
            
        }
        if (t[i] == tok.std_outln) {
            let val = t[i+1]

            let isArray = t[i+2]
            let index = t[i+3]

            if(isArray == tok.array_position_index) {
                fs.appendFileSync(asm,`console.log(${val}[${index}]);\n`)
            } else {
                fs.appendFileSync(asm,`console.log(${val});\n`)
            }
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
                console.log(`\n\nERROR 1003: Use (for ${iterator} ${tok.in_tok} ${min}..${max} do)\n\n`);
            } else {
                fs.appendFileSync(asm,`for(var ${iterator}=${min};${iterator}<${max};${iterator}++)`)
            }
            
        }

        if(t[i] == tok.array) {
            let name = t[i+1]
            let tof = t[i+3]
            let val = t[i+5].slice(1,-1)

            tof = tof.replace(tok.datatypes[0],tok.datatypes_target[0])
            tof = tof.replace(tok.datatypes[1],tok.datatypes_target[1])
            tof = tof.replace(tok.datatypes[2],tok.datatypes_target[2])
            tof = tof.replace(tok.datatypes[3],tok.datatypes_target[3])
            tof = tof.replace(tok.datatypes[4],tok.datatypes_target[4])

            fs.appendFileSync(asm,`let ${name}:${tof}[] = [${val}]\n`)
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
    let k_cache = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.OBJECT_FILE;
    fs.unlinkSync(k_cache)
}
function asmLinkFunction() { //HERE
    let module_file = fs.readFileSync(asm)
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
