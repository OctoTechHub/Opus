import { FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-8 font-mono">
      <div className="container mx-auto text-center">
        {/* First Row */}
        <div className="mb-4">
          <p className="text-lg font-bold">Fantility</p>
          <p className="text-sm mt-5">© 2024 Fantility. All rights reserved.</p>
        </div>

        {/* Second Row */}
        <div className="mb-4">
          <a href="/about" className="mx-2 hover:underline">
            About Us
          </a>
          <a href="/contact" className="mx-2 hover:underline">
            Contact
          </a>
          <a href="/privacy" className="mx-2 hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="mx-2 hover:underline">
            Terms of Service
          </a>
        </div>

        {/* Third Row */}
        <div className="flex justify-center mt-4">
          <a href="https://twitter.com/fantility_" className="mx-2" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://instagram.com/fantility_" className="mx-2" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="http://linkedin.com/company/fantiltiy" className="mx-2" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
