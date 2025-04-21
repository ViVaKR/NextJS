'use client';

import { getCategories } from '@/lib/getCodes';
import { ICategory } from '@/interfaces/i-category';
import {
  Box,
  Container,
  CssBaseline,
  FilledInput,
  FormControl,
  IconButton,
  InputLabel,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import VivTitle from '@/components/VivTitle';
import VivLoading from '@/components/VivLoading';
import SaveAsTwoToneIcon from '@mui/icons-material/SaveAsTwoTone';
import { Controller, useForm } from 'react-hook-form';
import { getTokenAsync } from '@/services/auth.service';
import { useSnackbar } from '@/lib/SnackbarContext';

const CodeCategory = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState<ICategory>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showSnackbar } = useSnackbar();

  const fetchCategories = useCallback(async (signal: AbortSignal) => {
    try {
      setIsLoading(true);
      const { categories } = await getCategories(signal);
      const sortedCategories = [...categories].sort((a, b) => a.id - b.id);
      setCategories(sortedCategories);
      setCategory(sortedCategories[0]);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        showSnackbar('Failed to load categories. ' + err.message, 'error');
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal);
    return () => controller.abort();
  }, [fetchCategories]);

  const handleEdit = (id: number, name: string) => {
    setCategory({ id, name });
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, filterable: true, type: 'number' },
    {
      field: 'name',
      headerName: '분류명',
      width: 300,
      filterable: true,
      type: 'string',
      renderCell: (params: GridRenderCellParams<ICategory, string>) => (
        <button
          onClick={() => handleEdit(params.row.id, params.row.name)}
          className="text-slate-600 hover:text-sky-800 cursor-pointer"
        >
          {params.value}
        </button>
      ),
    },
  ];

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ICategory>({
    defaultValues: {
      id: 0,

      name: ''
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: ICategory) => {
    try {
      const token = await getTokenAsync();
      if (!token) throw new Error('로그인이 필요합니다.');
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/category`;

      // 현재 categories에서 최대 id 찾기
      const maxId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) : 0;
      const newId = maxId + 1;

      // payload에 id 포함
      const payload = { id: newId, name: data.name };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || '카테고리 추가 실패');
      }

      const newCategory = { id: result.id || newId, name: data.name }; // 서버에서 id 반환 시 사용
      setCategories((prev) => [...prev, newCategory].sort((a, b) => a.id - b.id));
      reset({ id: 0, name: '' });
      showSnackbar(result.message || '카테고리가 추가되었습니다.', 'success');
    } catch (error: any) {
      showSnackbar(error.message || '카테고리 추가에 실패했습니다.', 'error');
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <VivTitle title="코드 카테고리" />
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormControl variant="filled" className="flex w-full items-center">
            <InputLabel htmlFor="name">카테고리 추가</InputLabel>
            <Controller
              name="name"
              control={control}
              rules={{ required: '카테고리를 입력하여 주세요.' }}
              render={({ field }) => (
                <FilledInput
                  {...field}
                  id="name"
                  name="name"
                  error={!!errors.name}
                  sx={{ width: '100%' }}
                />
              )}
            />
            <IconButton type="submit">
              <SaveAsTwoToneIcon />
            </IconButton>
            {errors.name && <p className="text-center text-red-500">{errors.name.message}</p>}
          </FormControl>
        </form>

        <Box sx={{ bgcolor: 'var(--color-slate-50)', width: '100%', height: 800 }}>
          <Box sx={{ height: 800, width: '100%' }}>
            {isLoading ? (
              <VivLoading params={{ choice: 2 }} />
            ) : (
              <DataGrid rows={categories} columns={columns} />
            )}
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default CodeCategory;
