import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IcoSkin — Spatially Addressed Smart Compute Skin',
  description:
    'A materials brief for a multi-shell geodesic smart skin: Fe-BMG sparse sensing flags, spatial UUID addressing, and the five measurements that decide feasibility. The skin is the address space.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
