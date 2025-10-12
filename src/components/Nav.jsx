import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="bg-purple-900 px-6 py-4 m-auto shadow-md flex justify-between items-center">
      {/* Logo / Brand */}
      <div className="flex flex-col items-center">
        <span className="text-white text-2xl font-bold tracking-wide flex items-center">
          <span className="text-3xl mr-2">🧙‍♀️</span> {/* Witch Emoji */}
          BrewHa
        </span>
        <span className="text-purple-200 text-sm italic text-center">
          Magic Steeped, Secrets Sipped.
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <Link
          to="/create-profile"
          className="text-white hover:text-purple-300 transition-colors"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
