import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionProvider';

const AuthCallback = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { updatePassword } = useSession();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setLoading(false);
      return;
    }

    const { error } = await updatePassword(newPassword);

    if (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du mot de passe' });
      setLoading(false);
    } else {
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-bold text-black dark:text-white">
          Nouveau mot de passe
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
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
            className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthCallback;
