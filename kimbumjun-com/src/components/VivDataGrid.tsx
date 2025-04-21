'use client';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import VivTitle from './VivTitle';

interface VivDataGridProps<T> {
  title?: string;
  columns: GridColDef[];
  initialData?: T[]; // 초기 데이터 (선택적)
  onRowClick?: (params: GridRowParams) => void; // 행클릭 핸들러 추가
}

export default function VivDataGrid<T>({
  title,
  columns,
  initialData = [],
  onRowClick,
}: VivDataGridProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [error, setError] = useState<string | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        let fetchedData: T[] = initialData; // 초기 데이터 사용
        setData(fetchedData);
        setError(undefined);
      } catch (err: any) {
        setError(err?.message);
      } finally {
        setIsLoading(false); // 즉시 로딩 해제
      }
    };

    loadData(); // 한 번만 호출
  }, [initialData]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-red-600">{error ?? <p>{error}</p>}</div>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <Box
          sx={{
            height: 'auto',
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
          }}>
          {title ? <VivTitle title={title ?? ''} /> : <></>}
          <DataGrid
            rows={data}
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
            onRowClick={onRowClick} // DataGrid 에 onRowClick 연결
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
