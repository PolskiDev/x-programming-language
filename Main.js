"use strict";
exports.__esModule = true;
function say(a, b) {
    var beta = "Hello ";
    var delta = "world";
    var gama = beta + delta;
    return gama;
}
function boiler() {
    console.log("Hello world");
}
function main() {
    var msg = "Hello World";
    console.log(msg);
    var word = say("Joao Marcelo", 145);
    console.log(word);
    var numbers = [0, 1, 4, 5];
    console.log(numbers[2]);
    var numeros = numbers[3];
    for (var i = 1; i < 10; i++) {
        console.log("Contou mais um");
    }
    boiler();
}
main();
/* FIM */ 
