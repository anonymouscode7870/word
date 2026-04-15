#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

int main() {
    string line;
    getline(cin, line); // Grabs "1 2 3 4 5 6"

    stringstream ss(line);
    int temp;
    vector<int> nums;

    while (ss >> temp) { // Extract integers until the string ends
        nums.push_back(temp);
    }

    for(int i =0;i<nums.size();i++){
        cout<<nums[i]<<" ";
    }

    // nums now contains {1, 2, 3, 4, 5, 6}
    return 0;
}