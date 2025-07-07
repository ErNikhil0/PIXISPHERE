import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">Pixisphere</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="text-gray-700 hover:text-blue-600">Photographers</Link></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-600">Categories</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-600">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}