// function
function abcd(name: string, age: number, cb: Function): void {
    cb();
}

abcd("sdf", 23, function () {
    console.log("callback");
})


// ..............................................................

function pqrs(name: string, age: number, cb: (arg: string) => void): void {
    cb("jhbjh");
}

pqrs("sdf", 23, (arg) => {
    console.log(arg);
})

// ...................................................................

// for optional parameter
// use  ? example  
// (gender?: string)


// function with rest parameter

function rst (name: string, num:number[]){
    console.log(name);
    console.log(num);
}

rst("sdf", [1, 2, 3]);


// function overloading

function add(a: number, b: number): number;
function add(a: string): string;

function add(a: any, b?: any): any {
    if (typeof a === "number" && typeof b === "number") {
        return a + b;   
    } else if (typeof a === "string") {
        return a;
    }
}


console.log(add(3,4));
console.log(add("hello"));