'use client';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { ICode } from '@/interfaces/i-code';
import { getCategories } from '@/lib/getCodes';
import { ICategory } from '@/interfaces/i-category';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Link from 'next/link';
import VivLoading from '@/components/VivLoading';
import { useEffect, useState } from 'react';
import { fetchCodes } from '@/lib/fetchCodes';

export default function VivGridControl({ data }: { data: ICode[] }) {
  const [codes, setCodes] = useState<ICode[]>(
    [...data].sort((a, b) => b.id - a.id)
  );
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const time = 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { categories } = await getCategories();
        setCategories(categories);

        // 코드 데이터 정렬
        const sortedCodes = [...data].sort((a, b) => b.id - a.id);
        setCodes(sortedCodes);
      } catch (error: any) {
        console.error('카테고리 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [data]); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  // 코드 데이터 정렬
  // useEffect(() => {
  //   const sortedCodes = [...data].sort((a, b) => b.id - a.id);
  //   setCodes(sortedCodes);
  // }, [data]); // data가 변경될 때만 실행

  // 데이터 갱신 함수
  // const refreshData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const freshCodes = await fetchCodes(); // 최신 데이터 가져오기
  //     setCodes([...freshCodes].sort((a, b) => b.id - a.id));
  //   } catch (error: any) {
  //     console.error('데이터 갱신 중 오류 발생:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // 전역 이벤트 리스너로 갱신 트리거
  // useEffect(() => {
  //   const handleRefresh = () => refreshData();
  //   window.addEventListener('refreshCodes', handleRefresh);
  //   return () => window.removeEventListener('refreshCodes', handleRefresh);
  // }, []);

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
      minWidth: 100,
      width: 300,
      maxWidth: 350,
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
          <Link href={`/`}><AttachFileIcon /></Link>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        <VivLoading params={{ choice: time }} />
      ) : (
        <Box sx={{ height: 800, width: '100%' }}>
          <DataGrid
            rows={codes}
            columns={columns}
            pageSizeOptions={[5, 25, 40, 100]}
          />
        </Box>
      )}
    </>
  );
}
