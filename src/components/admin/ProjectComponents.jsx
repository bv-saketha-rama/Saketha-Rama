import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Github } from 'lucide-react';
import HashnodeIcon from '../icons/HashnodeIcon';

const emptyProjectForm = {
    title: '',
    description: '',
    tech: '',
    links: { github: '', blog: '' }
};

export const ProjectForm = ({ form, setForm, onSubmit, onCancel, isEditing = false }) => {
    const [errors, setErrors] = useState({});

    const inputClass = "w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition-colors";
    const btnPrimary = "px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-opacity";
    const btnSecondary = "px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors";

    const links = form.links || { github: '', blog: '' };

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = 'Title is required';
        if (!form.description.trim()) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit();
        }
    };

    return (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-text)]">
                {isEditing ? 'Edit Project' : 'New Project'}
            </h3>
            <div>
                <input
                    type="text"
                    placeholder="Project Title *"
                    value={form.title}
                    onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }); }}
                    className={`${inputClass} ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div>
                <textarea
                    placeholder="Description *"
                    value={form.description}
                    onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: '' }); }}
                    className={`${inputClass} min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            <input
                type="text"
                placeholder="Technologies (comma separated)"
                value={form.tech}
                onChange={(e) => setForm({ ...form, tech: e.target.value })}
                className={inputClass}
            />
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="GitHub Link"
                    value={links.github}
                    onChange={(e) => setForm({ ...form, links: { ...links, github: e.target.value } })}
                    className={inputClass}
                />
                <input
                    type="text"
                    placeholder="Blog Link (Hashnode)"
                    value={links.blog}
                    onChange={(e) => setForm({ ...form, links: { ...links, blog: e.target.value } })}
                    className={inputClass}
                />
            </div>
            <div className="flex gap-3 justify-end">
                <button onClick={onCancel} className={`flex items-center gap-2 ${btnSecondary}`}>
                    <X size={16} /> Cancel
                </button>
                <button onClick={handleSubmit} className={`flex items-center gap-2 ${btnPrimary}`}>
                    {isEditing ? <><Save size={16} /> Save</> : <><Plus size={16} /> Add</>}
                </button>
            </div>
        </div>
    );
};

export const ProjectListItem = ({ project, onEdit, onDelete }) => {
    return (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-[var(--color-text)]">{project.title}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(project)}
                        className="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
                        aria-label={`Edit project ${project.title}`}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(project.id)}
                        className="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-red-500 hover:border-red-500 transition-colors"
                        aria-label={`Delete project ${project.title}`}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {(Array.isArray(project.tech) ? project.tech : []).map((tech, i) => (
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
        </div>
    );
};

export { emptyProjectForm };
