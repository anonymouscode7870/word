"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// function
function abcd(name, age, cb) {
    cb();
}
abcd("sdf", 23, function () {
    console.log("callback");
});
// ..............................................................
function pqrs(name, age, cb) {
    cb("jhbjh");
}
pqrs("sdf", 23, (arg) => {
    console.log(arg);
});
// ...................................................................
// for optional parameter
// use  ? example  
// (gender?: string)
// function with rest parameter
function rst(name, num) {
    console.log(name);
    console.log(num);
}
rst("sdf", [1, 2, 3]);
function add(a, b) {
    if (typeof a === "number" && typeof b === "number") {
        return a + b;
    }
    else if (typeof a === "string") {
        return a;
    }
}
console.log(add(3, 4));
console.log(add("hello"));
//# sourceMappingURL=app.js.map