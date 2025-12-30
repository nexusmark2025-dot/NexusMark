import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#/" className="flex items-center space-x-3 focus:outline-none">
            <div className="w-12 h-12 flex items-center justify-center">
                 <svg className="w-10 h-10 text-orange-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 12.5C12.28 12.5 12.5 12.28 12.5 12C12.5 11.72 12.28 11.5 12 11.5C11.72 11.5 11.5 11.72 11.5 12C11.5 12.28 11.72 12.5 12 12.5Z" />
                    <path d="M6.05029 7.51953L6.5 12L7.92969 11.5303L6.05029 7.51953Z" />
                    <path d="M17.9497 16.4805L17.5 12L16.0703 12.4697L17.9497 16.4805Z" />
                    <path d="M7.51953 17.9497L12 17.5L11.5303 16.0703L7.51953 17.9497Z" />
                    <path d="M16.4805 6.05029L12 6.5L12.4697 7.92969L16.4805 6.05029Z" />
                    <path d="M4.58008 10.25L7 9.5L7.2998 10.9502L4.58008 10.25Z" />
                    <path d="M19.4199 13.75L17 14.5L16.7002 13.0498L19.4199 13.75Z" />
                    <path d="M10.25 19.4199L9.5 17L10.9502 16.7002L10.25 19.4199Z" />
                    <path d="M13.75 4.58008L14.5 7L13.0498 7.2998L13.75 4.58008Z" />
                    <path d="M4.58008 13.75L7.2998 13.0498L7 14.5L4.58008 13.75Z" />
                    <path d="M19.4199 10.25L16.7002 10.9502L17 9.5L19.4199 10.25Z" />
                    <path d="M13.75 19.4199L13.0498 16.7002L14.5 17L13.75 19.4199Z" />
                    <path d="M10.25 4.58008L10.9502 7.2998L9.5 7L10.25 4.58008Z" />
                    <path d="M6.05029 16.4805L7.92969 12.4697L6.5 12L6.05029 16.4805Z" />
                    <path d="M17.9497 7.51953L16.0703 11.5303L17.5 12L17.9497 7.51953Z" />
                    <path d="M7.51953 6.05029L11.5303 7.92969L12 6.5L7.51953 6.05029Z" />
                    <path d="M16.4805 17.9497L12.4697 16.0703L12 17.5L16.4805 17.9497Z" />
                </svg>
            </div>
          <span className="text-xl font-bold text-slate-800 tracking-wider">Sarkari Seva Portal</span>
        </a>
        <nav>
          <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors font-medium">Contact Us</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;