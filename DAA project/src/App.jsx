import React, { useState, useEffect, useRef } from 'react';

const INITIAL_ITEMS = [
  { id: 1, name: 'Quantum Processor', weight: 2, value: 5000 },
  { id: 2, name: 'Plasma Cutter', weight: 15, value: 3500 },
  { id: 3, name: 'Lithium Cells', weight: 5, value: 1200 },
  { id: 4, name: 'Sensor Array', weight: 8, value: 2000 },
  { id: 5, name: 'Titanium Plating', weight: 20, value: 4000 },
  { id: 6, name: 'Nano-Repair Kit', weight: 3, value: 800 },
  { id: 7, name: 'Holo-Projector', weight: 6, value: 1500 },
  { id: 8, name: 'Flux Capacitor', weight: 10, value: 3000 },
];

function App() {
  const [capacity, setCapacity] = useState(30);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [mode, setMode] = useState('0/1'); // '0/1' or 'fractional'
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Results state
  const [selectedItems, setSelectedItems] = useState([]); // Array of item IDs or {id, fraction}
  const [dpTable, setDpTable] = useState([]); // 2D array
  const [calculatingCell, setCalculatingCell] = useState(null); // {r, c}
  const [tracebackCells, setTracebackCells] = useState([]); // array of {r, c}
  const [totalValue, setTotalValue] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  // Status mapping: 'candidate' (default), 'selected', 'rejected'
  const getItemStatus = (id) => {
    if (isOptimizing) return 'candidate'; // While calculating, everything is candidate unless marked
    const sel = selectedItems.find(s => s.id === id);
    if (sel) return 'selected';
    if (selectedItems.length > 0) return 'rejected'; // If optimization is done and not selected
    return 'candidate';
  };
  
  const getItemFraction = (id) => {
    const sel = selectedItems.find(s => s.id === id);
    return sel ? sel.fraction : 0;
  };

  const runDP = async () => {
    setIsOptimizing(true);
    setSelectedItems([]);
    setDpTable([]);
    setTracebackCells([]);
    setTotalValue(0);
    setTotalWeight(0);

    const n = items.length;
    const W = capacity;
    
    // Initialize DP table
    let table = Array(n + 1).fill().map(() => Array(W + 1).fill(0));
    setDpTable([...table]);

    // Fill table with animation
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= W; w++) {
        setCalculatingCell({ r: i, c: w });
        
        if (items[i - 1].weight <= w) {
          table[i][w] = Math.max(
            items[i - 1].value + table[i - 1][w - items[i - 1].weight],
            table[i - 1][w]
          );
        } else {
          table[i][w] = table[i - 1][w];
        }
        
        // Update table view occasionally to avoid React batching all updates
        if (w % Math.ceil(W / 10) === 0 || w === W) {
            setDpTable([...table.map(row => [...row])]);
            await new Promise(r => setTimeout(r, 10)); // animation delay
        }
      }
    }
    setCalculatingCell(null);
    setDpTable(table);

    // Traceback
    let res = table[n][W];
    let w = W;
    let selected = [];
    let trace = [];
    
    for (let i = n; i > 0 && res > 0; i--) {
      trace.push({ r: i, c: w });
      setTracebackCells([...trace]);
      await new Promise(r => setTimeout(r, 150));

      if (res === table[i - 1][w]) {
        continue;
      } else {
        selected.push({ id: items[i - 1].id, fraction: 1 });
        res = res - items[i - 1].value;
        w = w - items[i - 1].weight;
      }
    }
    // Add start of trace if needed
    trace.push({ r: 0, c: w });
    setTracebackCells([...trace]);

    setSelectedItems(selected);
    
    // Calculate totals
    const finalVal = selected.reduce((acc, curr) => {
      const item = items.find(i => i.id === curr.id);
      return acc + item.value * curr.fraction;
    }, 0);
    const finalWeight = selected.reduce((acc, curr) => {
      const item = items.find(i => i.id === curr.id);
      return acc + item.weight * curr.fraction;
    }, 0);
    
    setTotalValue(finalVal);
    setTotalWeight(finalWeight);
    setIsOptimizing(false);
  };

  const runFractional = async () => {
    setIsOptimizing(true);
    setSelectedItems([]);
    setDpTable([]);
    setTracebackCells([]);
    
    // Sort items by value/weight ratio
    let sortedItems = [...items].map(item => ({
      ...item,
      ratio: item.value / item.weight
    })).sort((a, b) => b.ratio - a.ratio);

    let currentWeight = 0;
    let currentValue = 0;
    let selected = [];

    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      
      // Artificial delay for animation effect
      await new Promise(r => setTimeout(r, 300));

      if (currentWeight + item.weight <= capacity) {
        currentWeight += item.weight;
        currentValue += item.value;
        selected.push({ id: item.id, fraction: 1 });
      } else {
        const remain = capacity - currentWeight;
        const fraction = remain / item.weight;
        currentWeight += remain;
        currentValue += item.value * fraction;
        selected.push({ id: item.id, fraction: fraction });
        break; // Knapsack full
      }
      setSelectedItems([...selected]);
      setTotalValue(currentValue);
      setTotalWeight(currentWeight);
    }
    
    setSelectedItems(selected);
    setTotalValue(currentValue);
    setTotalWeight(currentWeight);
    setIsOptimizing(false);
  };

  const handleOptimize = () => {
    if (mode === '0/1') {
      runDP();
    } else {
      runFractional();
    }
  };

  const handleAddItem = () => {
    const newId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const weights = [2, 3, 5, 8, 10, 15, 20];
    const newWeight = weights[Math.floor(Math.random() * weights.length)];
    const newValue = Math.floor(Math.random() * 45 + 5) * 100;
    const names = ["Plasma Rifle", "Exo-Suit", "Energy Shield", "Cybernetic Arm", "AI Core"];
    const newName = names[Math.floor(Math.random() * names.length)] + " mk" + newId;
    
    setItems([...items, { id: newId, name: newName, weight: newWeight, value: newValue }]);
  };

  const gaugeFillPct = Math.min(100, (totalWeight / capacity) * 100);
  const gaugeColorClass = gaugeFillPct > 90 ? 'danger' : (gaugeFillPct > 70 ? 'warning' : '');

  return (
    <div className="app-container">
      <header className="header-panel animate-in">
        <div className="header-title">
          <h1>Knapsack Manager</h1>
        </div>
        
        <div className="header-controls">
          <div className="control-group">
            <label>Capacity</label>
            <div className="slider-container">
              <input 
                type="range" 
                min="1" max="100" 
                value={capacity} 
                onChange={(e) => setCapacity(Number(e.target.value))}
                disabled={isOptimizing}
              />
              <span className="capacity-display">{capacity}kg</span>
            </div>
          </div>
          
          <div className="control-group">
            <label>Algorithm</label>
            <div className="mode-toggle">
              <button 
                className={mode === '0/1' ? 'active' : ''} 
                onClick={() => setMode('0/1')}
                disabled={isOptimizing}
              >
                0/1 DP
              </button>
              <button 
                className={mode === 'fractional' ? 'active' : ''} 
                onClick={() => setMode('fractional')}
                disabled={isOptimizing}
              >
                Fractional
              </button>
            </div>
          </div>
          
          <button className="btn-secondary" onClick={handleAddItem} disabled={isOptimizing}>
            + Add Item
          </button>
          
          <button className="btn-primary" onClick={handleOptimize} disabled={isOptimizing}>
            {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="panel animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="panel-header">
            <span>Warehouse</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{items.length} Items</span>
          </div>
          
          <div className="items-grid">
            {items.map(item => {
              const status = getItemStatus(item.id);
              return (
                <div key={item.id} className={`item-card ${status}`}>
                  <div className="item-header">
                    <span className="item-name">{item.name}</span>
                    <span className={`item-status status-${status}`}>{status}</span>
                  </div>
                  <div className="item-stats">
                    <div className="stat-group">
                      <span className="stat-label">Weight</span>
                      <span className="stat-val">{item.weight} kg</span>
                    </div>
                    <div className="stat-group" style={{ alignItems: 'flex-end' }}>
                      <span className="stat-label">Value</span>
                      <span className="stat-val">₹{item.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="panel-header">
            <span>Knapsack</span>
          </div>
          
          <div className="knapsack-stats">
            <div className="k-stat">
              <span className="k-stat-label">Weight Used</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span className={`k-stat-value ${totalWeight > capacity ? 'over' : ''}`}>
                  {totalWeight.toFixed(1)}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>/ {capacity} kg</span>
              </div>
              <div className="capacity-gauge-container">
                <div className={`capacity-gauge-fill ${gaugeColorClass}`} style={{ width: `${gaugeFillPct}%` }}></div>
              </div>
            </div>
            
            <div className="k-stat">
              <span className="k-stat-label">Total Value</span>
              <span className="k-stat-value">₹{totalValue.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="items-grid">
            {selectedItems.length === 0 && !isOptimizing && (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem', gridColumn: '1 / -1', textAlign: 'center' }}>
                Knapsack is empty. Run optimization to fill it.
              </div>
            )}
            
            {selectedItems.map(sel => {
              const item = items.find(i => i.id === sel.id);
              if (!item) return null;
              
              return (
                <div key={item.id} className="item-card selected animate-in">
                  <div className="item-header">
                    <span className="item-name">{item.name}</span>
                    {mode === 'fractional' && sel.fraction < 1 && (
                      <span className="item-status status-candidate">
                        {(sel.fraction * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  
                  {mode === 'fractional' && sel.fraction < 1 && (
                    <div className="fraction-bar">
                      <div className="fraction-fill" style={{ width: `${sel.fraction * 100}%` }}></div>
                    </div>
                  )}
                  
                  <div className="item-stats">
                    <div className="stat-group">
                      <span className="stat-label">Weight</span>
                      <span className="stat-val">{(item.weight * sel.fraction).toFixed(1)} kg</span>
                    </div>
                    <div className="stat-group" style={{ alignItems: 'flex-end' }}>
                      <span className="stat-label">Value</span>
                      <span className="stat-val">₹{(item.value * sel.fraction).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {mode === '0/1' && dpTable.length > 0 && (
          <div className="dp-panel animate-in" style={{ animationDelay: '0.3s' }}>
            <div className="panel-header">
              <span>DP Table Visualization</span>
            </div>
            
            <div className="dp-table-container">
              <table className="dp-table">
                <thead>
                  <tr>
                    <th className="sticky-col">Item / Cap</th>
                    {Array.from({ length: capacity + 1 }).map((_, w) => (
                      <th key={w}>{w}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dpTable.map((row, i) => (
                    <tr key={i}>
                      <td className="sticky-col">
                        {i === 0 ? '0 (None)' : `${i} (${items[i-1].name})`}
                      </td>
                      {row.map((val, w) => {
                        const isCalc = calculatingCell?.r === i && calculatingCell?.c === w;
                        const isTrace = tracebackCells.some(c => c.r === i && c.c === w);
                        const classes = ['dp-cell'];
                        if (isCalc) classes.push('calculating');
                        if (isTrace) classes.push('traceback');
                        if (val > 0) classes.push('filled');
                        
                        return (
                          <td key={w} className={classes.join(' ')}>
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="complexity-info">
              <div>Time Complexity: <span>O(n × W)</span></div>
              <div>Space Complexity: <span>O(n × W)</span></div>
            </div>
          </div>
        )}

        {mode === 'fractional' && (
           <div className="dp-panel animate-in" style={{ animationDelay: '0.3s' }}>
              <div className="panel-header">
                <span>Greedy Approach (Fractional Knapsack)</span>
              </div>
              <div style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <p>The fractional knapsack problem allows taking parts of an item. The greedy approach calculates the value-to-weight ratio for each item and sorts them in descending order.</p>
                <p style={{ marginTop: '1rem' }}>It then picks the items with the highest ratio first until the knapsack is full. If the next item doesn't fully fit, it takes the maximum possible fraction of it.</p>
              </div>
              <div className="complexity-info">
                <div>Time Complexity: <span>O(n log n)</span> (due to sorting)</div>
                <div>Space Complexity: <span>O(1)</span> or <span>O(n)</span> for sorting depending on algorithm</div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

export default App;
