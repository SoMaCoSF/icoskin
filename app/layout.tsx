import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IcoSkin — Spatially Addressed Smart Compute Skin',
  description: 'Funding explorer for multi-shell geodesic smart skin with Fe-BMG sensing and spatial UUID addressing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#030712] text-slate-300 antialiased">{children}</body>
    </html>
  );
}