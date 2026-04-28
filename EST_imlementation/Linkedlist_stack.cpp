#include <iostream>
using namespace std;

class Node {
public:
    int data;
    Node* next;

    Node(int val) {
        data = val;
        next = NULL;
    }
};

class Stack {
private:
    Node* top;
    int count;

public:
    Stack() {
        top = NULL;
        count = 0;
    }
    void push(int x) {
        Node* newNode = new Node(x);
        newNode->next = top;
        top = newNode;
        count++;
        cout << x << " pushed";
    }

    void pop() {
        if (isEmpty()) {
            cout << "Stack Underflow";
            return;
        }
        Node* temp = top;
        cout << top->data << " popped";
        top = top->next;
        delete temp;
        count--;
    }

    int peek() {
        if (isEmpty()) {
            cout << "Stack is empty_";
            return -1;
        }
        return top->data;
    }

    bool isEmpty() {
        return top == NULL;
    }

    int size() {
        return count;
    }

  
    void display() {
        Node* temp = top;
        while (temp != NULL) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "";
    }
};


int main() {
    Stack s;

    s.push(10);
    s.push(20);
    s.push(30);

    s.display();

    cout << "Top element: " << s.peek() << endl;

    s.pop();
    s.display();

    cout << "Stack size: " << s.size() << endl;

    return 0;
}