package ArrayList;
import java.util.ArrayList;

public class MaxEle {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(8);
        list.add(3);
        list.add(4);
        list.add(6);

        int max = Integer.MIN_VALUE;
        for(int i =0;i<list.size();i++){
            if(max<list.get(i)){
                max = list.get(i);
            }
        }
        System.out.println("Maximum element in the ArrayList is: " + max);


        
        // another way
        int maxi = Integer.MIN_VALUE;
        for(int i =0;i<list.size();i++){
            maxi = Math.max(max, list.get(i));
        }
        System.out.println("Maximum element in the ArrayList is: " + maxi);
        
    }
}
