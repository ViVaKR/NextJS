// components/IncrementalCodeLoader.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react'; // useRef 추가
import { Box, Button, CircularProgress, Typography, Alert, Link as MuiLink, Tooltip, styled, TooltipProps, tooltipClasses } from '@mui/material';
import { ICode } from '@/interfaces/i-code';
import { IIncrementalResult } from '@/interfaces/i-incremental-result';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Link from 'next/link';
import { isAdmin } from '@/services/auth.service';

const CHUNK_SIZE = 20;
interface IncrementalCodeLoaderProps {
    categoryName: string;
    categoryId: number;
}

export default function IncrementalCodes({ categoryName, categoryId }: IncrementalCodeLoaderProps) {
    const [allLoadedCodes, setAllLoadedCodes] = useState<ICode[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentOffset, setCurrentOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    const admin: boolean = isAdmin();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // 초기 로드가 이미 시작되었는지 추적하기 위한 ref
    const initialLoadInitiated = useRef(false);

    const loadMoreCodes = useCallback(async (isInitialLoad = false) => { // 초기 로드인지 구분하는 플래그 추가 (선택 사항)
        if (isLoading || isComplete || !apiUrl) {
            return;
        }
        setIsLoading(true); // 로딩 상태를 먼저 true로 설정
        setError(null);

        try {
            const url = `${apiUrl}/api/code/all-incremental?offset=${currentOffset}&limit=${CHUNK_SIZE}&categoryId=${categoryId}`;
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`데이터 청크 로드 실패: ${response.status} ${response.statusText}. 응답: ${errorBody}`);
            }

            const result: IIncrementalResult<ICode> = await response.json();

            setAllLoadedCodes((prevCodes) => {
                const existingIds = new Set(prevCodes.map(c => c.id));

                const newUniqueItems = result.items.filter(item => !existingIds.has(item.id));

                if (newUniqueItems.length < result.items.length) {
                    console.warn("[loadMoreCodes] Duplicate items filtered out during state update.");
                }
                return [...prevCodes, ...newUniqueItems].sort((a, b) => b.id - a.id);
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

    const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} arrow placement='left' />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 500,
        },
    });

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
                <Link href={`/code/read/${params.row.id}`}>{params.value}</Link>
            ),
        },
        {
            field: 'subTitle',
            headerName: '부제목',
            minWidth: 200,
            width: 350,
            maxWidth: 600,
            filterable: true,
            type: 'string',
            renderCell: (params: GridRenderCellParams<ICode, string>) => (
                <Link href={`/code/read/${params.row.id}`}>{params.value}</Link>
            ),
        },
        {
            field: 'categoryId',
            headerName: '카테고리',
            width: 200,
            filterable: false,
            type: 'string',
            renderCell: (params: GridRenderCellParams<ICode, number>) => (
                <Link href={`/code/read/${params.row.id}`}>{params.value}. {categoryName}</Link>
            )
        },
        { field: 'userName', headerName: '작성자', width: 150, filterable: true },
        {
            field: 'created',
            headerName: '등록일',
            width: 150,
            filterable: true,
            valueGetter: (params: Date) => {
                const d = new Intl.DateTimeFormat('ko-KR').format(new Date(params));
                return d;
            },
        },
        {
            field: 'modified',
            headerName: '수정일',
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
        {
            field: 'note',
            headerName: '노트',
            width: 350,
            filterable: true,
            flex: 1,
            type: 'string',
            renderCell: (params: GridRenderCellParams<ICode, string>) => (
                <CustomWidthTooltip title={params.row.note}>
                    <Link href={`/code/read/${params.row.id}`}>{params.value}</Link>
                </CustomWidthTooltip>
            ),
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
                    slots={(admin) ? { toolbar: GridToolbar } : {}}
                    pageSizeOptions={[5, 10, 15, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        },
                        columns: {
                            columnVisibilityModel: {

                                categoryId: false,
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
