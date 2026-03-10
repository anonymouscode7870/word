const obj1= {
    name: "John",
    age: 30,
    greet: function() {
        console.log("Hello, my name is " + this.name);
    }
}

 const obj2 = Object.create(obj1);

 
 
