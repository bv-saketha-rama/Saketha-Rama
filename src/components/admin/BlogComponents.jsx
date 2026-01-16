import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import HashnodeIcon from '../icons/HashnodeIcon';

const emptyBlogForm = {
    title: '',
    date: '',
    description: '',
    link: ''
};

export const BlogForm = ({ form, setForm, onSubmit, onCancel, isEditing = false }) => {
    const [errors, setErrors] = useState({});

    const inputClass = "w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition-colors";
    const btnPrimary = "px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-opacity";
    const btnSecondary = "px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors";

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
                {isEditing ? 'Edit Blog' : 'New Blog'}
            </h3>
            <div>
                <input
                    type="text"
                    placeholder="Blog Title *"
                    value={form.title}
                    onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }); }}
                    className={`${inputClass} ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <input
                type="text"
                placeholder="Date (e.g., Jan 15, 2026 or Coming soon)"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
            />
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
                placeholder="Hashnode Link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className={inputClass}
            />
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

export const BlogListItem = ({ blog, onEdit, onDelete }) => {
    return (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-[var(--color-text)]">{blog.title}</h3>
                    <span className="text-sm text-[var(--color-text-secondary)]">{blog.date}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(blog)}
                        className="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
                        aria-label={`Edit ${blog.title}`}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(blog.id)}
                        className="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-red-500 hover:border-red-500 transition-colors"
                        aria-label={`Delete ${blog.title}`}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-2">{blog.description}</p>
            <span className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
                <HashnodeIcon size={14} /> {blog.link || 'Not set'}
            </span>
        </div>
    );
};

export { emptyBlogForm };
