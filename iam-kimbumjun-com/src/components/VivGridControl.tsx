'use client';
import { DataGrid, GridColDef, GridPaginationModel, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Box, Tooltip } from '@mui/material';
import { ICode } from '@/interfaces/i-code';
import { getCategories } from '@/lib/getCodes';
import { ICategory } from '@/interfaces/i-category';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Link from 'next/link';
import VivLoading from '@/components/VivLoading';
import { useEffect, useState } from 'react';
import { isAdmin, userDetail } from '@/services/auth.service';

export default function VivGridControl({ data }: { data: ICode[] }) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [codes, setCodes] = useState<ICode[]>(
    [...data].sort((a, b) => b.id - a.id)
  );
  const [id, setId] = useState<string | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const admin: boolean = isAdmin();
  const detail = userDetail();
  const time = 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { categories } = await getCategories();
        setCategories(categories);
        const sortedCodes = [...data].sort((a, b) => b.id - a.id);
        setCodes(sortedCodes);

        // if (userId)
        //   setId(userId);


      } catch (error: any) {
        console.error('카테고리 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [data]);


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
    <>
      {isLoading ? (
        <VivLoading params={{ choice: time }} />
      ) : (
        <Box sx={{ height: 'calc(100vh-200px)', width: '100%' }}>
          <DataGrid
            rows={codes}
            columns={columns}
            loading={isLoading}
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
                  id: false
                }
              }
            }}
          />
        </Box>
      )}
    </>
  )
}

