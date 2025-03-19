'use client';
import VivDataGrid from '@/components/VivDataGrid';
import { IUserDetailDTO } from '@/dtos/i-userdetail-dto';
import { useAuth } from '@/lib/AuthContext';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

export default function AccountList() {
  const title = '회원관리';
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
      field: 'phoneNember',
      headerName: '전화번호',
      width: 200,
      filterable: true,
      type: 'string',
      valueGetter: (params: string) => params ?? '없음',
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
      title={title}
      columns={columns}
      initialData={data}
    />
  );
}

/*
export default function AccountList() {
  const { fetchUsers, isAdmin, user, loading } = useAuth();
  const [users, setUsers] = useState<IUserDetailDTO[]>([]);
  const [error, setError] = useState<string | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const waitForLoading = useCallback(
    () =>
      new Promise((resolve) => {
        if (!loading) resolve(true);
        else setTimeout(() => resolve(waitForLoading()), 100);
      }),
    [loading]
  );

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      await waitForLoading();
      if (!user) {
        setError('로그인 필요');
        setIsLoading(false);
        return;
      }
      if (!isAdmin()) {
        setError('관리자만 접근가능');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedUsers = await fetchUsers();
        if (isMounted) {
          setUsers(fetchedUsers);
          setError(undefined);
        }
      } catch (err: any) {
        setError(err?.message);
      } finally {
        if (isMounted) {
          setIsLoading(false); // 즉시 로딩 해제
        }
      }
    };

    loadUsers(); // 한 번만 호출

    return () => {
      isMounted = false;
    };
  }, [fetchUsers, isAdmin, user, loading, waitForLoading]); // users 제거

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
      field: 'emailConfirmed', // 필드명 수정 (emailConfirm → emailConfirmed)
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
      valueGetter: (params: string[]) => {
        return params.join(', ');
      },
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-red-600">{error ?? <p>{error}</p>}</div>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <Box sx={{ height: 'auto', width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 25, 50, 100]}
            disableRowSelectionOnClick
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: 'primary.light',
              cursor: 'pointer',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
          />
        </Box>
      )}
    </div>
  );
}
 */
