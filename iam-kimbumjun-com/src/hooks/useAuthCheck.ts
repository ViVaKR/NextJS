// src/hooks/useAuthCheck.ts
'use client';
import { useState, useEffect } from 'react';
import { getToken, userDetail } from '@/services/auth.service';

export function useAuthCheck(userId: string) {

    const [canEdit, setCanEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }
        const user = userDetail();
        if (user) {
            const isAdmin = user.roles?.includes('Admin') || false;
            const isAuthor = user.id === userId;
            setCanEdit(isAdmin || isAuthor);
        }
        setLoading(false);
    }, [userId]);
    return [canEdit, loading]
}
