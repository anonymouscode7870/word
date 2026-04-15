//input  [[1,2,3],[4,5,6]]
// output 
// 1 2 3 
// 4 5 6

#include <iostream>
#include <vector>
#include <sstream>

using namespace std;

int main() {
    vector<vector<int>> matrix;
    char ch;

    // 1. Read the very first '[' of the entire 2D array
    if (!(cin >> ch) || ch != '[') return 0;

    // 2. Keep looking for the start of a row '['
    while (cin >> ch && ch == '[') {
        vector<int> row;
        int val;

        // 3. Read numbers until we hit the closing ']' of the row
        while (cin >> val) {
            row.push_back(val);
            
            // Check what's next: a comma, a space, or the end of the row ']'
            cin >> ws; // Skip whitespace
            if (cin.peek() == ',' || cin.peek() == ' ') {
                cin >> ch; // Consume the separator
            }
            if (cin.peek() == ']') {
                break;
            }
        }
        
        matrix.push_back(row);
        cin >> ch; // Consume the closing ']' of the row

        // 4. Check if there is a comma between rows or the final ']'
        cin >> ws;
        if (cin.peek() == ',') cin >> ch; 
        if (cin.peek() == ']') break; // End of the 2D array
    }
    
    for(int i =0;i<matrix.size();i++){
        for(int j =0;j<matrix[i].size();j++){
            cout<<matrix[i][j]<<" ";
        }
        cout<<endl;
    }
    return 0;
}