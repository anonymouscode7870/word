package ArrayList;
import java.util.ArrayList;

public class BasicsOfArrayList {
    public static void main(String[] args) {
        // it is same as vector in cpp
    //  ClassName -> String | Boolean | Character | Byte | Short | Integer | Long | Float | Double
        ArrayList <Integer> list = new ArrayList<>();
        // Here Integer is Class Name and List is Its Object
        ArrayList<String> list2 = new ArrayList<>();
        ArrayList<Boolean> list3 = new ArrayList<>();

        // Operations on ArrayList
        // 1. Adding Elements TC = O(1)
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);
        list.add(5);
        System.out.println();
        System.out.println(list);
        // 2. Get Element TC = O(1)
        System.out.println("Get Element at index 2: ");
        System.out.println(list.get(2));

        // 3. Remove Element TC = O(n)
        System.out.println("Remove Element at index 2: ");
        list.remove(2);
        System.out.println(list);

        // 4. set Element TC = O(n)
        System.out.println("Set Element at index 2: ");
        list.set(2, 10);
        System.out.println(list);

        // 5. contains Element TC = O(n)
        System.out.println("Contains Element 10: ");
        System.out.println(list.contains(10));
         System.out.println(list.contains(-3));

        // 6. size of ArrayList TC = O(1)
        System.out.println("Size of ArrayList: ");
        System.out.println(list.size());

        // 6. Add at index Element TC = O(n)
        System.out.println("Add Element at index 2: ");
        list.add(2, 20);
        System.out.println(list);

        // 7. isEmpty ArrayList TC = O(1)
        System.out.println("Is ArrayList Empty: ");
        System.out.println(list.isEmpty());


         // 8. clear ArrayList TC = O(1)
        // System.out.println("Clear ArrayList: ");
        // list.clear();
        // System.out.println(list);


        // print ArrayList using for each loop
        System.out.println("Print ArrayList using for loop: ");
        for(int i =0;i<list.size();i++){
            System.out.print(list.get(i) + " ");
        }
        System.out.println();



        // reverse ArrayList TC = O(n)
        System.out.println("Reverse ArrayList: ");
        for(int i = list.size() - 1; i>=0;i--){
            System.out.print(list.get(i) + " ");
        }
        System.out.println();
    }
}
