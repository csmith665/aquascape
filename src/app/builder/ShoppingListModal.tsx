'use client';

export type ShoppingItem = {
  id: string;
  section: 'livestock' | 'plants' | 'substrate' | 'hardscape' | 'equipment';
  name: string;
  quantity: number;
  category?: string;
  priceRange?: string | null;
};

const SECTION_LABELS: Record<ShoppingItem['section'], string> = {
  livestock: 'Livestock',
  plants: 'Plants',
  substrate: 'Substrate',
  hardscape: 'Rocks & Hardscape',
  equipment: 'Equipment',
};

const SECTION_ORDER: ShoppingItem['section'][] = [
  'livestock',
  'plants',
  'substrate',
  'hardscape',
  'equipment',
];

const humanize = (s: string) =>
  s
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export function ShoppingListModal({
  items,
  buildName,
  onClose,
}: {
  items: ShoppingItem[];
  buildName: string;
  onClose: () => void;
}) {
  const grouped = SECTION_ORDER.map((section) => ({
    section,
    label: SECTION_LABELS[section],
    items: items.filter((i) => i.section === section),
  })).filter((g) => g.items.length > 0);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="shopping-list-overlay" role="dialog" aria-modal="true" aria-label="Shopping list">
      <div className="shopping-list-modal print-area">
        <div className="shopping-list-header">
          <div>
            <h2 style={{ margin: 0 }}>Shopping List</h2>
            <p style={{ margin: '0.25rem 0 0', color: '#666' }}>
              {buildName} · {totalItems} item{totalItems === 1 ? '' : 's'}
            </p>
          </div>
          <div className="shopping-list-actions">
            <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
              Print
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {grouped.length === 0 ? (
          <p style={{ color: '#666', padding: '2rem 0' }}>
            No items selected. Close this window and check the items you want to buy, then reopen the shopping list.
          </p>
        ) : (
          <div>
            {grouped.map((g) => (
              <div key={g.section} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#1a5490', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                  {g.label} ({g.items.reduce((s, i) => s + i.quantity, 0)})
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th style={{ width: '90px' }}>Qty</th>
                      <th style={{ width: '160px' }}>Category</th>
                      <th style={{ width: '120px' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.category ? humanize(item.category) : '—'}</td>
                        <td>{item.priceRange ? humanize(item.priceRange) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
          Generated from your current Builder selections. Quantities reflect what you entered above.
        </p>
      </div>
    </div>
  );
}
