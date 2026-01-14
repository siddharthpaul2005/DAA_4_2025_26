//Name - Siddharth Paul
//UID - 24BCS10382
//EXPERIMENT 1 

#include <bits/stdc++.h>
using namespace std;

using namespace std::chrono;

void complexRec(int n,int depth, int &count, int &maximumdepth) {
    maximumdepth=max(maximumdepth,depth);

   if (n <= 2) {
       return;
   }


   int p = n;
   while (p > 0) {
       vector<int> temp(n);
       for (int i = 0; i < n; i++) {
           temp[i] = i ^ p;
           count++;
       }
       p >>= 1;

   }


   vector<int> small(n);
   for (int i = 0; i < n; i++) {
       small[i] = i * i;
        count++;
   }


   if (n % 3 == 0) {
       reverse(small.begin(), small.end());
       count+=n;
   } else {
       reverse(small.begin(), small.end());
       count+=n;
   }


   complexRec(n / 2,depth+1,count,maximumdepth);
   complexRec(n / 2,depth+1,count,maximumdepth);
   complexRec(n / 2,depth+1,count,maximumdepth);
}

int main()
{
    int n;
    cin>>n;
    int count=0;
    int maximumdepth=0;
    


    auto start = high_resolution_clock::now();
    complexRec( n, 1, count, maximumdepth ) ;
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start);

    cout << "Operations = " << count << endl;
    cout << "Recursion Depth = " << maximumdepth << endl;
    cout << "Time  = " << duration.count() << endl;


}

/*
tHE Recurrence relation for this is :
3T(n-2) + n( log n )
Derivation:
3T(n/2)+n+n + n log n
3T(n/2) + n(2+ log n)
we ignore the constants 

time complexity using masters methord ( case 1 )
O(n^log(base2)3)

a = 3, b = 2, k = 1, p = 1


*/