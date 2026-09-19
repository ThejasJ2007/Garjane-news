'use client';

import { useState } from 'react';
import { Send, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { createArticleAction, updateArticleAction } from '@/actions/articles';
import { Button } from '@/components/ui/Button';
import type { Category, Location, ArticleWithRelations } from '@/types';

interface ArticleEditorFormProps {
  categories: Category[];
  locations: Location[];
  article?: ArticleWithRelations | null;
}

export function ArticleEditorForm({ categories, locations, article }: ArticleEditorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(article);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = article
        ? await updateArticleAction(article.id, formData)
        : await createArticleAction(formData);
      if (res && res.error) {
        setError(res.error);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_REDIRECT')) {
        return;
      }
      setError('ದೋಷ ಸಂಭವಿಸಿದೆ ಅಥವಾ ಡೇಟಾಬೇಸ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ. / Error occurred or database unavailable. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-body-sm flex items-center gap-2" role="alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Headlines */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="headlineKn">
            ಕನ್ನಡ ಮುಖ್ಯಾಂಶ / Kannada Headline *
          </label>
          <input
            id="headlineKn"
            name="headlineKn"
            type="text"
            required
            defaultValue={article?.headlineKn || ''}
            placeholder="ಉದಾ: ನೆಲಮಂಗಲ-ತುಮಕೂರು ಹೆದ್ದಾರಿ ವಿಸ್ತರಣೆ ಕಾಮಗಾರಿಗೆ ಚಾಲನೆ..."
            className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
          />
        </div>

        <div>
          <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="headline">
            ಇಂಗ್ಲಿಷ್ ಮುಖ್ಯಾಂಶ / English Headline *
          </label>
          <input
            id="headline"
            name="headline"
            type="text"
            required
            defaultValue={article?.headline || ''}
            placeholder="e.g. Nelamangala Highway Expansion Project Approved..."
            className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
          />
        </div>
      </div>

      {/* Category & Location & Breaking */}
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="categoryId">
            ವರ್ಗ / Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={article?.categoryId || categories[0]?.id || ''}
            className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameKn ? `${c.nameKn} (${c.name})` : c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="locationId">
            ಸ್ಥಳ / Location
          </label>
          <select
            id="locationId"
            name="locationId"
            defaultValue={article?.locationId || ''}
            className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
          >
            <option value="">ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ / None</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nameKn ? `${l.nameKn} (${l.name})` : l.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="breakingLevel">
            ಬ್ರೇಕಿಂಗ್ ಹಂತ / Breaking Level
          </label>
          <select
            id="breakingLevel"
            name="breakingLevel"
            defaultValue={article?.breakingLevel || 'NORMAL'}
            className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
          >
            <option value="NORMAL">ಸಾಮಾನ್ಯ ಸುದ್ದಿ / Normal</option>
            <option value="BREAKING">ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್ / Breaking News</option>
            <option value="URGENT">ತುರ್ತು / Urgent</option>
          </select>
        </div>
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="featuredImage">
          ಮುಖಚಿತ್ರ URL / Featured Image URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-garjane-text-muted">
            <ImageIcon className="w-5 h-5" />
          </div>
          <input
            id="featuredImage"
            name="featuredImage"
            type="url"
            defaultValue={article?.featuredImage || ''}
            placeholder="https://images.unsplash.com/..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="summaryKn">
            ಕನ್ನಡ ಸಾರಾಂಶ / Kannada Summary
          </label>
          <textarea
            id="summaryKn"
            name="summaryKn"
            rows={3}
            defaultValue={article?.summaryKn || ''}
            placeholder="ಲೇಖನದ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ..."
            className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body resize-y"
          />
        </div>

        <div>
          <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="summary">
            ಇಂಗ್ಲಿಷ್ ಸಾರಾಂಶ / English Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            defaultValue={article?.summary || ''}
            placeholder="Brief summary in English..."
            className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body resize-y"
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="contentKn">
            ಕನ್ನಡ ಲೇಖನ ವಿವರ / Kannada Content *
          </label>
          <textarea
            id="contentKn"
            name="contentKn"
            rows={8}
            defaultValue={article?.contentKn || ''}
            placeholder="ಸಂಪೂರ್ಣ ಸುದ್ದಿ ವಿವರಗಳು..."
            className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body font-mono text-body-sm resize-y"
          />
        </div>

        <div>
          <label className="block text-body-sm font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2" htmlFor="content">
            ಇಂಗ್ಲಿಷ್ ಲೇಖನ ವಿವರ / English Content *
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={8}
            defaultValue={article?.content || ''}
            placeholder="Full article content in English (min 50 characters)..."
            className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body font-mono text-body-sm resize-y"
          />
        </div>
      </div>

      {/* Toggles & Options */}
      <div className="p-5 rounded-2xl bg-garjane-background-light/40 dark:bg-garjane-background-dark/40 border border-garjane-border-light dark:border-garjane-border-dark grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            value="true"
            defaultChecked={article?.isFeatured || false}
            className="rounded text-garjane-primary"
          />
          <span className="font-medium">ಪ್ರಮುಖ ಸುದ್ದಿ (Featured)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isEditorPick"
            value="true"
            defaultChecked={article?.isEditorPick || false}
            className="rounded text-garjane-primary"
          />
          <span className="font-medium">ಸಂಪಾದಕರ ಆಯ್ಕೆ (Editor&apos;s Pick)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isLive"
            value="true"
            defaultChecked={article?.isLive || false}
            className="rounded text-garjane-primary"
          />
          <span className="font-medium">ಲೈವ್ ಅಪ್‌ಡೇಟ್ (Live News)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="allowComments"
            value="true"
            defaultChecked={article ? article.allowComments : true}
            className="rounded text-garjane-primary"
          />
          <span className="font-medium">ಪ್ರತಿಕ್ರಿಯೆಗೆ ಅವಕಾಶ (Comments)</span>
        </label>
      </div>

      {/* Status & Submit */}
      <div className="flex items-center justify-between pt-6 border-t border-garjane-border-light dark:border-garjane-border-dark flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <label className="text-body-sm font-semibold" htmlFor="status">ಪ್ರಕಟಣೆ ಸ್ಥಿತಿ / Status:</label>
          <select
            id="status"
            name="status"
            defaultValue={article?.status || 'PUBLISHED'}
            className="px-4 py-2 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-card dark:bg-garjane-background-cardDark text-body-sm font-medium"
          >
            <option value="PUBLISHED">ತಕ್ಷಣ ಪ್ರಕಟಿಸಿ (Publish Now)</option>
            <option value="DRAFT">ಕರಡಾಗಿ ಉಳಿಸಿ (Save Draft)</option>
          </select>
        </div>

        <Button
          type="submit"
          className="px-8 py-3 text-body-lg font-semibold flex items-center gap-2 shadow-lg shadow-garjane-primary/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            isEditing ? 'ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ... / Updating...' : 'ಪ್ರಕಟಿಸಲಾಗುತ್ತಿದೆ... / Publishing...'
          ) : (
            <>
              <Send className="w-5 h-5" /> {isEditing ? 'ಲೇಖನ ನವೀಕರಿಸಿ / Update Article' : 'ಲೇಖನ ಪ್ರಕಟಿಸಿ / Submit Article'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
