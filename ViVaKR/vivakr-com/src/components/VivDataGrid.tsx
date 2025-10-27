'use client';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import VivTitle from './VivTitle';

interface VivDataGridProps<T> {
  title?: string;
  columns: GridColDef[];
  initialData?: T[];
  onRowClick?: (params: GridRowParams) => void;
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
        let fetchedData: T[] = initialData;
        setData(fetchedData);
        setError(undefined);
      } catch (err: any) {
        setError(err?.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
            showToolbar
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              columns: {
                columnVisibilityModel: {
                  id: true
                }
              }
            }}
            pageSizeOptions={[5, 10, 15, 25, 50, 100]}
            disableRowSelectionOnClick
            onRowClick={onRowClick}
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
