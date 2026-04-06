package Basics; // folder name

public class Onehello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Welcome to Java programming. :"+ 8); // no comma use + for concatenation
        System.out.println("Welcome to Java programming. :"+ (8+2)); // use parenthesis for correct order of operations
    
        System.out.println("concat :"+ 8+2); // without parenthesis, it will concatenate 8 and 2 as strings, resulting in "Welcome to Java programming. :82"

        System.out.println(8+2);
        System.out.println(" " + 8 + 2); // adding a space before the numbers will treat them as strings and concatenate them, resulting in " 82"
        System.out.println(8+2+" "+8+2);
    }
    
}
