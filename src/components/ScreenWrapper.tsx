import React, { useMemo } from 'react';
import Api from '../screens/Api';
import Playground from '../screens/Playground';
import Settings from '../screens/Settings';

interface ScreenWrapperProps {
    view: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ view }) => {
    const Component = useMemo(() => {
        switch (view) {
            case 'Api':
                return Api;
            case 'Playground':
                return Playground;
            case 'Settings':
                return Settings;
            default:
                return Api;
        }
    }, [view]);

    return (
        <div className="h-full w-full pr-16">
            <Component />
        </div>
    );
};

export default ScreenWrapper;