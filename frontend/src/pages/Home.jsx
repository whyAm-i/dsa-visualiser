import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Database, List, Grid, AlignJustify, GitCommitVertical, ArrowRight } from 'lucide-react';

const dsCards = [
  {
    id: 'array',
    name: 'Array',
    description: 'A contiguous block of memory storing elements of the same type.',
    icon: Grid,
    color: 'from-blue-500 to-cyan-400',
    delay: '0ms'
  },
  {
    id: 'tuple',
    name: 'Tuple',
    description: 'An immutable sequence of elements, often of different types.',
    icon: List,
    color: 'from-indigo-500 to-purple-400',
    delay: '100ms'
  },
  {
    id: 'linkedlist',
    name: 'Linked List',
    description: 'A linear collection of data elements whose order is not given by their physical placement.',
    icon: GitCommitVertical,
    color: 'from-emerald-500 to-teal-400',
    delay: '200ms'
  },
  {
    id: 'heap',
    name: 'Heap',
    description: 'A specialized tree-based data structure that satisfies the heap property.',
    icon: Database,
    color: 'from-purple-500 to-pink-400',
    delay: '300ms'
  },
  {
    id: 'stack',
    name: 'Stack',
    description: 'A linear data structure that follows the Last In, First Out (LIFO) principle.',
    icon: Layers,
    color: 'from-rose-500 to-orange-400',
    delay: '400ms'
  },
  {
    id: 'queue',
    name: 'Queue',
    description: 'A linear collection following First In, First Out (FIFO) principles.',
    icon: AlignJustify,
    color: 'from-amber-500 to-yellow-400',
    delay: '500ms'
  }
];

const Home = () => {
  const handleMouseMove = (e) => {
    const cards = document.querySelectorAll('.spotlight-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Visualize <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Data Structures</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Explore and understand core computer science concepts through interactive, beautiful visualizations.
        </p>
      </div>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full spotlight-wrapper"
        onMouseMove={handleMouseMove}
      >
        {dsCards.map((ds) => {
          const Icon = ds.icon;
          return (
            <Link
              key={ds.id}
              to={`/ds/${ds.id}`}
              className="spotlight-card glass-button group p-8 flex flex-col items-start text-left h-full"
              style={{ animationDelay: ds.delay }}
            >
              <div className={`p-4 rounded-xl mb-6 bg-gradient-to-br ${ds.color} bg-opacity-20 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {ds.name}
              </h2>
              <p className="text-slate-400 mb-6 flex-1">
                {ds.description}
              </p>
              <div className="flex items-center text-sm font-semibold text-white/70 group-hover:text-white transition-colors mt-auto">
                <span>Visualize</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;