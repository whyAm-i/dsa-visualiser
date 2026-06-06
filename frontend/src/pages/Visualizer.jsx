import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, Minus } from 'lucide-react';

const definitions = {
  array: 'An array is a contiguous block of memory storing elements of the same type. Elements can be accessed efficiently via their index.',
  tuple: 'A tuple is an immutable sequence of elements. While typically immutable, for demonstration we allow recreating it with new elements.',
  linkedlist: 'A linked list is a linear collection of data elements where each element points to the next, allowing efficient insertions.',
  heap: 'A heap is a specialized tree-based data structure satisfying the heap property (max-heap here, where parent is greater than children).',
  stack: 'A stack is a linear data structure following the Last In, First Out (LIFO) principle. Elements are pushed and popped from the top.',
  queue: 'A queue is a linear collection following First In, First Out (FIFO) principles. Elements are added at the rear and removed from the front.'
};

const actionNames = {
  array: { add: 'Insert', remove: 'Delete' },
  tuple: { add: 'Insert', remove: 'Delete' },
  linkedlist: { add: 'Append Node', remove: 'Remove Tail' },
  heap: { add: 'Insert', remove: 'Extract Max' },
  stack: { add: 'Push', remove: 'Pop' },
  queue: { add: 'Enqueue', remove: 'Dequeue' }
};

const Visualizer = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [pyCommands, setPyCommands] = useState([]);

  const getInitCommand = (type) => {
    switch (type) {
      case 'array': return 'arr = [10, 25, 30, 45, 50]';
      case 'tuple': return 't = (5, 15, 25, 35, 45)';
      case 'linkedlist': return 'class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\n# initialized linked list...';
      case 'heap': return 'import heapq\nheap = [100, 50, 40, 30, 20, 10, 5]\nheapq.heapify(heap)';
      case 'stack': return 'stack = [10, 20, 30, 40, 50]';
      case 'queue': return 'from collections import deque\nq = deque([10, 20, 30, 40, 50])';
      default: return '# initialized';
    }
  };

  const getAddCommand = (type, val) => {
    switch (type) {
      case 'array': return `arr.append(${val})`;
      case 'tuple': return `# Tuple is immutable (Cannot add ${val})`;
      case 'linkedlist': return `new_node = Node(${val})\ntail.next = new_node\ntail = new_node`;
      case 'heap': return `heapq.heappush(heap, ${val}) # (Using negative values for max-heap in python)`;
      case 'stack': return `stack.append(${val})`;
      case 'queue': return `q.append(${val})`;
      default: return '';
    }
  };

  const getRemoveCommand = (type) => {
    switch (type) {
      case 'array': return 'arr.pop()';
      case 'tuple': return '# Tuple is immutable';
      case 'linkedlist': return '# traverse to second-to-last node\ntemp = tail\ntail = prev\ntail.next = None\ndel temp';
      case 'heap': return 'heapq.heappop(heap) # Extracts Max';
      case 'stack': return 'stack.pop()';
      case 'queue': return 'q.popleft()';
      default: return '';
    }
  };

  const handleRemove = async () => {
    if (!data || data.length === 0) return;
    setRemoving(true);
    
    // Simulate slight delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newData = [...data];
    if (type === 'queue') {
      newData.shift();
    } else if (type === 'linkedlist') {
      newData.pop();
      if (newData.length > 0) {
        newData[newData.length - 1] = { ...newData[newData.length - 1], next: null };
      }
    } else if (type === 'heap') {
      if (newData.length === 1) {
        newData.pop();
      } else {
        newData[0] = newData.pop();
        let i = 0;
        while (true) {
          const left = 2 * i + 1;
          const right = 2 * i + 2;
          let largest = i;
          if (left < newData.length && newData[left] > newData[largest]) largest = left;
          if (right < newData.length && newData[right] > newData[largest]) largest = right;
          if (largest === i) break;
          const temp = newData[i];
          newData[i] = newData[largest];
          newData[largest] = temp;
          i = largest;
        }
      }
    } else {
      // array, tuple, stack
      newData.pop();
    }
    
    setData(newData);
    setPyCommands(prev => [...prev, getRemoveCommand(type)]);
    setRemoving(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!inputValue || isNaN(inputValue)) return;
    
    setAdding(true);
    const val = parseInt(inputValue, 10);
    
    // Simulate slight delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newData = data ? [...data] : [];
    
    if (type === 'linkedlist') {
      const newId = newData.length;
      if (newData.length > 0) {
        newData[newData.length - 1] = { ...newData[newData.length - 1], next: newId };
      }
      newData.push({ id: newId, value: val, next: null });
    } else if (type === 'heap') {
      newData.push(val);
      let i = newData.length - 1;
      while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        if (newData[i] > newData[parent]) {
          const temp = newData[i];
          newData[i] = newData[parent];
          newData[parent] = temp;
          i = parent;
        } else {
          break;
        }
      }
    } else {
      newData.push(val);
    }
    
    setData(newData);
    setPyCommands(prev => [...prev, getAddCommand(type, val)]);
    setInputValue('');
    setAdding(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data structure');
        }
        const result = await response.json();
        setData(result.data);
        setPyCommands([getInitCommand(type)]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const renderArrayOrTuple = (items, isTuple = false) => (
    <div className="flex flex-wrap justify-center gap-2 items-center">
      {isTuple && <div className="text-4xl text-slate-500 font-light">(</div>}
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center group">
          <div className="text-xs text-slate-500 mb-2">{idx}</div>
          <div className={`w-16 h-16 flex items-center justify-center text-xl font-bold rounded-lg shadow-lg transition-transform duration-300 hover:scale-110
            ${isTuple ? 'bg-indigo-900/50 border-2 border-indigo-500/50 text-indigo-200' : 'bg-blue-900/50 border-2 border-blue-500/50 text-blue-200'}
          `}>
            {item}
          </div>
        </div>
      ))}
      {isTuple && <div className="text-4xl text-slate-500 font-light">)</div>}
    </div>
  );

  const renderLinkedList = (items) => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      {items.map((node, idx) => (
        <React.Fragment key={node.id}>
          <div className="flex flex-col items-center">
            <div className="glass-panel p-4 rounded-xl flex items-center gap-0 overflow-hidden shadow-2xl border-emerald-500/30">
              <div className="w-16 h-16 flex items-center justify-center text-xl font-bold bg-emerald-900/40 text-emerald-200 border-r border-emerald-500/30">
                {node.value}
              </div>
              <div className="w-12 h-16 flex items-center justify-center text-xs text-emerald-500/70 bg-emerald-900/20">
                {node.next !== null ? 'ref' : 'null'}
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Node {node.id}</div>
          </div>
          {node.next !== null && (
            <div className="text-emerald-400">
              <svg className="w-12 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStack = (items) => (
    <div className="flex flex-col justify-end items-center h-full min-h-[400px]">
      <div className="w-48 glass-panel border-t-0 rounded-b-xl border-x-4 border-b-4 border-rose-500/50 p-4 pb-2 flex flex-col-reverse gap-2 relative">
        {items.map((item, idx) => (
          <div key={idx} className="w-full h-14 bg-rose-900/50 border border-rose-500/50 rounded-lg flex items-center justify-center text-xl font-bold text-rose-200 shadow-md transform hover:scale-105 transition-transform">
            {item}
          </div>
        ))}
        <div className="absolute -left-24 bottom-6 text-slate-400 text-sm font-mono flex items-center">
          Top <ArrowLeft className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  );

  const renderQueue = (items) => (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between w-full mb-8 text-sm font-mono text-slate-400">
        <div className="flex flex-col items-center">
          <span>Front (Dequeue)</span>
          <ArrowLeft className="w-4 h-4 mt-1 rotate-90 md:rotate-0 md:-ml-8" />
        </div>
        <div className="flex flex-col items-center">
          <span>Rear (Enqueue)</span>
          <ArrowLeft className="w-4 h-4 mt-1 -rotate-90 md:rotate-180 md:-mr-8" />
        </div>
      </div>
      <div className="glass-panel w-full flex overflow-x-auto p-4 gap-2 border-y-4 border-x-0 rounded-none border-amber-500/50">
        {items.map((item, idx) => (
          <div key={idx} className="min-w-[80px] h-20 bg-amber-900/50 border border-amber-500/50 rounded-lg flex items-center justify-center text-xl font-bold text-amber-200 shadow-md shrink-0 transform hover:scale-105 transition-transform">
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeap = (items) => {
    const levels = [];
    let i = 0;
    let levelSize = 1;
    while (i < items.length) {
      levels.push(items.slice(i, i + levelSize));
      i += levelSize;
      levelSize *= 2;
    }
    
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm text-slate-400 mb-8 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
          Array Representation: [{items.join(', ')}]
        </div>
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
          {levels.map((level, levelIdx) => (
            <div key={levelIdx} className="flex justify-center w-full gap-4 sm:gap-8 md:gap-16">
              {level.map((item, idx) => (
                <div key={idx} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-900/50 border-2 border-purple-500/50 flex items-center justify-center text-lg sm:text-xl font-bold text-purple-200 shadow-lg">
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVisualizer = () => {
    switch (type) {
      case 'array': return renderArrayOrTuple(data, false);
      case 'tuple': return renderArrayOrTuple(data, true);
      case 'linkedlist': return renderLinkedList(data);
      case 'stack': return renderStack(data);
      case 'queue': return renderQueue(data);
      case 'heap': return renderHeap(data);
      default: return <div className="text-white">Visualization not implemented for {type}</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 flex items-start">
          <button 
            onClick={() => navigate('/')}
            className="mr-4 p-2 mt-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white capitalize">{type}</h1>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">{definitions[type]}</p>
          </div>
        </div>
      </div>

      {/* Input section */}
      <div className="mb-6 glass-panel rounded-xl p-4 md:p-6 w-full flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700/50">
         <div className="text-white font-medium">Interact with the structure</div>
         <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
           <form onSubmit={handleAdd} className="flex items-center gap-3 w-full sm:w-auto">
              <input 
                type="number" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter an integer..."
                className="bg-slate-800/80 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 w-full sm:w-48 transition-all"
                disabled={adding || removing}
              />
              <button 
                type="submit" 
                disabled={adding || removing || !inputValue}
                className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{actionNames[type]?.add || 'Add'}</span>
              </button>
           </form>
           
           <div className="hidden sm:block w-px h-8 bg-slate-700"></div>

           <button 
             onClick={handleRemove}
             disabled={adding || removing || !data || data.length === 0}
             className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
           >
             {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
             <span>{actionNames[type]?.remove || 'Remove'}</span>
           </button>
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        <div className="flex-[2] glass-panel rounded-2xl p-8 flex items-center justify-center min-h-[500px] relative overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 z-0"></div>
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center text-primary">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <span className="font-mono text-sm tracking-wider">LOADING DATA FROM BACKEND...</span>
              </div>
            ) : error ? (
              <div className="text-red-400 bg-red-900/20 px-6 py-4 rounded-xl border border-red-500/20 flex flex-col items-center">
                <div className="text-xl font-bold mb-2">Error</div>
                <div>{error}</div>
              </div>
            ) : data ? (
              renderVisualizer()
            ) : null}
          </div>
        </div>

        <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col min-h-[500px] lg:h-auto overflow-hidden">
          <div className="text-white font-medium mb-4 flex items-center justify-between border-b border-slate-700/50 pb-2">
            <span>Python Implementation</span>
            <span className="text-xs text-slate-400 font-mono">Live code tracking</span>
          </div>
          <div className="flex-1 bg-slate-900/80 rounded-xl p-4 font-mono text-sm text-green-400 overflow-y-auto whitespace-pre-wrap border border-slate-700/50 shadow-inner flex flex-col">
            {pyCommands.map((cmd, i) => (
              <div key={i} className="mb-3 border-l-2 border-slate-600 pl-3 opacity-90 animate-fade-in-up">
                {cmd}
              </div>
            ))}
            {/* Auto scroll helper anchor could go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
