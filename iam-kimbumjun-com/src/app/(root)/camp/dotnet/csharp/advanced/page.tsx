'use client'

import IncrementalCodeLoader from '@/components/IncrementalCodeLoader';
import VivTitle from '@/components/VivTitle';
import { ICategory } from '@/interfaces/i-category';
import { fetchCategories } from '@/lib/fetchCategories';
import { useEffect, useState } from 'react';
import { CircularProgress, Box, Alert } from '@mui/material'; // 로딩, 에러 표시 개선

export default function Page() {
    // 초기 상태를 빈 배열([])로 설정하거나, 로딩 완료를 명확히 추적
    const [categories, setCategories] = useState<ICategory[]>([]); // 빈 배열로 초기화
    const [loading, setIsLoading] = useState<boolean>(true); // 초기 로딩 상태는 true
    const [error, setError] = useState<string | null>(null); // 에러 상태 추가

    useEffect(() => {
        let isMounted = true; // 컴포넌트 마운트 상태 추적 (클린업용)

        const fetchData = async () => {
            setIsLoading(true); // 로딩 시작
            setError(null); // 이전 에러 초기화

            try {
                const result = await fetchCategories();
                if (isMounted) { // 컴포넌트가 마운트된 상태일 때만 상태 업데이트
                    setCategories(result || []); // API가 null을 반환할 경우 빈 배열로 처리
                }
            } catch (err: any) {
                console.error("카테고리 로딩 오류:", err.message);
                if (isMounted) {
                    setError("카테고리 정보를 불러오는 데 실패했습니다.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        // 클린업 함수: 컴포넌트 언마운트 시 isMounted를 false로 설정
        return () => {
            isMounted = false;
        };
    }, []); // 빈 배열: 마운트 시 한 번만 실행

    return (
        <>
            <VivTitle title='C# Advanced' />

            {/* 로딩 중일 때 표시 */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <CircularProgress />
                </Box>
            )}

            {/* 에러 발생 시 표시 */}
            {error && !loading && (
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}

            {/* 로딩 완료 및 에러 없을 때 IncrementalCodeLoader 렌더링 */}
            {/* categories가 빈 배열일 수 있으므로 null/undefined 체크 대신 로딩/에러 상태로 판단 */}
            {!loading && !error && (
                // categories! 대신 categories를 그대로 전달 (IncrementalCodeLoader 내부에서 categories가 비어있을 때 처리 필요 시 추가)
                <IncrementalCodeLoader categories={categories} categoryId={1} />
            )}
        </>
    );
}
