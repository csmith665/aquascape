import Link from 'next/link';

export default function ChoosingCompatibleFishArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Choosing Compatible Fish</h1>
        <p>How to build a peaceful community tank that thrives</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: '#555', lineHeight: 1.7 }}>
          Not all fish get along. Choosing compatible tank mates means matching temperament, water parameters,
          adult size, and swimming habits. A little research upfront prevents stress, injury, and death.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>1. Match Temperament</h2>
        <p>
          Peaceful fish should live with other peaceful fish. Semi-aggressive species can work in larger tanks with
          carefully chosen companions. Aggressive fish usually need species-only tanks.
        </p>
        <ul>
          <li><strong>Peaceful examples:</strong> tetras, rasboras, corydoras, guppies, platies.</li>
          <li><strong>Semi-aggressive examples:</strong> tiger barbs, dwarf gouramis, angelfish.</li>
          <li><strong>Aggressive examples:</strong> many cichlids, betta males (with most fish).</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>2. Consider Adult Size</h2>
        <p>
          Many fish sold in stores are juveniles. Always research the adult size. A common rule of thumb is one inch
          of adult fish per gallon, but this is only a rough guide. Active fish and schooling fish need more space.
        </p>
        <p>
          Avoid keeping large fish with very small fish. Even peaceful large fish may accidentally eat tiny tank mates.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>3. Match Water Parameters</h2>
        <p>
          Fish from different natural habitats have different needs. Mixing soft-water discus with hard-water livebearers
          will stress both groups. Check temperature, pH, and hardness requirements before buying.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>4. Respect Schooling Needs</h2>
        <p>
          Schooling fish like tetras, rasboras, and danios feel unsafe in small numbers. Keep them in groups of six or more.
          A stressed schooling fish may become nippy, lethargic, or prone to disease.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>5. Avoid Fin Nippers</h2>
        <p>
          Active fish like tiger barbs and serpae tetras are known fin nippers. Do not keep them with slow fish that have
          long, flowing fins such as bettas, guppies, or angelfish.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>6. Think About Swimming Zones</h2>
        <p>
          A balanced community uses all levels of the tank:
        </p>
        <ul>
          <li><strong>Top:</strong> gouramis, hatchetfish, some tetras.</li>
          <li><strong>Middle:</strong> tetras, rasboras, danios, livebearers.</li>
          <li><strong>Bottom:</strong> corydoras, loaches, shrimp, snails, plecos.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>7. Use the Compatibility Checker</h2>
        <p>
          Our <Link href="/compatibility">Compatibility Checker</Link> evaluates pairs based on temperament, size,
          temperature, pH, and habitat overlap. It is a great starting point, but always observe your fish after
          introducing them.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Safe Beginner Combinations</h2>
        <ul>
          <li>Neon tetras + corydoras + a dwarf gourami</li>
          <li>Harlequin rasboras + cherry shrimp + anubias plants</li>
          <li>Platies + corydoras + java fern</li>
          <li>Zebra danios + a bristlenose pleco + crypts</li>
        </ul>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>
            ← Back to Guides
          </Link>
          <Link href="/compatibility" className="btn">
            Compatibility Checker
          </Link>
        </div>
      </article>
    </>
  );
}
