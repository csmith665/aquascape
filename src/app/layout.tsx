import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aquascape - Aquarium & Vivarium Planner',
  description: 'Plan, build, and track your aquariums and vivariums with ease. Database of animals, plants, and products with compatibility checking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <a href="/" className="nav-brand">Aquascape</a>
          <div className="nav-links">
            <a href="/animals">Animals</a>
            <a href="/plants">Plants</a>
            <a href="/products">Products</a>
            <a href="/builder">Builder</a>
            <a href="/tracking">My Tanks</a>
            <a href="/guides">Guides</a>
          </div>
        </nav>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
