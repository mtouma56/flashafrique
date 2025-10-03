import React from 'react';
import StatusBadge from './StatusBadge';
import type { StatusType } from './StatusBadge';

export interface Article {
  id: number;
  title: string;
  author: string;
  category: string;
  status: StatusType;
  publish_at?: string | null;
}

interface ArticlesTableProps {
  articles: Article[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  loadingActions?: Set<number>;
}

const ArticlesTable: React.FC<ArticlesTableProps> = ({ 
  articles, 
  onApprove, 
  onReject, 
  loadingActions = new Set() 
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark">
      <table className="w-full text-sm text-left">
        <thead className="bg-black/5 dark:bg-white/5">
          <tr>
            <th className="px-6 py-3 font-medium text-black dark:text-white" scope="col">
              Title
            </th>
            <th className="px-6 py-3 font-medium text-black dark:text-white" scope="col">
              Author
            </th>
            <th className="px-6 py-3 font-medium text-black dark:text-white" scope="col">
              Category
            </th>
            <th className="px-6 py-3 font-medium text-black dark:text-white" scope="col">
              Status
            </th>
            <th className="px-6 py-3 font-medium text-black dark:text-white" scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr
              key={article.id}
              className="border-t border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <td className="px-6 py-4 text-black dark:text-white">{article.title}</td>
              <td className="px-6 py-4 text-black/60 dark:text-white/60">{article.author}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
                  {article.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={article.status} />
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {article.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(article.id)}
                        disabled={loadingActions.has(article.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Approve article: ${article.title}`}
                      >
                        {loadingActions.has(article.id) ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>En cours...</span>
                          </span>
                        ) : (
                          'Approuver'
                        )}
                      </button>
                      <button
                        onClick={() => onReject(article.id)}
                        disabled={loadingActions.has(article.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-500/80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Reject article: ${article.title}`}
                      >
                        {loadingActions.has(article.id) ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>En cours...</span>
                          </span>
                        ) : (
                          'Rejeter'
                        )}
                      </button>
                    </>
                  )}
                  {article.status !== 'pending' && (
                    <span className="px-4 py-2 text-sm text-black/40 dark:text-white/40">
                      {article.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticlesTable;
