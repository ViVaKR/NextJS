'use client';
import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetter,
} from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { ICode } from '@/interfaces/i-code';
import { getCodes } from '@/lib/getCodes';
import { ICategory } from '@/interfaces/i-category';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Link from 'next/link';
import VivLoading from '@/components/VivLoading';

export default function GridControl() {
  const [codes, setCodes] = React.useState<ICode[]>([]);
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const time = 1;

  //-->
  React.useEffect(() => {
    //* 마운트 상태 추적
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { codes, categories } = await getCodes();

        if (isMounted) {
          setCodes(codes.sort((a, b) => b.id - a.id));
          setCategories(categories);
        }
      } catch (error: any) {
        console.error('코드 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        //* 로딩 완료
        setTimeout(() => setIsLoading(false), time * 1_000);
      }
    };

    fetchData();
    //* cleanup 함수로 언마운트 시 상태 업데이트 방지
    return () => {
      isMounted = false;
    };

    //* 최초 로딩시에만 상태관리
  }, []);

  const getCombine: GridValueGetter<(typeof codes)[number], unknown> = (
    value,
    row
  ) => {
    return `${row.title || ''} ${row.created || ''}`;
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      filterable: true,
      type: 'number',
    },
    {
      field: 'title',
      headerName: '제목',
      width: 300,
      filterable: true,
      type: 'string',
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <Link href={`/code/read/${params.row.id}`}>{params.value}</Link>
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
      renderCell: (params) => {
        const attached = params.value === ''; // 조건에 따라 아이콘 표시 여부 결정
        return attached ? (
          '-'
        ) : (
          <Link href={`/`}>
            {' '}
            <AttachFileIcon />{' '}
          </Link>
        );
      },
    },
    //* combine
    {
      field: 'combine',
      headerName: '합치기',
      width: 300,
      filterable: true,
      valueGetter: getCombine,
      type: 'string',
    },
  ];

  return (
    <>
      {isLoading ? (
        <VivLoading params={{ choice: time }} />
      ) : (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={codes}
            columns={columns}
          />
        </Box>
      )}
    </>
  );
}
