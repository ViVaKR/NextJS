// src/hooks/useAuthCheck.ts
'use client';
import { useState, useEffect } from 'react';
import { getToken, userDetail } from '@/services/auth.service';
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
                    console.warn('Client: Invalid userId provided:', userId);
                    setCanEdit(false);
                    return;
                }
                const token = await getToken();
                if (!token) {
                    setCanEdit(false);
                    router.push('/membership/sign-in');
                    return;
                }

                const userDetailData = await userDetail();
                if (!userDetailData) {
                    setCanEdit(false);
                    router.push('/membership/sign-in');
                }

                const isAdmin = userDetailData?.roles.some((role) => role.toLowerCase() === ROLES.ADMIN);
                const isAuthor = userDetailData?.id === userId;
                setCanEdit(isAdmin || isAuthor);
            } catch (error) {
                setCanEdit(false);
            }
        }
        checkAuth();
    }, [router, userId]);
    return [canEdit, loading]
}
