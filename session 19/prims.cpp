/*
Algorithm :
	1.	Choose any vertex s as the starting vertex.
	2.	Mark all vertices as unvisited.
	3.	Use a min-priority queue to store (weight, vertex) pairs.
	4.	Insert (0, s) into the priority queue.
	5.	While the priority queue is not empty: 
		•	Extract the vertex with minimum weight.
		•	If the vertex is already visited, ignore it.
		•	Otherwise:
			•	Mark the vertex as visited.
			•	Add the weight to the MST cost.
			•	Insert all edges from this vertex to unvisited vertices into the priority queue.
	6.	When all vertices are visited, the MST is complete.
*/  

#include <bits/stdc++.h>
using namespace std;

int spanningTree(int V, vector<vector<int>>& edges) {

    int E = edges.size();
    
    vector<vector<pair<int,int>>> adj(V);

    for (int i = 0; i < E; i++) {
        int u, v, w;
        u = edges[i][0];
        v = edges[i][1];
        w = edges[i][2];
        adj[u].push_back({w, v});
        adj[v].push_back({w, u});
    }

    vector<bool> visited(V, false);

    priority_queue<
        pair<int,int>,
        vector<pair<int,int>>,
        greater<pair<int,int>>
    > pq;   // (weight, vertex)

    pq.push({0, 0});   // start from vertex 0
    
    int minCost = 0;
    
    while (!pq.empty()) {

        int wi = pq.top().first;
        int ui = pq.top().second;
        pq.pop();

        // IMPORTANT FIX: skip if already visited
        if (visited[ui]) continue;

        visited[ui] = true;
        minCost += wi;

        // Visit neighbors
        for (auto pr : adj[ui]) {
            int vi = pr.second;
            int currW = pr.first;

            if (!visited[vi]) {
                pq.push({currW, vi});
            }
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