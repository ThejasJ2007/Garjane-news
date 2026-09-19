'use client';

import { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react';
import { createCommentAction, type CommentActionResult } from '@/actions/comments';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeTimeKn } from '@/lib/utils';
import type { Comment, User } from '@/types';

interface CommentWithUser extends Comment {
  user?: Pick<User, 'name' | 'avatar'> | null;
}

interface CommentSectionProps {
  articleId: string;
  allowComments?: boolean;
  comments?: CommentWithUser[];
  language?: 'kn' | 'en';
}

export function CommentSection({
  articleId,
  allowComments = true,
  comments = [],
  language = 'kn',
}: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CommentActionResult | null>(null);

  const approvedComments = comments.filter((c) => c.isApproved);

  if (!allowComments) {
    return (
      <section aria-labelledby="comments-heading" className="mt-12 pt-8 border-t border-garjane-border-light dark:border-garjane-border-dark">
        <div className="p-6 rounded-2xl bg-garjane-background-light/40 dark:bg-garjane-background-dark/40 border border-garjane-border-light dark:border-garjane-border-dark flex items-center gap-3 text-garjane-text-muted text-body-sm">
          <Lock className="w-5 h-5 flex-shrink-0 text-garjane-text-muted" />
          <span>
            {language === 'kn'
              ? 'ಈ ಲೇಖನಕ್ಕೆ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಮುಚ್ಚಲಾಗಿದೆ / Comments are disabled for this article.'
              : 'Comments are disabled for this article.'}
          </span>
        </div>
      </section>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 3) {
      setResult({
        error: language === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆ ಕನಿಷ್ಠ 3 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು' : 'Comment must be at least 3 characters',
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData();
    formData.append('content', content.trim());

    try {
      const res = await createCommentAction(articleId, formData);
      setResult(res);
      if (res.success) {
        setContent('');
      }
    } catch {
      setResult({
        error: language === 'kn' ? 'ದೋಷ ಸಂಭವಿಸಿದೆ. ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.' : 'Network error. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="comments-heading" className="mt-12 pt-8 border-t border-garjane-border-light dark:border-garjane-border-dark">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-garjane-primary" />
        <h2 id="comments-heading" className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
          {language === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆಗಳು' : 'Comments'} ({approvedComments.length})
        </h2>
      </div>

      {/* Submission Feedback */}
      {result?.success && (
        <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 flex items-start gap-3" role="status">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
          <p className="text-body-sm leading-relaxed">{result.message}</p>
        </div>
      )}

      {result?.error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-body-sm flex items-center gap-2" role="alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{result.error}</span>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="comment-input" className="sr-only">
            {language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಬರೆಯಿರಿ' : 'Write your comment'}
          </label>
          <textarea
            id="comment-input"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            placeholder={
              language === 'kn'
                ? 'ನಿಮ್ಮ ಅನಿಸಿಕೆ ಅಥವಾ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಇಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ (ಕನಿಷ್ಠ 3 ಅಕ್ಷರಗಳು)...'
                : 'Share your thoughts or comment on this story...'
            }
            className="w-full px-4 py-3 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body resize-y"
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-caption text-garjane-text-muted">
            {content.length} / 2000 {language === 'kn' ? 'ಅಕ್ಷರಗಳು' : 'characters'}
          </span>
          <Button
            type="submit"
            disabled={isSubmitting || content.trim().length < 3}
            size="md"
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'kn' ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{language === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ' : 'Post Comment'}</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {approvedComments.length > 0 ? (
          approvedComments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 rounded-2xl bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <Avatar
                  src={comment.user?.avatar || null}
                  name={comment.user?.name || (language === 'kn' ? 'ಓದುಗರು' : 'Reader')}
                  size="sm"
                />
                <div>
                  <h4 className="font-semibold text-body-sm text-garjane-text-primary dark:text-garjane-text-inverse">
                    {comment.user?.name || (language === 'kn' ? 'ಗರ್ಜನೆ ಓದುಗರು' : 'Garjane Reader')}
                  </h4>
                  <span className="text-caption text-garjane-text-muted">
                    {formatRelativeTimeKn(comment.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-body text-garjane-text-secondary dark:text-garjane-text-muted whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 px-4 rounded-2xl bg-garjane-background-light/30 dark:bg-garjane-background-dark/30 text-garjane-text-muted">
            <p className="text-body-sm">
              {language === 'kn'
                ? 'ಇನ್ನೂ ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆಗಳಿಲ್ಲ. ನಿಮ್ಮ ಅನಿಸಿಕೆಯನ್ನು ಮೊದಲಾಗಿ ಹಂಚಿಕೊಳ್ಳಿ!'
                : 'No comments yet. Be the first to share your thoughts!'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
