#include<iostream>
using namespace std;
class Complex{
    int real;
    int img;

public:
    Complex(int r=0, int i=0){
        real = r;
        img = i;
    }

    Complex operator + (Complex &c){
        Complex temp;
        temp.real = c.real + real;
        temp.img = c.img + img;
        return temp;
        
    }

    void display(){
        cout<<real<<" + "<<img<<"i"<<endl;
    }

};
int main(){
    Complex c1(2,3);
    Complex c2(4,5);
    Complex c3 = c1 + c2; // c1.operator+(c2)
    c3.display();

}