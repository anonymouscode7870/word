// [1 2 3 4 5]
#include <iostream>
#include <vector>

using namespace std;

int main() {
    vector<int> nums;
    char ch;

    // 1. Consume the opening '['
    cin >> ch; 

    // 2. Read integers one by one
    int temp;
    while (cin >> temp) {
        nums.push_back(temp);

        // 3. Peek at the next character to see if it's the closing ']'
        // We skip whitespace automatically with cin >> ws
        cin >> ws; 
        if (cin.peek() == ']') {
            cin >> ch; // Consume the ']'
            break;
            
        }
    }

    for(int i =0;i<nums.size();i++){
        cout<<nums[i]<<" ";
    }


    // Result: nums now contains {1, 2, 3, 4, 5}
    return 0;
}