import { prisma } from '@/lib/db';
import { ProductCategory, PriceRange } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const priceRange = typeof searchParams.priceRange === 'string' ? searchParams.priceRange : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const products = await prisma.product.findMany({
    where: {
      AND: [
        category ? { category: category as ProductCategory } : {},
        priceRange ? { priceRange: priceRange as PriceRange } : {},
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
                { tags: { has: search.toLowerCase() } },
              ],
            }
          : {},
      ],
    },
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <div className="hero">
        <h1>Product Guide</h1>
        <p>Curated equipment recommendations</p>
      </div>

      <section className="section">
        <form className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Search</label>
              <input name="search" defaultValue={search} placeholder="Product or brand..." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Category</label>
              <select name="category" defaultValue={category} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">All</option>
                {Object.values(ProductCategory).map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Price</label>
              <select name="priceRange" defaultValue={priceRange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">All</option>
                {Object.values(PriceRange).map((p) => (
                  <option key={p} value={p}>{p.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="btn">Filter</button>
              <a href="/products" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>Clear</a>
            </div>
          </div>
        </form>

        <p style={{ marginBottom: '1rem', color: '#666' }}>{products.length} product(s) found</p>

        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="card">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '1rem' }} />
              )}
              <h3>{product.name}</h3>
              {product.brand && <p style={{ fontSize: '0.9rem', color: '#666' }}>by {product.brand}</p>}
              <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{product.description}</p>
              <div style={{ marginTop: '0.75rem' }}>
                <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>{product.category.replace('_', ' ')}</span>
                {product.priceRange && <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>{product.priceRange.replace('_', ' ')}</span>}
                {product.rating && <span className="badge" style={{ background: '#fff4e6', color: '#92400e' }}>★ {product.rating}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
