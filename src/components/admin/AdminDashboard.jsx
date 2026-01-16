import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, Save, X, Github } from 'lucide-react';
import HashnodeIcon from '../icons/HashnodeIcon';

const AdminDashboard = () => {
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

    const emptyProjectForm = {
        title: '',
        description: '',
        tech: '',
        links: { github: '', blog: '' }
    };

    const emptyBlogForm = {
        title: '',
        date: '',
        description: '',
        link: ''
    };

    const [projectForm, setProjectForm] = useState(emptyProjectForm);
    const [blogForm, setBlogForm] = useState(emptyBlogForm);

    // Project Operations
    const handleAddProject = () => {
        if (!projectForm.title || !projectForm.description) {
            alert('Please fill in title and description');
            return;
        }
        const techArray = projectForm.tech.split(',').map(t => t.trim()).filter(Boolean);
        addProject({ ...projectForm, tech: techArray });
        setProjectForm(emptyProjectForm);
        setShowAddProject(false);
    };

    const handleUpdateProject = (id) => {
        if (!projectForm.title || !projectForm.description) {
            alert('Please fill in title and description');
            return;
        }
        const techArray = projectForm.tech.split(',').map(t => t.trim()).filter(Boolean);
        updateProject(id, { ...projectForm, tech: techArray });
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
        setProjectForm({
            title: project.title,
            description: project.description,
            tech: project.tech.join(', '),
            links: project.links || { github: '', blog: '' }
        });
    };

    // Blog Operations
    const handleAddBlog = () => {
        if (!blogForm.title || !blogForm.description) {
            alert('Please fill in title and description');
            return;
        }
        addBlog(blogForm);
        setBlogForm(emptyBlogForm);
        setShowAddBlog(false);
    };

    const handleUpdateBlog = (id) => {
        if (!blogForm.title || !blogForm.description) {
            alert('Please fill in title and description');
            return;
        }
        updateBlog(id, blogForm);
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
        setBlogForm({
            title: blog.title,
            date: blog.date,
            description: blog.description,
            link: blog.link || ''
        });
    };

    const inputClass = "w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition-colors";
    const btnPrimary = "px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-opacity";
    const btnSecondary = "px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors";

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Header */}
            <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
                <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>
                    <a href="/" className={btnSecondary}>Back to Site</a>
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
                                onClick={() => setShowAddProject(!showAddProject)}
                                className={`flex items-center gap-2 ${btnPrimary}`}
                            >
                                <Plus size={20} />
                                Add Project
                            </button>
                        </div>

                        {/* Add Project Form */}
                        {showAddProject && (
                            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
                                <h3 className="text-lg font-bold text-[var(--color-text)]">New Project</h3>
                                <input
                                    type="text"
                                    placeholder="Project Title *"
                                    value={projectForm.title}
                                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                    className={inputClass}
                                />
                                <textarea
                                    placeholder="Description *"
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    className={`${inputClass} min-h-[100px]`}
                                />
                                <input
                                    type="text"
                                    placeholder="Technologies (comma separated)"
                                    value={projectForm.tech}
                                    onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                                    className={inputClass}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="GitHub Link"
                                        value={projectForm.links.github}
                                        onChange={(e) => setProjectForm({ ...projectForm, links: { ...projectForm.links, github: e.target.value } })}
                                        className={inputClass}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Blog Link (Hashnode)"
                                        value={projectForm.links.blog}
                                        onChange={(e) => setProjectForm({ ...projectForm, links: { ...projectForm.links, blog: e.target.value } })}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button onClick={() => { setShowAddProject(false); setProjectForm(emptyProjectForm); }} className={btnSecondary}>
                                        Cancel
                                    </button>
                                    <button onClick={handleAddProject} className={btnPrimary}>
                                        Add Project
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Projects List */}
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6">
                                    {editingProject === project.id ? (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-[var(--color-text)]">Edit Project</h3>
                                            <input
                                                type="text"
                                                value={projectForm.title}
                                                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                                className={inputClass}
                                            />
                                            <textarea
                                                value={projectForm.description}
                                                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                                className={`${inputClass} min-h-[100px]`}
                                            />
                                            <input
                                                type="text"
                                                value={projectForm.tech}
                                                onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                                                className={inputClass}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="GitHub Link"
                                                    value={projectForm.links.github}
                                                    onChange={(e) => setProjectForm({ ...projectForm, links: { ...projectForm.links, github: e.target.value } })}
                                                    className={inputClass}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Blog Link (Hashnode)"
                                                    value={projectForm.links.blog}
                                                    onChange={(e) => setProjectForm({ ...projectForm, links: { ...projectForm.links, blog: e.target.value } })}
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    onClick={() => { setEditingProject(null); setProjectForm(emptyProjectForm); }}
                                                    className={`flex items-center gap-2 ${btnSecondary}`}
                                                >
                                                    <X size={16} /> Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateProject(project.id)}
                                                    className={`flex items-center gap-2 ${btnPrimary}`}
                                                >
                                                    <Save size={16} /> Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-bold text-[var(--color-text)]">{project.title}</h3>
                                                <div className="flex gap-2">
                                                    <button onClick={() => startEditProject(project)} className="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteProject(project.id)} className="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-red-500 hover:border-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[var(--color-text-secondary)] mb-4">{project.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tech.map((tech, i) => (
                                                    <span key={i} className="px-3 py-1 text-xs bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full text-[var(--color-text-secondary)]">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 text-sm text-[var(--color-text-secondary)]">
                                                <span className="flex items-center gap-1">
                                                    <Github size={14} /> {project.links?.github || 'Not set'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <HashnodeIcon size={14} /> {project.links?.blog || 'Not set'}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
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
                                onClick={() => setShowAddBlog(!showAddBlog)}
                                className={`flex items-center gap-2 ${btnPrimary}`}
                            >
                                <Plus size={20} />
                                Add Blog
                            </button>
                        </div>

                        {/* Add Blog Form */}
                        {showAddBlog && (
                            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
                                <h3 className="text-lg font-bold text-[var(--color-text)]">New Blog</h3>
                                <input
                                    type="text"
                                    placeholder="Blog Title *"
                                    value={blogForm.title}
                                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                    className={inputClass}
                                />
                                <input
                                    type="text"
                                    placeholder="Date (e.g., Jan 15, 2026 or Coming soon)"
                                    value={blogForm.date}
                                    onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                                    className={inputClass}
                                />
                                <textarea
                                    placeholder="Description *"
                                    value={blogForm.description}
                                    onChange={(e) => setBlogForm({ ...blogForm, description: e.target.value })}
                                    className={`${inputClass} min-h-[100px]`}
                                />
                                <input
                                    type="text"
                                    placeholder="Hashnode Link"
                                    value={blogForm.link}
                                    onChange={(e) => setBlogForm({ ...blogForm, link: e.target.value })}
                                    className={inputClass}
                                />
                                <div className="flex gap-3 justify-end">
                                    <button onClick={() => { setShowAddBlog(false); setBlogForm(emptyBlogForm); }} className={btnSecondary}>
                                        Cancel
                                    </button>
                                    <button onClick={handleAddBlog} className={btnPrimary}>
                                        Add Blog
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Blogs List */}
                        <div className="space-y-4">
                            {blogs.map((blog) => (
                                <div key={blog.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6">
                                    {editingBlog === blog.id ? (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-[var(--color-text)]">Edit Blog</h3>
                                            <input
                                                type="text"
                                                value={blogForm.title}
                                                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text"
                                                value={blogForm.date}
                                                onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                                                className={inputClass}
                                            />
                                            <textarea
                                                value={blogForm.description}
                                                onChange={(e) => setBlogForm({ ...blogForm, description: e.target.value })}
                                                className={`${inputClass} min-h-[100px]`}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Hashnode Link"
                                                value={blogForm.link}
                                                onChange={(e) => setBlogForm({ ...blogForm, link: e.target.value })}
                                                className={inputClass}
                                            />
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    onClick={() => { setEditingBlog(null); setBlogForm(emptyBlogForm); }}
                                                    className={`flex items-center gap-2 ${btnSecondary}`}
                                                >
                                                    <X size={16} /> Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateBlog(blog.id)}
                                                    className={`flex items-center gap-2 ${btnPrimary}`}
                                                >
                                                    <Save size={16} /> Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-[var(--color-text)]">{blog.title}</h3>
                                                    <span className="text-sm text-[var(--color-text-secondary)]">{blog.date}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => startEditBlog(blog)} className="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-red-500 hover:border-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[var(--color-text-secondary)] mb-2">{blog.description}</p>
                                            <span className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
                                                <HashnodeIcon size={14} /> {blog.link || 'Not set'}
                                            </span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
