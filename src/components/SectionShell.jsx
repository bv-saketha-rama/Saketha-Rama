// Shared panel frame: mono index and heading above the content. The panel
// scrolls on its own only when the screen is too short to show it all.
const SectionShell = ({ id, index, title, children }) => (
    <section id={id} className="panel-scroll" aria-labelledby={`${id}-title`}>
        <div className="panel-body">
            <header className="panel-heading flex items-baseline gap-4">
                <p className="meta text-ink">{index}</p>
                <h2 id={`${id}-title`} className="text-[clamp(1.6rem,2.6vw,2.25rem)]">{title}</h2>
            </header>
            {children}
        </div>
    </section>
);

export default SectionShell;
