import { createContext, useContext } from 'react';

import { defaultProjects } from '../data/projectsData';
import { defaultBlogs } from '../data/blogsData';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const value = {
        projects: defaultProjects,
        blogs: defaultBlogs
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
