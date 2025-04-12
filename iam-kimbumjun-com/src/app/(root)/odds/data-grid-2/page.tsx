'use client';
// src/app/(root)/odds/data-grid-2/page.tsx
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import { useAuth } from '@/lib/AuthContext';
import { GridColDef } from '@mui/x-data-grid';
import VivDataGrid from '@/components/VivDataGrid';
import { useEffect, useState } from 'react';

export default function AccountList() {
  const { fetchUsers } = useAuth();
  const [data, setData] = useState<IUserDetailDTO[]>([]);

  useEffect(() => {
    const getData = async () => {
      setData(await fetchUsers());
    };

    getData();
  }, [fetchUsers]);

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: '아이디',
      width: 300,
      filterable: true,
      type: 'string',
      headerAlign: 'center',
    },
    {
      field: 'fullName',
      headerName: '이름',
      width: 150,
      filterable: true,
      type: 'string',
    },
    {
      field: 'emailConfirmed',
      headerName: '인증',
      width: 100,
      filterable: true,
      type: 'boolean',
    },
    {
      field: 'roles',
      headerName: '권한',
      width: 400,
      filterable: true,
      type: 'string',
      valueGetter: (params: string[]) =>
        Array.isArray(params) ? params.join(', ') : '',
    },
  ];

  return (
    <VivDataGrid<IUserDetailDTO>
      columns={columns}
      initialData={data}
    />
  );
}
