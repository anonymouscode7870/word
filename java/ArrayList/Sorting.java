package ArrayList;
import java.util.ArrayList;
import java.util.Collections;
// import java.util.*;

public class Sorting {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(8);    
        list.add(3);
        list.add(4);
        list.add(6);
        System.out.println();
        System.out.println("Before Sorting: " + list);
        Collections.sort(list);
        System.out.println("After Sorting: " + list);

        // For Reverse Sorting
        Collections.sort(list, Collections.reverseOrder());
        System.out.println("After Reverse Sorting: " + list);


    }
}
