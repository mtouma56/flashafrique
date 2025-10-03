import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, type FormEvent } from 'react';
import { useSession } from '../context/SessionProvider';
import { AuthDialog, setAuthDialogOpener } from './auth/AuthDialog';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const { user, isAdmin, signOut } = useSession();

  // Register the dialog opener function
  useEffect(() => {
    setAuthDialogOpener((tab = 'signin') => {
      setAuthDialogTab(tab);
      setShowAuthDialog(true);
    });
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      {/* Brand Section */}
      <div className="w-full bg-background-light py-6 dark:bg-background-dark">
        <div className="flex flex-col items-center justify-center gap-4 text-black dark:text-white">
          <Link to="/" className="flex items-center gap-4">
            <div className="size-10 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-4xl font-bold">FlashAfrique</h2>
          </Link>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-20 flex w-full items-center justify-between whitespace-nowrap border-b border-primary/20 bg-background-light px-10 py-3 dark:bg-background-dark">
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-8">
            <NavLink to="/category/politique" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-black/60 hover:text-primary dark:text-white/60 dark:hover:text-primary'}`}>Politique</NavLink>
            <NavLink to="/category/economie" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-black/60 hover:text-primary dark:text-white/60 dark:hover:text-primary'}`}>Économie</NavLink>
            <NavLink to="/category/culture" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-black/60 hover:text-primary dark:text-white/60 dark:hover:text-primary'}`}>Culture</NavLink>
            <NavLink to="/category/sport" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-black/60 hover:text-primary dark:text-white/60 dark:hover:text-primary'}`}>Sport</NavLink>
            <NavLink to="/category/societe" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-black/60 hover:text-primary dark:text-white/60 dark:hover:text-primary'}`}>Société</NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-black/60 hover:text-primary dark:text-white/60 dark:hover:text-primary'}`}>Admin</NavLink>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <form onSubmit={handleSearch} className="relative flex h-10 w-64 items-center">
            <div className="pointer-events-none absolute left-3 text-black/40 dark:text-white/40">
              <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full rounded-full border-none bg-black/5 px-10 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40" 
              placeholder="Rechercher" 
            />
          </form>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-black/80 dark:text-white/80">
                  {user.email}
                </span>
                <button 
                  onClick={handleLogout}
                  className="h-10 rounded-full bg-black/5 px-4 text-sm font-bold text-black/80 transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setAuthDialogTab('signin');
                  setShowAuthDialog(true);
                }}
                className="h-10 rounded-full bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        initialTab={authDialogTab}
      />
    </>
  );
};

export default Header;
