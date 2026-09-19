'use client';

import { useState } from 'react';
import { Save, Lock, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { updateProfileAction, changePasswordAction } from '@/actions/auth';
import { Button } from '@/components/ui/Button';

interface ProfileFormsProps {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
    role: string;
    bio?: string | null;
    location?: string | null;
    phone?: string | null;
  };
}

export function ProfileForms({ user }: ProfileFormsProps) {
  const [profileMsg, setProfileMsg] = useState<{ success?: boolean; error?: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  async function handleProfileSubmit(formData: FormData) {
    setIsUpdatingProfile(true);
    setProfileMsg(null);
    const res = await updateProfileAction(formData);
    setProfileMsg(res);
    setIsUpdatingProfile(false);
  }

  async function handlePasswordSubmit(formData: FormData) {
    setIsUpdatingPassword(true);
    setPasswordMsg(null);
    const res = await changePasswordAction(formData);
    setPasswordMsg(res);
    setIsUpdatingPassword(false);
  }

  return (
    <div className="space-y-8">
      {/* Profile Details Card */}
      <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark p-8 shadow-card">
        <div className="border-b border-garjane-border-light dark:border-garjane-border-dark pb-6 mb-6">
          <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
            ಖಾತೆ ವಿವರಗಳು / Profile Details
          </h2>
          <p className="text-body-sm text-garjane-text-muted mt-1">
            ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ
          </p>
        </div>

        {profileMsg?.success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-body-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ / Profile updated successfully!</span>
          </div>
        )}

        {profileMsg?.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200 text-body-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>{profileMsg.error}</span>
          </div>
        )}

        <form action={handleProfileSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-body-sm font-medium mb-1.5" htmlFor="name">
                ಪೂರ್ಣ ಹೆಸರು / Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-body"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium mb-1.5" htmlFor="email">
                ಇಮೇಲ್ ವಿಳಾಸ / Email Address (ಬದಲಾಯಿಸಲಾಗದು)
              </label>
              <input
                id="email"
                type="email"
                defaultValue={user.email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-gray-100 dark:bg-gray-800/50 text-garjane-text-muted cursor-not-allowed text-body"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium mb-1.5" htmlFor="location">
                ಸ್ಥಳ / Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                defaultValue={user.location || ''}
                placeholder="ಉದಾ: Nelamangala, Bengaluru"
                className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-body"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium mb-1.5" htmlFor="phone">
                ದೂರವಾಣಿ ಸಂಖ್ಯೆ / Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={user.phone || ''}
                placeholder="+91 98450..."
                className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-body"
              />
            </div>
          </div>

          <div>
            <label className="block text-body-sm font-medium mb-1.5" htmlFor="bio">
              ಕಿರು ಪರಿಚಯ / Short Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={user.bio || ''}
              placeholder="ನಿಮ್ಮ ಕಾರ್ಯವ್ಯಾಪ್ತಿ ಮತ್ತು ಪರಿಚಯ..."
              className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-body"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" className="flex items-center gap-2" disabled={isUpdatingProfile}>
              <Save className="w-4 h-4" /> {isUpdatingProfile ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...' : 'ವಿವರ ಉಳಿಸಿ / Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark p-8 shadow-card">
        <div className="border-b border-garjane-border-light dark:border-garjane-border-dark pb-4 mb-6">
          <h2 className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse flex items-center gap-2">
            <Lock className="w-5 h-5 text-garjane-primary" /> ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾವಣೆ / Change Password
          </h2>
        </div>

        {passwordMsg?.success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-body-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಗಿದೆ / Password changed successfully!</span>
          </div>
        )}

        {passwordMsg?.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200 text-body-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>{passwordMsg.error}</span>
          </div>
        )}

        <form action={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-body-sm font-medium mb-1.5" htmlFor="currentPassword">
              ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್ / Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-body"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium mb-1.5" htmlFor="newPassword">
              ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ / New Password (ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು)
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-body"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium mb-1.5" htmlFor="confirmPassword">
              ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ / Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-body"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="secondary" className="flex items-center gap-2" disabled={isUpdatingPassword}>
              <Shield className="w-4 h-4" /> {isUpdatingPassword ? 'ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...' : 'ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ / Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
