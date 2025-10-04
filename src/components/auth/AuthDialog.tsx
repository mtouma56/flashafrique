import { useState, type FormEvent } from 'react';
import { useSession } from '@/context/SessionProvider';

type AuthTab = 'signin' | 'signup' | 'forgot';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AuthTab;
}

export const AuthDialog = ({ isOpen, onClose, initialTab = 'signin' }: AuthDialogProps) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { signIn, signUp, resetPassword } = useSession();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMessage(null);
  };

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await signIn(email, password);

    if (error) {
      setMessage({ type: 'error', text: 'Email ou mot de passe incorrect' });
      setLoading(false);
    } else {
      setMessage({ type: 'success', text: 'Connexion réussie !' });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1000);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la création du compte' });
      setLoading(false);
    } else {
      setMessage({ 
        type: 'success', 
        text: 'Compte créé ! Veuillez vérifier votre email pour confirmer votre inscription.' 
      });
      setLoading(false);
      resetForm();
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await resetPassword(email);

    if (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi du lien de réinitialisation' });
      setLoading(false);
    } else {
      setMessage({ 
        type: 'success', 
        text: 'Un lien de réinitialisation a été envoyé à votre email' 
      });
      setLoading(false);
      setEmail('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black dark:text-white">Authentification</h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
          >
            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-black/10 dark:border-white/10">
          <button
            onClick={() => handleTabChange('signin')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'signin'
                ? 'border-b-2 border-primary text-primary'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'signup'
                ? 'border-b-2 border-primary text-primary'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
            }`}
          >
            Créer un compte
          </button>
          <button
            onClick={() => handleTabChange('forgot')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'forgot'
                ? 'border-b-2 border-primary text-primary'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
            }`}
          >
            Mot de passe oublié
          </button>
        </div>

        {/* Sign In Tab */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">
                Adresse email
              </label>
              <input
                type="email"
                id="signin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-black/20 bg-white px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/20 dark:bg-gray-700 dark:text-white"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="signin-password" className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">
                Mot de passe
              </label>
              <input
                type="password"
                id="signin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-black/20 bg-white px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/20 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className={`rounded-lg p-3 text-sm ${
                message.type === 'error'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2 font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}

        {/* Sign Up Tab */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">
                Adresse email
              </label>
              <input
                type="email"
                id="signup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-black/20 bg-white px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/20 dark:bg-gray-700 dark:text-white"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">
                Mot de passe
              </label>
              <input
                type="password"
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-black/20 bg-white px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/20 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                Au moins 8 caractères
              </p>
            </div>

            <div>
              <label htmlFor="signup-confirm" className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="signup-confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-black/20 bg-white px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/20 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className={`rounded-lg p-3 text-sm ${
                message.type === 'error'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2 font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer un compte'}
            </button>
          </form>
        )}

        {/* Forgot Password Tab */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">
                Adresse email
              </label>
              <input
                type="email"
                id="forgot-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-black/20 bg-white px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/20 dark:bg-gray-700 dark:text-white"
                placeholder="votre@email.com"
              />
            </div>

            {message && (
              <div className={`rounded-lg p-3 text-sm ${
                message.type === 'error'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2 font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
            </button>

            <p className="text-center text-sm text-black/60 dark:text-white/60">
              Un lien pour réinitialiser votre mot de passe vous sera envoyé par email
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

// Helper function to open dialog from anywhere
let openDialogFn: ((tab?: AuthTab) => void) | null = null;

export const setAuthDialogOpener = (fn: (tab?: AuthTab) => void) => {
  openDialogFn = fn;
};

export const openAuthDialog = (tab: AuthTab = 'signin') => {
  if (openDialogFn) {
    openDialogFn(tab);
  }
};
