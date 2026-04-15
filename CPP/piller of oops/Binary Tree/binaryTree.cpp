#include<iostream>
#include<queue>
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



Node* createTree()
{
    cout<<"Enter Node"<<endl;
    int val;
    cin>>val;
    Node* root = new Node(val);

    if(val == -1) return NULL;

    // cout<<"Enter left child of "<<val<<endl;
    root->left = createTree();
    // cout<<"Enter right child of "<<val<<endl;
    root->right = createTree();
    return root;
    
}


void preOrderTraversal(Node* root)
{
    // base case
    if(root == NULL) return;

    cout<<root->val<<" ";

    preOrderTraversal(root->left);
    preOrderTraversal(root->right);
    
}

void inOrderTraversal(Node* root)
{
    // base case
    if(root == NULL) return;

    inOrderTraversal(root->left);
    cout<<root->val<<" ";
    inOrderTraversal(root->right);
    
}

void postOrderTraversal(Node* root)
{
    // base case
    if(root == NULL) return;

    postOrderTraversal(root->left);
    postOrderTraversal(root->right);
    cout<<root->val<<" ";
}

void levelOrderTraversalBFS(Node* root){

    queue<Node*> q;
    q.push(root);
    while(!q.empty()){

        Node* frontNode = q.front();
        cout<<frontNode->val<<" ";
        q.pop();

        if(frontNode->left){
            q.push(frontNode->left);
        }
        if(frontNode->right){
            q.push(frontNode->right);
        }

    }
}
        

    void levelOrderTraversalNULLPtr (Node* root){
        queue<Node*> q;
        q.push(root);
        q.push(NULL);

        while(q.size()>1){

            Node* frontNode = q.front();
            
             q.pop();
            if(frontNode == NULL){// it is root for first ele
                cout<<endl;
               
                q.push(NULL);
                
            }else{

                cout<<frontNode->val<<" ";
                if(frontNode->left){
                    q.push(frontNode->left);
                }
                if(frontNode->right){
                    q.push(frontNode->right);
                }

            }
            

    }
    }


int main(){
    
    Node* root = createTree();
    cout<<"Root Node: "<<root->val<<endl;

    preOrderTraversal(root);
    cout<<endl;
    inOrderTraversal(root);
    cout<<endl;
    postOrderTraversal(root);
    cout<<endl;
    levelOrderTraversalBFS(root);

    cout<<endl;
    levelOrderTraversalNULLPtr(root);

}


// output(we can take input in one line also):
// Enter Node
// 10 20 40 -1 -1 -1 30 50 -1 -1 60 -1 -1
// Enter Node
// Enter Node
// Enter Node
// Enter Node
// Enter Node
// Enter Node
// Enter Node
// Enter Node
// Enter Node
// Enter Node
// Enter Node
// Enter Node
// Root Node: 10
// 10 20 40 30 50 60
// 40 20 10 50 30 60
// 40 20 50 60 30 10