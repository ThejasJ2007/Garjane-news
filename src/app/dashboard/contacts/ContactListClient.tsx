'use client';

import { useState } from 'react';
import { Mail, Phone, Calendar, CheckCircle2, Clock, Trash2, Tag, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelativeTimeKn } from '@/lib/utils';
import { toggleContactReadAction, deleteContactSubmissionAction } from '@/actions/contact';
import type { ContactSubmission } from '@/types';

interface ContactListClientProps {
  initialSubmissions: ContactSubmission[];
  total: number;
  userRole: string;
}

const topicLabels: Record<string, { kn: string; en: string; variant: 'primary' | 'secondary' | 'warning' | 'danger' }> = {
  tip: { kn: 'ಸುದ್ದಿ ಸುಳಿವು', en: 'News Tip', variant: 'warning' },
  issue: { kn: 'ಸ್ಥಳೀಯ ಸಮಸ್ಯೆ', en: 'Local Issue', variant: 'danger' },
  ad: { kn: 'ಜಾಹೀರಾತು', en: 'Advertisement', variant: 'primary' },
  feedback: { kn: 'ಪ್ರತಿಕ್ರಿಯೆ', en: 'Feedback', variant: 'secondary' },
};

export function ContactListClient({ initialSubmissions, total, userRole }: ContactListClientProps) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = submissions.filter((sub) => {
    if (filterTopic !== 'all' && sub.topic !== filterTopic) return false;
    if (filterStatus === 'unread' && sub.isRead) return false;
    if (filterStatus === 'read' && !sub.isRead) return false;
    return true;
  });

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    const res = await toggleContactReadAction(id, !currentStatus);
    if (res.success) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isRead: !currentStatus } : s))
      );
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ಈ ಸಂದೇಶವನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದೆಯೇ? / Are you sure you want to delete this submission?')) {
      return;
    }
    setLoadingId(id);
    const res = await deleteContactSubmissionAction(id);
    if (res.success) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-body-sm font-medium text-garjane-text-muted">ವಿಷಯ / Topic:</span>
          {['all', 'tip', 'issue', 'ad', 'feedback'].map((topic) => (
            <button
              key={topic}
              onClick={() => setFilterTopic(topic)}
              className={`px-3 py-1 text-caption font-medium rounded-lg transition-colors ${
                filterTopic === topic
                  ? 'bg-garjane-primary text-white'
                  : 'bg-garjane-background-light dark:bg-garjane-background-dark text-garjane-text-secondary hover:text-garjane-primary'
              }`}
            >
              {topic === 'all'
                ? 'ಎಲ್ಲಾ / All'
                : `${topicLabels[topic]?.kn || topic} (${topicLabels[topic]?.en || topic})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-body-sm font-medium text-garjane-text-muted">ಸ್ಥಿತಿ / Status:</span>
          {['all', 'unread', 'read'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-caption font-medium rounded-lg transition-colors ${
                filterStatus === status
                  ? 'bg-garjane-text-primary text-white dark:bg-white dark:text-black'
                  : 'bg-garjane-background-light dark:bg-garjane-background-dark text-garjane-text-secondary'
              }`}
            >
              {status === 'all' ? 'ಎಲ್ಲಾ / All' : status === 'unread' ? 'ಓದದಿರುವ / Unread' : 'ಓದಿದ / Read'}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <EmptyState
          variant="dashboard"
          title="ಯಾವುದೇ ಸಂದೇಶಗಳಿಲ್ಲ"
          description="ಸಾರ್ವಜನಿಕರು ಕಳುಹಿಸಿದ ಸುಳಿವುಗಳು ಅಥವಾ ಸಂದೇಶಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ. / No contact submissions or news tips found."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const topicMeta = topicLabels[sub.topic] || {
              kn: sub.topic,
              en: sub.topic,
              variant: 'secondary' as const,
            };

            return (
              <div
                key={sub.id}
                className={`p-6 rounded-2xl border transition-all ${
                  sub.isRead
                    ? 'bg-garjane-background-card/60 dark:bg-garjane-background-cardDark/60 border-garjane-border-light dark:border-garjane-border-dark opacity-90'
                    : 'bg-garjane-background-card dark:bg-garjane-background-cardDark border-garjane-primary/40 shadow-card'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-headline-4 font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
                        {sub.name}
                      </h3>
                      <Badge variant={topicMeta.variant}>
                        {topicMeta.kn} / {topicMeta.en}
                      </Badge>
                      {!sub.isRead && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-garjane-primary text-white">
                          New
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-caption text-garjane-text-muted flex-wrap">
                      <a
                        href={`tel:${sub.phone}`}
                        className="inline-flex items-center gap-1 hover:text-garjane-primary transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{sub.phone}</span>
                      </a>
                      {sub.email && (
                        <a
                          href={`mailto:${sub.email}`}
                          className="inline-flex items-center gap-1 hover:text-garjane-primary transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{sub.email}</span>
                        </a>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatRelativeTimeKn(sub.createdAt)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button
                      variant={sub.isRead ? 'ghost' : 'outline'}
                      size="sm"
                      disabled={loadingId === sub.id}
                      onClick={() => handleToggleRead(sub.id, sub.isRead)}
                      className="text-caption gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{sub.isRead ? 'ಓದಿಲ್ಲ ಎಂದು ಗುರುತಿಸಿ / Mark unread' : 'ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ / Mark read'}</span>
                    </Button>

                    {userRole === 'ADMIN' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={loadingId === sub.id}
                        onClick={() => handleDelete(sub.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 p-2"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-garjane-background-light dark:bg-garjane-background-dark/80 text-body text-garjane-text-primary dark:text-garjane-text-inverse whitespace-pre-wrap leading-relaxed">
                  {sub.message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
