import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import ArticlesTable from '../components/ArticlesTable';
import type { Article } from '../components/ArticlesTable';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '@/context/SessionProvider';

type ModerationAction = 'approved' | 'rejected';

interface RawModerationLog {
  id: number;
  article_id: number;
  moderator: string;
  action: ModerationAction;
  previous_status: string;
  new_status: string;
  created_at: string;
  articles?: {
    title?: string | null;
  } | null;
}

interface ModerationLog {
  id: number;
  articleId: number;
  articleTitle: string;
  moderator: string;
  action: ModerationAction;
  previousStatus: string;
  newStatus: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingActions, setLoadingActions] = useState<Set<number>>(new Set());
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(true);
  const [hasShownAccessToast, setHasShownAccessToast] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useSession();

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }, []);

  const formatModerationLog = useCallback((log: RawModerationLog): ModerationLog => ({
    id: log.id,
    articleId: log.article_id,
    articleTitle: log.articles?.title ?? `Article #${log.article_id}`,
    moderator: log.moderator,
    action: log.action,
    previousStatus: log.previous_status,
    newStatus: log.new_status,
    createdAt: log.created_at,
  }), []);

  const fetchPendingArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error, count } = await supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')
        .order('publish_at', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        showToast('Erreur lors du chargement des articles', 'error');
        return;
      }

      if (data) {
        setArticles(data as Article[]);
        setPendingCount(typeof count === 'number' ? count : data.length);
      }
    } catch (err) {
      console.error('Erreur inattendue:', err);
      showToast('Erreur lors du chargement des articles', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const fetchModerationLogs = useCallback(async () => {
    try {
      setIsLoadingLogs(true);
      const { data, error } = await supabase
        .from('moderation_logs')
        .select('id, article_id, moderator, action, previous_status, new_status, created_at, articles(title)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erreur lors de la récupération des modérations:', error);
        showToast('Erreur lors du chargement des modérations récentes', 'error');
        return;
      }

      if (data) {
        const formattedLogs = (data as RawModerationLog[]).map((log) => formatModerationLog(log));
        setModerationLogs(formattedLogs);
      }
    } catch (err) {
      console.error('Erreur inattendue lors de la récupération des modérations:', err);
      showToast('Erreur lors du chargement des modérations récentes', 'error');
    } finally {
      setIsLoadingLogs(false);
    }
  }, [formatModerationLog, showToast]);

  // Fetch pending articles and moderation logs from Supabase
  useEffect(() => {
    if (isAdmin) {
      fetchPendingArticles();
      fetchModerationLogs();
    }
  }, [isAdmin, fetchPendingArticles, fetchModerationLogs]);

  useEffect(() => {
    if (user && !isAdmin && !hasShownAccessToast) {
      showToast('Accès réservé aux administrateurs', 'error');
      setHasShownAccessToast(true);
      navigate('/');
    }
  }, [user, isAdmin, hasShownAccessToast, navigate, showToast]);

  const logModerationAction = useCallback(
    async (
      articleId: number,
      action: ModerationAction,
      previousStatus: string,
      newStatus: string
    ) => {
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const { data, error } = await supabase
        .from('moderation_logs')
        .insert({
          article_id: articleId,
          moderator: user.id,
          action,
          previous_status: previousStatus,
          new_status: newStatus,
        })
        .select('id, article_id, moderator, action, previous_status, new_status, created_at, articles(title)')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const formattedLog = formatModerationLog(data as RawModerationLog);
        setModerationLogs((prevLogs) =>
          [formattedLog, ...prevLogs.filter((log) => log.id !== formattedLog.id)].slice(0, 10)
        );
      } else {
        await fetchModerationLogs();
      }
    },
    [fetchModerationLogs, formatModerationLog, user]
  );

  // Handler to approve an article with optimistic UI
  const handleApprove = async (id: number) => {
    // Add to loading state
    setLoadingActions((prev) => new Set(prev).add(id));

    // Store original article for rollback
    const originalArticle = articles.find((a) => a.id === id);
    if (!originalArticle) return;

    // Optimistic update
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === id ? { ...article, status: 'approved' as const } : article
      )
    );
    setPendingCount((prev) => Math.max(0, prev - 1));

    try {
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const publishAt = originalArticle.publish_at || new Date().toISOString();

      const { error } = await supabase
        .from('articles')
        .update({
          status: 'approved',
          publish_at: publishAt,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await logModerationAction(id, 'approved', originalArticle.status, 'approved');
      showToast('Article approuvé avec succès', 'success');

      // Remove from pending list after success
      setArticles((prevArticles) => prevArticles.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);

      // Rollback on error
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === id ? originalArticle : article
        )
      );
      setPendingCount((prev) => prev + 1);

      try {
        await supabase
          .from('articles')
          .update({
            status: originalArticle.status,
            publish_at: originalArticle.publish_at ?? null,
          })
          .eq('id', id);
      } catch (restoreError) {
        console.error('Erreur lors de la restauration du statut de l\'article:', restoreError);
      }

      showToast('Erreur lors de l\'approbation de l\'article', 'error');
    } finally {
      // Remove from loading state
      setLoadingActions((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Handler to reject an article with optimistic UI
  const handleReject = async (id: number) => {
    // Add to loading state
    setLoadingActions((prev) => new Set(prev).add(id));

    // Store original article for rollback
    const originalArticle = articles.find((a) => a.id === id);
    if (!originalArticle) return;

    // Optimistic update
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === id ? { ...article, status: 'rejected' as const } : article
      )
    );
    setPendingCount((prev) => Math.max(0, prev - 1));

    try {
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const { error } = await supabase
        .from('articles')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await logModerationAction(id, 'rejected', originalArticle.status, 'rejected');
      showToast('Article rejeté', 'success');

      // Remove from pending list after success
      setArticles((prevArticles) => prevArticles.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      
      // Rollback on error
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === id ? originalArticle : article
        )
      );
      setPendingCount((prev) => prev + 1);

      try {
        await supabase
          .from('articles')
          .update({
            status: originalArticle.status,
            publish_at: originalArticle.publish_at ?? null,
          })
          .eq('id', id);
      } catch (restoreError) {
        console.error('Erreur lors de la restauration du statut de l\'article:', restoreError);
      }

      showToast('Erreur lors du rejet de l\'article', 'error');
    } finally {
      // Remove from loading state
      setLoadingActions((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <AdminSidebar activeItem="articles" />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <AdminTopbar title="Admin Dashboard" />
        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
              Articles en attente de validation {pendingCount > 0 && `(${pendingCount})`}
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12 text-black/60 dark:text-white/60">
                Aucun article en attente de validation
              </div>
            ) : (
              <ArticlesTable
                articles={articles}
                onApprove={handleApprove}
                onReject={handleReject}
                loadingActions={loadingActions}
              />
            )}
          </section>
          <section>
            <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Modérations récentes</h3>
            <div className="rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-background-dark">
              {isLoadingLogs ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent" />
                </div>
              ) : moderationLogs.length === 0 ? (
                <p className="py-6 text-center text-sm text-black/60 dark:text-white/60">
                  Aucune modération récente
                </p>
              ) : (
                <ul className="divide-y divide-black/10 dark:divide-white/10">
                  {moderationLogs.map((log) => (
                    <li key={log.id} className="flex items-start justify-between gap-4 px-6 py-4">
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {log.action === 'approved' ? 'Article approuvé' : 'Article rejeté'}
                        </p>
                        <p className="text-sm text-black/60 dark:text-white/60">
                          {log.articleTitle}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-wide text-black/40 dark:text-white/40">
                          {log.previousStatus} → {log.newStatus}
                        </p>
                      </div>
                      <div className="text-right text-sm text-black/60 dark:text-white/60">
                        <p>{new Date(log.createdAt).toLocaleString('fr-FR')}</p>
                        <p className="text-xs text-black/40 dark:text-white/40">Modérateur : {log.moderator}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
