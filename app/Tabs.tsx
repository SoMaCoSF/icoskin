export default function Tabs({ active }: { active: string }) {
  const tabs = [
    { id: 'brief', label: 'BRIEF', href: '/' },
    { id: 'suppliers', label: 'SUPPLIERS', href: '/suppliers' },
    { id: 'validation', label: 'VALIDATION', href: '/validation' },
    { id: 'cadcam', label: 'CAD/CAM ENGINE', href: '/cad-cam' },
  ];
  return (
    <nav className="tabs">
      {tabs.map((t) => (
        <a key={t.id} href={t.href} className={t.id === active ? 'tab on' : 'tab'}>{t.label}</a>
      ))}
    </nav>
  );
}
