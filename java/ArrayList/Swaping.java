package ArrayList;

import java.util.ArrayList;

public class Swaping {
    public static void swap(ArrayList<Integer> li , int idx1, int idx2){
        int temp = li.get(idx1);
        li.set(idx1, li.get(idx2) );
        li.set(idx2, temp);

    }
    public static void main(String[] args) {
        ArrayList<Integer> list3 = new ArrayList<>();
        list3.add(1);
        list3.add(8);
        list3.add(3);
        list3.add(4);
        list3.add(6);
        System.out.println()   ;
        System.out.println("Before Swapping: " + list3);
        swap(list3, 2, 4);
        System.out.println("After Swapping: " + list3);

    }
    
  


}
