#include <bits/stdc++.h>
using namespace std;
vector<int> parent, rankArr;
int findParent(int node) {
    if (parent[node] == node)
        return node;
    return parent[node] = findParent(parent[node]);
}
void unionSet(int u, int v) {
    int pu = findParent(u);
    int pv = findParent(v);

    if (pu == pv) return;

    if (rankArr[pu] < rankArr[pv]) {
        parent[pu] = pv;
    } else if (rankArr[pv] < rankArr[pu]) {
        parent[pv] = pu;
    } else {
        parent[pv] = pu;
        rankArr[pu]++;
    }
}
int spanningTree(int V, vector<vector<int>>& edges) {

    sort(edges.begin(), edges.end(),
         [](vector<int>& a, vector<int>& b) {
             return a[2] < b[2];
         });

    parent.resize(V);
    rankArr.resize(V, 0);

   
    for (int i = 0; i < V; i++)
        parent[i] = i;

    int minCost = 0;
    int edgesUsed = 0;

    for (auto &e : edges) {
        int u = e[0];
        int v = e[1];
        int w = e[2];

        int pu = findParent(u);
        int pv = findParent(v);

       
        if (pu != pv) {
            minCost += w;
            unionSet(pu, pv);
            edgesUsed++;

           
            if (edgesUsed == V - 1)
                break;
        }
    }

    return minCost;
}


int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int V, E;
    cin >> V >> E;

    vector<vector<int>> edges;
    edges.reserve(E);

    for (int i = 0; i < E; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        edges.push_back({u, v, w});
    }

    cout << spanningTree(V, edges) << "\n";

    return 0;
}