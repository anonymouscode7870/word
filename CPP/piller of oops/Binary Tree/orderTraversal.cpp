#include<iostream>
using namespace std;

class Node{
    public:
    int val;
    Node* left;
    Node* right;
    Node(int val){
        this->val = val;
        this->left = NULL;
        this->right = NULL;
    }

};

void preOrderTraversal(Node* root)
{
    // base case
    if(root == NULL) return;

    cout<<root->val<<" ";

    preOrderTraversal(root->left);
    preOrderTraversal(root->right);
    
}

int main(){
    
    
    

}