'use client';

import { getCategories } from '@/lib/getCodes';
import { ICategory } from '@/interfaces/i-category';
import {
  Box,
  Container,
  CssBaseline,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import VivTitle from '@/components/VivTitle';
import VivLoading from '@/components/VivLoading';
import SaveAsTwoToneIcon from '@mui/icons-material/SaveAsTwoTone';

const CodeCategory = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState<ICategory>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function handleSaveData() {
    //
  }

  // 데이터 가져오기 함수
  const fetchCategories = useCallback(async (signal: AbortSignal) => {
    let isMounted = true;
    try {
      setIsLoading(true);
      const { categories } = await getCategories(signal); // signal 전달
      if (isMounted) {
        const sortedCategories = [...categories].sort((a, b) => a.id - b.id);
        setCategories(sortedCategories);
        setCategory(sortedCategories[0]);
        setError(null);
      }
    } catch (error: any) {
      if (isMounted && error.name !== 'AbortError') {
        // 요청 취소 에러는 무시
        setError('Failed to load categories. Please try again.');
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
    return () => {
      isMounted = false; // 클린업
    };
  }, []);

  // 최초 마운트 시 데이터 가져오기
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // fetchCategories(signal);
    fetchCategories(signal);

    return () => {
      controller.abort(); // 언마운트 시 요청 취소
    };
  }, [fetchCategories]);

  const handleEdit = (id: number, name: string) => {
    setCategory({ id, name });
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
      field: 'name',
      headerName: '분류명',
      width: 300,
      filterable: true,
      type: 'string',
      renderCell: (params: GridRenderCellParams<ICategory, string>) => (
        <button
          onClick={() => handleEdit(params.row.id, params.row.name)}
          className="text-slate-600 hover:text-sky-800 cursor-pointer">
          {params.value}
        </button>
      ),
      /*
            --> interface GridRenderCellParams<TRow = any, TValue = any> {
            --> row: TRow;              // 해당 행의 전체 데이터 타입
            --> value: TValue;           // 셀의 값 타입
            --> id: GridRowId;          // 행의 고유 ID
            --> field: string;          // 컬럼의 필드 이름
            --> ETC (api, colDef 등)

            --> : renderCell: (params)  // 생각가능
}

            */
    },
  ];

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <VivTitle title="코드 카테고리" />
        {error && <p className="text-center text-red-500">{error}</p>}
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
          noValidate
          autoComplete="off">
          <div className="flex justify-end items-center gap-4 w-full text-slate-400">
            <TextField
              id="filled-basic"
              label={category?.id ?? 'Category'}
              variant="filled"
              sx={{ width: '100%' }}
              value={category?.name ?? ''}
            />

            <IconButton onClick={handleSaveData}>
              <SaveAsTwoToneIcon />
            </IconButton>
          </div>
        </Box>

        <Box
          sx={{
            bgcolor: 'var(--color-slate-50)',
            width: '100%',
            height: 800,
          }}>
          <Box sx={{ height: 800, width: '100%' }}>
            {isLoading ? (
              <VivLoading params={{ choice: 2 }} />
            ) : (
              <DataGrid
                rows={categories}
                columns={columns}
              />
            )}
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default CodeCategory;
