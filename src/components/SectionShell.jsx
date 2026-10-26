// Shared section frame: mono index and heading on the left, content on the right.
const SectionShell = ({ id, index, title, children }) => (
    <section id={id} className="section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8">
            <header className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                    <p className="meta mb-3 text-ink">{index}</p>
                    <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)]">{title}</h2>
                </div>
            </header>

            <div className="lg:col-span-8 min-w-0">{children}</div>
        </div>
    </section>
);

export default SectionShell;
