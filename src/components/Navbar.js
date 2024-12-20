import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-600 text-white z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-4">
        {/* Logo Section */}
        <div className="text-2xl font-semibold">Vihaan Academy</div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button className="text-white" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link href="#about" className="hover:text-yellow-500 transition duration-200">
            About
          </Link>
          <Link href="#testimonials" className="hover:text-yellow-500 transition duration-200">
            Testimonials
          </Link>
          <Link href="#contact" className="hover:text-yellow-500 transition duration-200">
            Contact
          </Link>
          <Link href="#accreditations" className="hover:text-yellow-500 transition duration-200">
            Accreditations
          </Link>
          <Link href="/admin">
            <button className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-600 transition duration-200">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden bg-blue-600 transition-all duration-300 overflow-hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="space-y-4 py-4 px-6">
          <Link href="#about" className="block hover:text-yellow-500 transition duration-200">
            About
          </Link>
          <Link href="#testimonials" className="block hover:text-yellow-500 transition duration-200">
            Testimonials
          </Link>
          <Link href="#contact" className="block hover:text-yellow-500 transition duration-200">
            Contact
          </Link>
          <Link href="#accreditations" className="block hover:text-yellow-500 transition duration-200">
            Accreditations
          </Link>
          <Link href="/admin">
            <button className="w-full bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-600 transition duration-200">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
