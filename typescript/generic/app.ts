function abcd<T>(val:T): void {
    console.log(val);
}

abcd<string>("abcd");


// ..............................................................
function pqrs<T, U>(val1:T, val2:U): void {
    console.log(val1);
    console.log(val2);
}
pqrs<string, number>("pqrs", 23);

//...................................................................
function rst<T>(val:T[]): void {
    console.log(val);
}
rst<string>(["rst", "sdf", "dfg"]);

//...................................................................

