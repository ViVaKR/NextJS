// src/hooks/useAuthCheck.ts
'use client';
import { useState, useEffect } from 'react';
import { getTokenAsync, userDetailAsync } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

const ROLES = {
    ADMIN: 'admin',
}

type AuthCheckResult = [boolean, boolean];

export function useAuthCheck(userId: string): AuthCheckResult {

    const [canEdit, setCanEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {

                if (!userId || typeof userId !== 'string') {
                    setCanEdit(false);
                    return;
                }
                const token = await getTokenAsync();
                if (!token) {
                    setCanEdit(false);
                    setLoading(false);
                    return;
                }

                const userDetailData = await userDetailAsync();

                if (!userDetailData) {
                    setCanEdit(false);
                    setLoading(false);
                    return;
                }

                const isAdmin = userDetailData?.roles.some((role) => role.toLowerCase() === ROLES.ADMIN) || false;
                const isAuthor = userDetailData?.id === userId;
                setCanEdit(isAdmin || isAuthor);
            } catch (err: any) {
                setCanEdit(false);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, [router, userId]);
    return [canEdit, loading]
}
