import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Database, List, Grid, AlignJustify, GitCommitVertical } from 'lucide-react';

const dsLinks = [
  { name: 'Array', path: '/ds/array', icon: Grid, color: 'text-blue-400' },
  { name: 'Tuple', path: '/ds/tuple', icon: List, color: 'text-indigo-400' },
  { name: 'Linked List', path: '/ds/linkedlist', icon: GitCommitVertical, color: 'text-emerald-400' },
  { name: 'Heap', path: '/ds/heap', icon: Database, color: 'text-purple-400' },
  { name: 'Stack', path: '/ds/stack', icon: Layers, color: 'text-rose-400' },
  { name: 'Queue', path: '/ds/queue', icon: AlignJustify, color: 'text-amber-400' }
];

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white group">
              <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                <Database className="w-6 h-6 text-primary-400" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
                DS Analyser
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex space-x-2">
              {dsLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
                      ${isActive 
                        ? 'bg-slate-700/80 text-white shadow-inner' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <Icon className={`w-4 h-4 ${link.color}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
