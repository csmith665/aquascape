import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <div className="hero">
        <h1>Product Guide</h1>
        <p>Curated equipment recommendations for every budget</p>
      </div>

      <section className="section">
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="card">
              <h3>{product.name}</h3>
              {product.brand && (
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  by {product.brand}
                </p>
              )}
              <p style={{ marginTop: '0.5rem' }}>{product.description}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>
                  {product.category.replace('_', ' ')}
                </span>
                {product.priceRange && (
                  <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                    {product.priceRange.replace('_', ' ')}
                  </span>
                )}
              </div>

              {product.rating && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                  <strong>Rating:</strong> {'★'.repeat(Math.floor(product.rating))} {product.rating}/5
                </p>
              )}

              <div style={{ marginTop: '0.75rem' }}>
                {product.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="badge" style={{ background: '#f0f0f0', color: '#666' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
