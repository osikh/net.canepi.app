import React, { useState } from 'react';
import { Icon } from '@iconify/react';

type MenuItem = {
  name: string;
  label?: string;
  iconoutline?: string;
  iconsolid?: string;
};

type Props = {
  onNavigate: (route: string) => void;
};

const Drawer: React.FC<Props> = ({ onNavigate }) => {
  const [hover, setHover] = useState(false);

  const menu: MenuItem[] = [
    { name: 'Api', label: 'API', iconoutline: 'material-symbols-light:electric-bolt-outline-rounded', iconsolid: 'material-symbols-light:electric-bolt-rounded' },
    { name: 'connect', label: 'Connections', iconoutline: 'material-symbols-light:key-outline-rounded', iconsolid: 'material-symbols-light:key-rounded' },
    { name: 'vars', label: 'Variables', iconoutline: 'material-symbols-light:code-blocks-outline-rounded', iconsolid: 'material-symbols-light:code-blocks-rounded' },
    { name: 'divider' },
    { name: 'Playground', label: 'Playground', iconoutline: 'material-symbols-light:account-tree-outline-rounded', iconsolid: 'material-symbols-light:account-tree-rounded' },
    { name: 'divider' },
    { name: 'Settings', label: 'Settings', iconoutline: 'material-symbols-light:settings-outline-rounded', iconsolid: 'material-symbols-light:settings' },
  ];

  const bottomMenu: MenuItem[] = [
    { name: 'auth', label: 'Login', iconoutline: 'material-symbols-light:verified-user-outline-rounded', iconsolid: 'material-symbols-light:verified-user-rounded' },
    { name: 'premium', label: 'Canepi+', iconoutline: 'material-symbols-light:workspace-premium-outline-rounded', iconsolid: 'material-symbols-light:workspace-premium-rounded' },
  ];

  const drawerWidthClass = hover ? 'w-48' : 'w-16';

  return (
    <div
      className={`app-drawer fixed top-0 right-0 h-full transition-all duration-300 bg-gray-900 text-white ${drawerWidthClass}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Top menu */}
      {menu.map((item, idx) =>
        item.name === 'divider' ? (
          <div key={`divider-${idx}`} className="my-2 border-t border-gray-700" />
        ) : (
          <div
            key={item.name}
            onClick={() => onNavigate(item.name)}
            className="flex items-center gap-2 px-4 py-2 text-md cursor-pointer hover:bg-gray-800"
          >
            <Icon icon={item.iconsolid || ''} width="32" height="32" />
            {hover && <span>{item.label}</span>}
          </div>
        )
      )}

      {/* Bottom menu */}
      <div className="absolute bottom-0 w-full">
        {bottomMenu.map((item) => (
          <div
            key={item.name}
            onClick={() => onNavigate(item.name)}
            className="flex items-center gap-2 px-4 py-2 text-md cursor-pointer hover:bg-gray-800"
          >
            <Icon icon={item.iconsolid || ''} width="32" height="32" />
            {hover && <span>{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drawer;