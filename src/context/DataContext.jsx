import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
    const [projects, setProjects] = useLocalStorage('portfolio-projects', defaultProjects);
    const [blogs, setBlogs] = useLocalStorage('portfolio-blogs', defaultBlogs);

    // Projects CRUD
    const addProject = (project) => {
        const newProject = { ...project, id: Date.now() };
        setProjects([...projects, newProject]);
        return newProject;
    };

    const updateProject = (id, updatedProject) => {
        setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
    };

    const deleteProject = (id) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    // Blogs CRUD
    const addBlog = (blog) => {
        const newBlog = { ...blog, id: Date.now() };
        setBlogs([...blogs, newBlog]);
        return newBlog;
    };

    const updateBlog = (id, updatedBlog) => {
        setBlogs(blogs.map(b => b.id === id ? { ...b, ...updatedBlog } : b));
    };

    const deleteBlog = (id) => {
        setBlogs(blogs.filter(b => b.id !== id));
    };

    const value = {
        projects,
        blogs,
        addProject,
        updateProject,
        deleteProject,
        addBlog,
        updateBlog,
        deleteBlog
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
