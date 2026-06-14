'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProfileTemplate } from '../../components/templates/profile-template';
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from '../../lib/config/auth-storage';
import { getMyLists, logout, me } from '../../lib/api';
import type { AuthMeUser } from '../../types/auth';
import type { UserList } from '../../types/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthMeUser | null>(null);
  const [lists, setLists] = useState<UserList[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const session = getAuthSession();

    if (!session.accessToken) {
      router.replace('/login');
      return;
    }

    let isActive = true;

    async function loadProfile() {
      try {
        const accessToken = session.accessToken!;
        const [currentUser, currentLists] = await Promise.all([
          me(accessToken),
          getMyLists(accessToken).catch(() => []),
        ]);

        if (!isActive) return;

        saveAuthSession(accessToken, currentUser);
        setAccessToken(accessToken);
        setUser(currentUser);
        setLists(currentLists);
      } catch {
        clearAuthSession();
        router.replace('/login');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
    } finally {
      clearAuthSession();
      router.replace('/login');
    }
  }

  if (loading || !user || !accessToken) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          Loading profile...
        </div>
      </main>
    );
  }

  return (
    <ProfileTemplate
      accessToken={accessToken}
      loggingOut={loggingOut}
      lists={lists}
      onLogout={handleLogout}
      user={user}
    />
  );
}
