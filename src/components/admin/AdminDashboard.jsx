import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, LogOut } from 'lucide-react';
import { ProjectForm, ProjectListItem, emptyProjectForm } from './ProjectComponents';
import { BlogForm, BlogListItem, emptyBlogForm } from './BlogComponents';

const AdminDashboard = ({ onLogout }) => {
    const {
        projects,
        blogs,
        addProject,
        updateProject,
        deleteProject,
        addBlog,
        updateBlog,
        deleteBlog
    } = useData();

    const [activeTab, setActiveTab] = useState('projects');
    const [editingProject, setEditingProject] = useState(null);
    const [editingBlog, setEditingBlog] = useState(null);
    const [showAddProject, setShowAddProject] = useState(false);
    const [showAddBlog, setShowAddBlog] = useState(false);
    const [projectForm, setProjectForm] = useState(emptyProjectForm);
    const [blogForm, setBlogForm] = useState(emptyBlogForm);

    // Project handlers
    const handleAddProject = () => {
        const techArray = projectForm.tech.split(',').map(t => t.trim()).filter(Boolean);
        addProject({ ...projectForm, tech: techArray });
        setProjectForm(emptyProjectForm);
        setShowAddProject(false);
    };

    const handleUpdateProject = () => {
        const techArray = projectForm.tech.split(',').map(t => t.trim()).filter(Boolean);
        updateProject(editingProject, { ...projectForm, tech: techArray });
        setEditingProject(null);
        setProjectForm(emptyProjectForm);
    };

    const handleDeleteProject = (id) => {
        if (window.confirm('Delete this project?')) {
            deleteProject(id);
        }
    };

    const startEditProject = (project) => {
        setEditingProject(project.id);
        setShowAddProject(false);
        setProjectForm({
            title: project.title,
            description: project.description,
            tech: project.tech.join(', '),
            links: project.links || { github: '', blog: '' }
        });
    };

    const cancelEditProject = () => {
        setEditingProject(null);
        setProjectForm(emptyProjectForm);
    };

    // Blog handlers
    const handleAddBlog = () => {
        addBlog(blogForm);
        setBlogForm(emptyBlogForm);
        setShowAddBlog(false);
    };

    const handleUpdateBlog = () => {
        updateBlog(editingBlog, blogForm);
        setEditingBlog(null);
        setBlogForm(emptyBlogForm);
    };

    const handleDeleteBlog = (id) => {
        if (window.confirm('Delete this blog?')) {
            deleteBlog(id);
        }
    };

    const startEditBlog = (blog) => {
        setEditingBlog(blog.id);
        setShowAddBlog(false);
        setBlogForm({
            title: blog.title,
            date: blog.date,
            description: blog.description,
            link: blog.link || ''
        });
    };

    const cancelEditBlog = () => {
        setEditingBlog(null);
        setBlogForm(emptyBlogForm);
    };

    const btnPrimary = "px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-opacity";
    const btnSecondary = "px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors";

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Header */}
            <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
                <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>
                    <div className="flex gap-3">
                        <a href="/" className={btnSecondary}>Back to Site</a>
                        <button onClick={onLogout} className={`flex items-center gap-2 ${btnSecondary} text-red-500`}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    {['projects', 'blogs'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-2xl font-medium transition-all capitalize ${activeTab === tab
                                    ? 'bg-[var(--color-accent)] text-white'
                                    : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]'
                                }`}
                        >
                            {tab} ({tab === 'projects' ? projects.length : blogs.length})
                        </button>
                    ))}
                </div>

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[var(--color-text)]">Manage Projects</h2>
                            <button
                                onClick={() => { setShowAddProject(!showAddProject); setEditingProject(null); setProjectForm(emptyProjectForm); }}
                                className={`flex items-center gap-2 ${btnPrimary}`}
                            >
                                <Plus size={20} /> Add Project
                            </button>
                        </div>

                        {showAddProject && (
                            <ProjectForm
                                form={projectForm}
                                setForm={setProjectForm}
                                onSubmit={handleAddProject}
                                onCancel={() => { setShowAddProject(false); setProjectForm(emptyProjectForm); }}
                            />
                        )}

                        <div className="space-y-4">
                            {projects.map((project) => (
                                editingProject === project.id ? (
                                    <ProjectForm
                                        key={project.id}
                                        form={projectForm}
                                        setForm={setProjectForm}
                                        onSubmit={handleUpdateProject}
                                        onCancel={cancelEditProject}
                                        isEditing
                                    />
                                ) : (
                                    <ProjectListItem
                                        key={project.id}
                                        project={project}
                                        onEdit={startEditProject}
                                        onDelete={handleDeleteProject}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}

                {/* Blogs Tab */}
                {activeTab === 'blogs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[var(--color-text)]">Manage Blogs</h2>
                            <button
                                onClick={() => { setShowAddBlog(!showAddBlog); setEditingBlog(null); setBlogForm(emptyBlogForm); }}
                                className={`flex items-center gap-2 ${btnPrimary}`}
                            >
                                <Plus size={20} /> Add Blog
                            </button>
                        </div>

                        {showAddBlog && (
                            <BlogForm
                                form={blogForm}
                                setForm={setBlogForm}
                                onSubmit={handleAddBlog}
                                onCancel={() => { setShowAddBlog(false); setBlogForm(emptyBlogForm); }}
                            />
                        )}

                        <div className="space-y-4">
                            {blogs.map((blog) => (
                                editingBlog === blog.id ? (
                                    <BlogForm
                                        key={blog.id}
                                        form={blogForm}
                                        setForm={setBlogForm}
                                        onSubmit={handleUpdateBlog}
                                        onCancel={cancelEditBlog}
                                        isEditing
                                    />
                                ) : (
                                    <BlogListItem
                                        key={blog.id}
                                        blog={blog}
                                        onEdit={startEditBlog}
                                        onDelete={handleDeleteBlog}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
