// 1,2,3,4,5
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    string line;
    getline(cin, line);

    // Remove brackets: Find '[' and ']' and replace with space or ignore
    line.erase(remove(line.begin(), line.end(), '['), line.end());
    line.erase(remove(line.begin(), line.end(), ']'), line.end());

    stringstream ss(line);
    string segment;
    vector<int> nums;

    while (getline(ss, segment, ',')) {
        nums.push_back(stoi(segment));
    }

    for(int i =0;i<nums.size();i++){
        cout<<nums[i]<<" ";
    }
}