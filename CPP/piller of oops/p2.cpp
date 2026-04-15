#include<iostream>
using namespace std;

class abd{
    public:
       virtual void shape() = 0;

    
};

class Circle : public abd{
public:
   void shape(){
        cout<<"circle"<<endl;
    }

};

class rec:public abd{
    public:
        void shape(){
            cout<<"rectangle"<<endl;
        }
};
int main(){

    abd *a = new Circle();
    abd *r = new rec();

    a->shape();
    r->shape();


}