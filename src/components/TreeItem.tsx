import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import type { RequestNode } from './ApiSidebar';

type Props = {
  node: RequestNode;
  depth: number;
  onSelect: (node: RequestNode) => void;
  onUpdate: (updatedNode: RequestNode) => void;
};

const TreeItem: React.FC<Props> = ({ node, depth, onSelect, onUpdate }) => {
  const [open, setOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node);
  };

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const onDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(node));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedData = e.dataTransfer.getData('text/plain');
    if (!droppedData) return;

    const droppedNode = JSON.parse(droppedData) as RequestNode;

    if (node.type === 'dir') {
      const updatedChildren = [...(node.children || []), droppedNode];
      const updatedNode = { ...node, children: updatedChildren };
      onUpdate(updatedNode);
    }
  };

  const paddingLeft = `${depth * 16}px`;

  return (
    <>
      <div
        className={`flex items-center px-2 py-1 rounded cursor-pointer hover:bg-gray-800 ${isDragging ? 'opacity-50' : ''}`}
        style={{ paddingLeft }}
        draggable
        onDragStart={onDragStart}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={handleClick}
      >
        {node.type === 'dir' && (
          <span onClick={toggle}>
            <Icon icon={open ? 'ph:caret-down' : 'ph:caret-right'} className="mr-1" />
          </span>
        )}
        <Icon
          icon={node.type === 'dir' ? 'ph:folder' : 'ph:file-text'}
          className="mr-2"
        />
        <span>{node.name}</span>
      </div>

      {open && node.children && (
        <div className="pl-4">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TreeItem;
