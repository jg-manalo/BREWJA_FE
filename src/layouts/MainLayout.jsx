import MainNav from '../components/nav';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <MainNav />
      <div className="p-6">{children}</div>
    </div>
  );
}
