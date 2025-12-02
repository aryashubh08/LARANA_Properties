import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div
        className="container mx-auto px-6 md:px-12 grid 
                      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                      gap-12"
      >
        {/* LOGO */}
        <div>
          <a href="/" className="flex items-center gap-2">
            <img
              src="/assets/logo.png"
              alt="logo"
              className="w-32 object-contain"
            />
          </a>
          <p className="mt-4 text-gray-400">
            Your trusted partner for luxury home rentals & listings.
          </p>
        </div>

        {/* USEFUL LINKS */}
        <div>
          <h3 classname="text-xl font-semibold text-white mb-4">
            Useful Links
          </h3>
          <ul className="space-y-3">
            <li className="hover:text-white transition cursor-pointer">
              About Us
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Return & Refund Policy
            </li>
          </ul>
        </div>

        {/* CONTACT SECTION */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📱</span>
            <p className="text-gray-300">+91 9876543210</p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📧</span>
            <p className="text-gray-300">laranaProperties@support.com</p>
          </div>

          <img
            src="/assets/payment.png"
            alt="payment options"
            className="w-40 opacity-80 hover:opacity-100 transition"
          />
        </div>
      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Larana Properties. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
