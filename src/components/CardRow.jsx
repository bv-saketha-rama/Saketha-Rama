// A row of cards: three across on desktop, stacked below that.
// items: [{ key, content }]
const CardRow = ({ items, label }) => (
    <ol className="card-row" aria-label={label}>
        {items.map((item) => (
            <li key={item.key} className="card-row-item">
                {item.content}
            </li>
        ))}
    </ol>
);

export default CardRow;
