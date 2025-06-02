import React from 'react';
// import ApiSidebar from '../components/ApiSidebar';
// import ApiBrowserList from "../components/ApiBrowserList.tsx";
import ApiBrowser from "../components/ApiBrowser.tsx";

const Api: React.FC = () => {
  return (
    <div className="flex h-full">
      <ApiBrowser />
      <div className="flex-1 p-4 text-white">
        <h1 className="text-2xl font-bold">Api Screen modded</h1>
      </div>
    </div>
  );
};

export default Api;