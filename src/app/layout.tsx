import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aquascape - Aquarium & Vivarium Planner',
  description: 'Plan, build, and track your aquariums and vivariums with ease. Database of animals, plants, and products with compatibility checking.',
};

const navLinks = [
  { href: '/builder', label: 'Builder', icon: 'beaker' },
  { href: '/animals', label: 'Animals', icon: 'fish' },
  { href: '/plants', label: 'Plants', icon: 'leaf' },
  { href: '/products', label: 'Products', icon: 'box' },
  { href: '/compatibility', label: 'Compatibility', icon: 'arrows' },
  { href: '/tracking', label: 'My Tanks', icon: 'gauge' },
  { href: '/setup-checklist', label: 'Checklist', icon: 'check' },
  { href: '/guides', label: 'Guides', icon: 'book' },
];

function NavIcon({ name }: { name: string }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'fish':
      return (
        <svg {...common}><path d="M6.5 12c0-3 2.5-6 7.5-6 4 0 7 2 7 2l3-2-1 4 1 4-3-2s-3 2-7 2c-5 0-7.5-3-7.5-6Z" /><path d="M16 12h.01" /></svg>
      );
    case 'leaf':
      return (
        <svg {...common}><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16Z" /><path d="M4 20 11 13" /></svg>
      );
    case 'beaker':
      return (
        <svg {...common}><path d="M4 4h10l-1 6 4 7c1 2 0 3-2 3H6c-2 0-3-1-2-3l4-7-1-6Z" /><path d="M5 13h10" /></svg>
      );
    case 'box':
      return (
        <svg {...common}><path d="M3 7 12 3 21 7 12 11 3 7Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></svg>
      );
    case 'arrows':
      return (
        <svg {...common}><path d="M7 11 4 8l3-3" /><path d="M4 8h8a4 4 0 0 1 0 8H8" /><path d="m17 13 3 3-3 3" /><path d="M20 16h-4a4 4 0 0 1 0-8h0" /></svg>
      );
    case 'gauge':
      return (
        <svg {...common}><path d="M12 14a6 6 0 0 0 0-12 6 6 0 0 0 0 12Z" /><path d="M12 8 15 5" /><path d="M3 20h18M6 16l2 1M18 16l-2 1" /></svg>
      );
    case 'check':
      return (
        <svg {...common}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 3 3 5-6" /></svg>
      );
    case 'book':
      return (
        <svg {...common}><path d="M4 4 12 4 20 4 20 20 12 20 4 20 4 4Z" /><path d="M12 4v16" /></svg>
      );
    default:
      return null;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <a href="/" className="nav-brand">
              <span className="nav-brand-mark" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.5 12c0-3 2.5-6 7.5-6 4 0 7 2 7 2l3-2-1 4 1 4-3-2s-3 2-7 2c-5 0-7.5-3-7.5-6Z" transform="scale(0.85) translate(-0.5, 1.5)" />
                </svg>
              </span>
              Aquascape
            </a>
            <div className="nav-links">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  <NavIcon name={link.icon} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
