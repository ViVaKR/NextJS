// components/IncrementalCodeLoader.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react'; // useRef 추가
import { Box, Button, CircularProgress, Typography, Alert, Link as MuiLink, Tooltip } from '@mui/material';
import { ICode } from '@/interfaces/i-code';
import { ICategory } from '@/interfaces/i-category';
import { IIncrementalResult } from '@/interfaces/i-incremental-result';
import {
    DataGrid, GridColDef,
    GridRenderCellParams,
    GridToolbarExportContainer
} from '@mui/x-data-grid';
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Link from 'next/link';
import { isAdmin, userDetail } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

const CHUNK_SIZE = 20;
interface IncrementalCodeLoaderProps {
    categories: ICategory[];
    categoryId: number;
}

export default function IncrementalCodeLoader({ categories, categoryId }: IncrementalCodeLoaderProps) {
    const [allLoadedCodes, setAllLoadedCodes] = useState<ICode[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentOffset, setCurrentOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const initialLoadInitiated = useRef(false);
    const [admin, setAdmin] = useState<boolean>(false);
    const router = useRouter();

    // const admin: boolean = isAdmin();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;



    const loadMoreCodes = useCallback(async (isInitialLoad = false) => { // 초기 로드인지 구분하는 플래그 추가 (선택 사항)
        if (isLoading || isComplete || !apiUrl) {
            return;
        }
        setIsLoading(true); // 로딩 상태를 먼저 true로 설정
        setError(null);

        try {
            const url = `${apiUrl}/api/code/all-incremental?offset=${currentOffset}&limit=${CHUNK_SIZE}&categoryId=${categoryId}`;
            console.log(url);
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`데이터 청크 로드 실패: ${response.status} ${response.statusText}. 응답: ${errorBody}`);
            }

            const result: IIncrementalResult<ICode> = await response.json();

            setAllLoadedCodes((prevCodes) => {
                // 상태 업데이트 함수 내에서 중복 제거 (더 안전하게)
                const existingIds = new Set(prevCodes.map(c => c.id));
                const newUniqueItems = result.items.filter(item => !existingIds.has(item.id));
                if (newUniqueItems.length < result.items.length) {
                    console.warn("[loadMoreCodes] Duplicate items filtered out during state update.");
                }
                return [...prevCodes, ...newUniqueItems];
            });
            setTotalCount(result.totalCount);
            const nextOffset = currentOffset + result.items.length; // 실제 받아온 아이템 수 기준
            setCurrentOffset(nextOffset);

            if (nextOffset >= result.totalCount || result.items.length < CHUNK_SIZE) {
                setIsComplete(true);
            }

        } catch (err: any) {
            console.error('데이터 청크 로드 중 오류:', err);
            setError(err.message || '데이터를 로드하는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrl, currentOffset]); // isComplete, isLoading 제거 실험

    // 페이지 로드시 토큰 체크
    useEffect(() => {
        const check = async () => {
            const adminCheck = await isAdmin();
            setAdmin(adminCheck);
        }
        check();
    }, [router, setAdmin])

    // 컴포넌트 마운트 시 첫 데이터 청크 로드 (useRef 사용)
    useEffect(() => {
        if (!initialLoadInitiated.current) {
            if (currentOffset === 0 && !isComplete) {
                loadMoreCodes(true); // 초기 로드임을 명시 (디버깅용)
            }
            initialLoadInitiated.current = true; // 실행되었음을 표시
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 빈 배열: 마운트 시 한 번만 실행하도록 강제 (lint 경고 무시)

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            filterable: true,
            type: 'number',
            renderCell: (params: GridRenderCellParams<ICode, string>) => (
                <Link href={`/code/read/${params.row.id}`}>{params.value}</Link>
            ),
        },
        {
            field: 'title',
            headerName: '제목',
            minWidth: 200,
            width: 350,
            maxWidth: 600,
            filterable: true,
            type: 'string',
            renderCell: (params: GridRenderCellParams<ICode, string>) => (
                <Tooltip title={params.row.subTitle} arrow placement='top'>
                    <Link href={`/code/read/${params.row.id}`}>{params.value}</Link>
                </Tooltip>
            ),
        },
        {
            field: 'categoryId',
            headerName: '카테고리',
            width: 200,
            filterable: true,
            valueGetter: (value, row) => {
                const category = categories.find((category) => category.id === value);
                return category ? category.name : '작자미상';
            },
            type: 'number',
        },
        { field: 'userName', headerName: '작성자', width: 150, filterable: true },
        {
            field: 'modified',
            headerName: '등록일',
            width: 150,
            filterable: true,
            valueGetter: (params: Date) => {
                const d = new Intl.DateTimeFormat('ko-KR').format(new Date(params));
                return d;
            },
        },
        {
            field: 'attachFileName',
            headerName: '첨부',
            width: 80,
            filterable: true,
            renderCell: (params: GridRenderCellParams<ICode, string>) => {
                const attached = params.value === '';
                return attached ? (
                    '-'
                ) : (
                    <Tooltip title={params.row.attachFileName} arrow placement='right'>
                        <AttachFileIcon />
                    </Tooltip>
                );
            },
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Typography variant="caption" sx={{ mb: 1, display: 'block', textAlign: 'right' }}>
                {/* ... */}
            </Typography>
            <Box sx={{ height: 'calc(100vh - 300px)', width: '100%' }}>
                <DataGrid
                    rows={allLoadedCodes}
                    columns={columns}
                    loading={isLoading && allLoadedCodes.length === 0}
                    getRowId={(row) => row.id}
                    hideFooterSelectedRowCount={true}
                    slots={(admin) ? { toolbar: GridToolbarExportContainer } : {}} // GridToolbar
                    pageSizeOptions={[5, 10, 15, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        },
                        columns: {
                            columnVisibilityModel: {
                                id: true
                            }
                        }
                    }}
                />
            </Box>
            <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
                <p className='text-slate-400 text-center my-4'> total: {totalCount} / 현재: {currentOffset} </p>
                {!isComplete && (
                    <Button variant="contained"
                        onClick={() => loadMoreCodes(false)}
                        disabled={isLoading || !apiUrl}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}>
                        {isLoading ? '로딩 중...' : '더 로드하기'}
                    </Button>
                )}

            </Box>
        </Box>
    );
}
