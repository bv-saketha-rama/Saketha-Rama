import { useData } from '../context/DataContext';

const ResumeViewer = () => {
    const { resume } = useData();

    if (!resume) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">Resume Not Available</h1>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        The resume has not been uploaded yet. Please check back later or contact me directly.
                    </p>
                    <a href="/" className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-opacity">
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
            <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] p-4 flex justify-between items-center">
                <h1 className="font-bold text-[var(--color-text)]">Resume</h1>
                <div className="flex gap-4">
                    <a
                        href={resume}
                        download="Saketha_Rama_Resume.pdf"
                        className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                    >
                        Download PDF
                    </a>
                    <a
                        href="/"
                        className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-bg)] transition-colors text-sm"
                    >
                        Close
                    </a>
                </div>
            </header>
            <div className="flex-grow w-full h-full bg-[var(--color-bg-secondary)]">
                <iframe
                    src={resume}
                    className="w-full h-full"
                    style={{ minHeight: 'calc(100vh - 70px)' }}
                    title="Resume PDF"
                />
            </div>
        </div>
    );
};

export default ResumeViewer;
