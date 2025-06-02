import React from 'react';
import type { RequestNode } from './ApiSidebar';
import TreeItem from './TreeItem';

type Props = {
  nodes: RequestNode[];
  onSelect: (node: RequestNode) => void;
  onUpdate: (newTree: RequestNode) => void;
};

const DraggableTree: React.FC<Props> = ({ nodes, onSelect, onUpdate }) => {
  return (
    <div>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          depth={0}
          onSelect={onSelect}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default DraggableTree;