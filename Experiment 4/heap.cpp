#include <bits/stdc++.h>
using namespace std;

#define MAX 100

int heap[MAX];
int heapSize = 0;

void heapifyDown(int i)
{
    int smallest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < heapSize && heap[left] < heap[smallest])
        smallest = left;

    if (right < heapSize && heap[right] < heap[smallest])
        smallest = right;

    if (smallest != i)
    {
        swap(heap[i], heap[smallest]);
        heapifyDown(smallest);
    }
}

void heapifyUp(int i)
{
    while (i > 0 && heap[(i - 1) / 2] > heap[i])
    {
        swap(heap[i], heap[(i - 1) / 2]);
        i = (i - 1) / 2;
    }
}

void insert(int value)
{
    if (heapSize == MAX)
    {
        cout << "Heap Overflow"<<endl;
        return;
    }

    heap[heapSize] = value;
    heapSize++;
    heapifyUp(heapSize - 1);
}


void deleteRoot()
{
    if (heapSize == 0)
    {
        cout << "Heap Underflow"<<endl;
        return;
    }

    heap[0] = heap[heapSize - 1];
    heapSize--;
    heapifyDown(0);
}

int search(int value)
{
    for (int i = 0; i < heapSize; i++)
    {
        if (heap[i] == value)
            return i;
    }
    return -1;
}


void deleteByIndex(int i)
{
    if (i < 0 || i >= heapSize)
    {
        cout << "Invalid index"<<endl;
        return;
    }

    heap[i] = heap[heapSize - 1];
    heapSize--;
    if (i > 0 && heap[i] < heap[(i - 1) / 2])
        heapifyUp(i);
    else
        heapifyDown(i);
}

void printHeap()
{
    for (int i = 0; i < heapSize; i++)
        cout << heap[i] << " ";
    cout << endl;
}

int main()
{
    insert(10);
    insert(20);
    insert(30);
    insert(1);
    insert(5);

    cout << "Heap after insertions:"<<endl;
    printHeap();

    deleteRoot();
    cout << "After deleting root:"<<endl;
    printHeap();

    int idx = search(20);
    cout << "Index of 20: " << idx << endl;

    deleteByIndex(idx);
    cout << "After deleting 20:\n";
    printHeap();

    return 0;
}
