import React, {useEffect, useState} from 'react';
import Drawer from './components/Drawer';
import ScreenWrapper from './components/ScreenWrapper';
import {initDatabase} from "./hooks/useApiStore.tsx";

const App: React.FC = () => {
    useEffect(() => {
        initDatabase().then(() => {
            console.log("Database initialized");
        })
    }, [])

    const [view, setView] = useState('Api');

    return (
        <div className="flex h-screen relative">
            <ScreenWrapper view={view} />
            <Drawer onNavigate={setView} />
        </div>
    );
};

export default App;