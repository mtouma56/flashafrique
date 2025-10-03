import { Link } from 'react-router-dom';
import React from 'react';

interface FooterProps {
  onNewsletterSubmit?: (email: string) => void;
}

const Footer = ({ onNewsletterSubmit }: FooterProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    if (onNewsletterSubmit) {
      onNewsletterSubmit(email);
    }
  };

  return (
    <footer className="mt-12 border-t border-primary/20 bg-background-light px-10 py-12 dark:bg-background-dark">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-6">
          <div className="flex flex-col gap-4 md:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-4 text-black dark:text-white">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold">FlashAfrique</h2>
            </div>
            <p className="text-sm text-black/60 dark:text-white/60">Your source for news and analysis on Côte d'Ivoire and the UEMOA/CEDEAO region.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">Sections</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/category/politique" className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary">Politique</Link>
              <Link to="/category/economie" className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary">Économie</Link>
              <Link to="/category/culture" className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary">Culture</Link>
              <Link to="/category/sport" className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary">Sport</Link>
              <Link to="/category/societe" className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary">Société</Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">About</h3>
            <nav className="flex flex-col gap-2">
              <a className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary" href="#">About Us</a>
              <a className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary" href="#">Contact Us</a>
              <a className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary" href="#">Careers</a>
              <a className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary" href="#">Press</a>
            </nav>
          </div>
          <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">Newsletter</h3>
            <p className="text-sm text-black/60 dark:text-white/60">Subscribe to our newsletter to get the latest news and updates.</p>
            <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
              <input 
                name="email"
                className="h-10 w-full flex-1 rounded-lg border-none bg-black/5 px-4 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40" 
                placeholder="Enter your email" 
                type="email"
              />
              <button 
                type="submit"
                className="flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-primary/20 pt-8 sm:flex-row">
          <p className="text-sm text-black/60 dark:text-white/60">© 2024 FlashAfrique. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary" href="#">Terms of Service</a>
            <a className="text-sm text-black/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary" href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
