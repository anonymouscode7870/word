#include <iostream>
using namespace std;

class Animal {
public:
    virtual void sound() {   // virtual function
        cout << "Animal makes a sound" << endl;
    }
};

class Dog : public Animal {
public:
    void sound()  {
        cout << "Dog barks" << endl;
    }
};

class Cat : public Animal {
public:
    void sound()  {
        cout << "Cat meows" << endl;
    }
};

int main() {
    Animal* a;
    a = new Dog();
    a->sound();   // "Dog barks" (decided at runtime)

    a = new Cat();
    a->sound();   // "Cat meows" (decided at runtime)
    return 0;
}

