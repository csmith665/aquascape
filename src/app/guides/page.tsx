import Link from 'next/link';

export default function GuidesPage() {
  const guides = [
    {
      title: 'Setting Up Your First Freshwater Aquarium',
      description: 'A complete beginner guide covering equipment selection, cycling, and stocking your first tank.',
      difficulty: 'Beginner',
      readTime: '15 min',
      href: '/articles/first-freshwater-aquarium',
    },
    {
      title: 'Understanding the Nitrogen Cycle',
      description: 'Learn why cycling is crucial and how to properly cycle your aquarium before adding livestock.',
      difficulty: 'Beginner',
      readTime: '10 min',
      href: '/articles/nitrogen-cycle',
    },
    {
      title: 'Choosing Compatible Fish',
      description: 'How to research and select fish that will coexist peacefully in your setup.',
      difficulty: 'Beginner',
      readTime: '8 min',
      href: '/articles/choosing-compatible-fish',
    },
    {
      title: 'Aquarium Plant Care Basics',
      description: 'Lighting, nutrients, CO2, and maintenance tips for keeping aquatic plants healthy.',
      difficulty: 'Intermediate',
      readTime: '12 min',
      href: '/articles/plant-care-basics',
    },
    {
      title: 'Water Testing and Parameter Management',
      description: 'How to test your water, interpret results, and maintain stable parameters.',
      difficulty: 'Beginner',
      readTime: '10 min',
      href: '/articles/water-testing',
    },
    {
      title: 'Common Fish Diseases and Treatments',
      description: 'Identify symptoms of common diseases and learn safe treatment options.',
      difficulty: 'Intermediate',
      readTime: '15 min',
      href: '/articles/fish-diseases',
    },
    {
      title: 'Enclosure Types Explained',
      description: 'Aquarium, terrarium, vivarium, paludarium, and more — learn what makes each enclosure type unique.',
      difficulty: 'Beginner',
      readTime: '12 min',
      href: '/articles/environments',
    },
    {
      title: 'Upkeep Requirements',
      description: 'Daily, weekly, monthly, and seasonal care routines for aquariums, vivariums, terrariums, and more.',
      difficulty: 'Beginner',
      readTime: '10 min',
      href: '/articles/upkeep-requirements',
    },
  ];

  return (
    <>
      <div className="hero">
        <h1>Beginner Guides</h1>
        <p>Everything you need to know to get started in the hobby</p>
      </div>

      <section className="section">
        <div className="grid">
          {guides.map((guide, index) => (
            <div key={index} className="card">
              <h3>{guide.title}</h3>
              <p style={{ marginTop: '0.5rem' }}>{guide.description}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <span className={`badge badge-${guide.difficulty.toLowerCase()}`}>
                  {guide.difficulty}
                </span>
                <span className="badge" style={{ background: '#f0f0f0', color: '#666' }}>
                  {guide.readTime} read
                </span>
              </div>

              <Link
                href={guide.href}
                className="btn"
                style={{ marginTop: '1rem', fontSize: '0.9rem', padding: '0.5rem 1rem', display: 'inline-block' }}
              >
                Read Guide
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
