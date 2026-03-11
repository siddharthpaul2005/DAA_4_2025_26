

class Solution {
  public:
    vector<int> maxOfSubarrays(vector<int>& arr, int k) {
        // code here
        int n=arr.size();
        vector<int> result;
        for( int i=0;i<=n-k;i++)
        {
            int maxval=arr[i];
            for( int j=i;j<i+k;j++)
            {
                maxval=max( maxval,arr[j]);
            }
            result.push_back(maxval);
        }
        return result;
    }
};

