import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-mono-light-900 dark:bg-mono-dark-900 border-t border-mono-light-400 dark:border-mono-dark-400">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Link
            to="/"
            className="text-mono-dark dark:text-mono-light text-lg font-bold"
          >
            LaceUp
          </Link>

          <div className="flex justify-center space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mono-dark-600 dark:text-mono-light-600 hover:opacity-80"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mono-dark-600 dark:text-mono-light-600 hover:opacity-80"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mono-dark-600 dark:text-mono-light-600 hover:opacity-80"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
          </div>

          <div className="flex justify-end gap-6 text-sm text-mono-dark-600 dark:text-mono-light-600">
            <Link
              to="/about"
              className="hover:text-mono-dark dark:hover:text-mono-light"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-mono-dark dark:hover:text-mono-light"
            >
              Contact
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-mono-dark dark:hover:text-mono-light"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-mono-dark dark:hover:text-mono-light"
            >
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-mono-dark-600 dark:text-mono-light-600">
          <p>&copy; {new Date().getFullYear()} LaceUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
