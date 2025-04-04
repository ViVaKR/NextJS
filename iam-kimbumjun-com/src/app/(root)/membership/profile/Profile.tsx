// src/app/(membership)/profile/Profile.tsx
'use client';
import { useAuth } from '@/lib/AuthContext';
import { IUser } from '@/interfaces/i-user';

export function useProfile() {
  const { user, loading, isAdmin, updateUser } = useAuth();
  return {
    user: user as IUser | null, // IUser와 호환되도록 가정
    isLoading: loading,
    error: null,
    isAdmin,
    updateUser, // * 추가됨
  };
}
