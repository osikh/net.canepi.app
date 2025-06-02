import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import DraggableTree from './DraggableTree';

export type RequestNode = {
  id: string;
  name: string;
  type: 'request' | 'dir';
  children?: RequestNode[];
};

const ApiSidebar: React.FC = () => {
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<RequestNode[]>([
    {
      id: '1',
      name: 'Sample Dir',
      type: 'dir',
      children: [
        { id: '2', name: 'Get Users', type: 'request' },
        {
          id: '3',
          name: 'Nested Dir',
          type: 'dir',
          children: [{ id: '4', name: 'Nested Request', type: 'request' }],
        },
      ],
    },
  ]);

  const filteredRequests = useMemo(() => {
    if (!search.trim()) return requests;

    const filterTree = (nodes: RequestNode[]): RequestNode[] => {
      return nodes
        .map((node) => {
          if (node.type === 'dir' && node.children) {
            const filteredChildren = filterTree(node.children);
            if (
              filteredChildren.length > 0 ||
              node.name.toLowerCase().includes(search.toLowerCase())
            ) {
              return { ...node, children: filteredChildren };
            }
          } else if (node.name.toLowerCase().includes(search.toLowerCase())) {
            return node;
          }
          return null;
        })
        .filter(Boolean) as RequestNode[];
    };

    return filterTree(requests);
  }, [search, requests]);

  const addRequest = () => {
    // TODO: Add request logic
  };

  const addDirectory = () => {
    // TODO: Add directory logic
  };

  const onSelect = (node: RequestNode) => {
    // TODO: Handle main area update
    console.log('Selected:', node);
  };

  const onUpdate = (newTree: RequestNode[]) => {
    setRequests(newTree);
  };

  return (
    <div className="w-72 bg-gray-900 text-white flex flex-col h-full border-r border-gray-700">
      {/* Toolbar */}
      <div className="flex items-center border-b border-gray-700 text-sm">
        <button
          onClick={addRequest}
          className="w-1/2 border border-transparent hover:border-gray-700 hover:rounded-none px-2 py-1 text-sm text-white bg-gray-800"
        >
          + Request
        </button>
        <button
          onClick={addDirectory}
          className="w-1/2 bg-amber-200 text-blue-600 px-2 py-1"
        >
          + Folder
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-gray-700">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search..."
          className="w-full text-sm bg-gray-800 text-white px-2 py-1 outline-none"
        />
      </div>

      {/* Request List */}
      <div className="flex-1 overflow-y-auto p-2">
        <DraggableTree nodes={filteredRequests} onSelect={onSelect} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

export default ApiSidebar;