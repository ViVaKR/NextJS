'use client';
import { DataGrid, GridColDef, GridPaginationModel, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Box, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { ICode } from '@/interfaces/i-code';
import { getCategories } from '@/lib/getCodes';
import { ICategory } from '@/interfaces/i-category';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Link from 'next/link';
import VivLoading from '@/components/VivLoading';
import { useEffect, useState } from 'react';
import { isAdmin, userDetail } from '@/services/auth.service';

type codeDataProp = {
  data: ICode[],
  userId?: string
}

export default function VivGridControl({ data, userId }: codeDataProp) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [codes, setCodes] = useState<ICode[]>(
    [...data].sort((a, b) => b.id - a.id)
  );
  const [id, setId] = useState<string | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const admin: boolean = isAdmin();

  const whoami = userDetail();
  const time = 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { categories } = await getCategories();
        setCategories(categories);
        const sortedCodes = [...data].sort((a, b) => b.id - a.id);
        setCodes(sortedCodes);

        if (userId)
          setId(userId);


      } catch (error: any) {
        console.error('카테고리 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [data, userId]);

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
      type: 'string',
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
      filterable: false,
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
            slots={(admin || id === userId) ? { toolbar: GridToolbar } : {}}
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
      )}
    </>
  )
}

