import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import ArticlesTable from '../components/ArticlesTable';
import ActivityItem from '../components/ActivityItem';
import type { Article } from '../components/ArticlesTable';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingActions, setLoadingActions] = useState<Set<number>>(new Set());

  // Fetch pending articles from Supabase
  useEffect(() => {
    fetchPendingArticles();
  }, []);

  const fetchPendingArticles = async () => {
    try {
      setIsLoading(true);
      const { data, error, count } = await supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')
        .order('publish_at', { ascending: true });

      console.log({ count, len: data?.length, error });

      if (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        showToast('Erreur lors du chargement des articles', 'error');
        return;
      }

      if (data) {
        setArticles(data as Article[]);
        setPendingCount(count || 0);
      }
    } catch (err) {
      console.error('Erreur inattendue:', err);
      showToast('Erreur lors du chargement des articles', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // Simple toast implementation - you can replace with a proper toast library
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // Mock recent activity data
  const recentActivities = [
    {
      id: 1,
      icon: 'description',
      title: "Article 'Breaking News: Economic Summit in Abidjan' submitted by Jean-Pierre Kouassi",
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      icon: 'person_add',
      title: 'User Fatou Diallo registered',
      timestamp: '1 day ago',
    },
    {
      id: 3,
      icon: 'rss_feed',
      title: "RSS Feed 'International News' updated",
      timestamp: '3 days ago',
    },
  ];

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
      const publishAt = originalArticle.publish_at || new Date().toISOString();
      
      const { error } = await supabase
        .from('articles')
        .update({ 
          status: 'approved', 
          publish_at: publishAt 
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

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
      const { error } = await supabase
        .from('articles')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) {
        throw error;
      }

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
            <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Recent Activity</h3>
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  icon={activity.icon}
                  title={activity.title}
                  timestamp={activity.timestamp}
                  isLast={index === recentActivities.length - 1}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
