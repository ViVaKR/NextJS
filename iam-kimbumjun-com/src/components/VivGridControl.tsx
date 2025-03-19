'use client';
import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { ICode } from '@/interfaces/i-code';
import { getCategories } from '@/lib/getCodes';
import { ICategory } from '@/interfaces/i-category';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Link from 'next/link';
import VivLoading from '@/components/VivLoading';

export default function VivGridControl({ data }: { data: ICode[] }) {
  const [codes, setCodes] = React.useState<ICode[]>(
    [...data].sort((a, b) => b.id - a.id)
  );
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const time = 1;

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { categories } = await getCategories();
        setCategories(categories);
      } catch (error: any) {
        console.error('카테고리 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  // 코드 데이터 정렬
  React.useEffect(() => {
    const sortedCodes = [...data].sort((a, b) => b.id - a.id);
    setCodes(sortedCodes);
  }, [data]); // data가 변경될 때만 실행

  //

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
          <Link href={`/`}>
            {' '}
            <AttachFileIcon />{' '}
          </Link>
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
            // autosizeOptions={{
            //   columns: [
            //     'id',
            //     'title',
            //     'categorId',
            //     'userName',
            //     'attachFileName',
            //     'modified',
            //   ],
            //   includeOutliers: true,
            //   includeHeaders: false,
            // }}
            pageSizeOptions={[5, 25, 40, 100]}
          />
        </Box>
      )}
    </>
  );
}

/*
  React.useEffect(() => {
    //* 마운트 상태 추적
    let isMounted = true;

    const fetchCategoriesOnce = async () => {
      try {
        setIsLoading(true);
        const { categories } = await getCategories();
        if (isMounted) {
          setCategories(categories);
        }
      } catch (error: any) {
        console.error('코드 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setTimeout(() => setIsLoading(false), time * 1_000);
      }
    };

    if (categories.length === 0) {
      fetchCategoriesOnce(); // 카테고리가 없으면 한 번만 페칭
    }

    if (isMounted) {
      setCodes([...data].sort((a, b) => b.id - a.id)); // data 변경 시 정렬만
    }
    //* cleanup 함수로 언마운트 시 상태 업데이트 방지
    return () => {
      isMounted = false;
    };

    //* 최초 로딩시에만 상태관리
  }, [data, categories]);
 */
//
// 카테고리 데이터 가져오기
// const getCombine: GridValueGetter<(typeof codes)[number], unknown> = (
//   value,
//   row
// ) => {
//   return `${row.title || ''} ${row.created || ''}`;
// };
//* combine
// {
//   field: 'combine',
//   headerName: '합치기',
//   width: 300,
//   filterable: true,
//   valueGetter: getCombine,
//   type: 'string',
// },

/*

useEffect 분리: 현재 useEffect 내에서 카테고리 데이터 가져오기, 코드 데이터 정렬, 마운트 상태 추적 등 여러 작업을 수행하고 있습니다. 이러한 작업들을 분리하여 각각의 useEffect 훅으로 나누면 코드를 더 명확하게 만들 수 있습니다.
의존성 배열 최적화: useEffect의 의존성 배열([data, categories])이 불필요하게 넓습니다. 실제로 categories는 한 번만 가져오면 되므로 의존성 배열에서 제거할 수 있습니다. data의 경우, codes 상태를 업데이트하는 부분에서만 필요하므로 해당 useEffect에만 포함시키는 것이 좋습니다.
비동기 함수 내부에서 상태 업데이트: fetchCategoriesOnce 함수 내에서 setIsLoading을 호출하고 있습니다. 이는 React의 Strict Mode에서 예기치 않은 동작을 유발할 수 있습니다. useEffect 훅의 콜백 함수는 동기적으로 실행되어야 하며, 비동기 작업은 별도의 함수로 분리하는 것이 좋습니다.
setTimeout 제거: setTimeout을 사용하여 isLoading 상태를 변경하는 것은 사용자 경험을 개선하기 위한 의도일 수 있지만, 불필요한 딜레이를 유발할 수 있습니다. 데이터 로딩이 완료되면 즉시 isLoading을 false로 설정하는 것이 좋습니다.
isMounted 변수 제거: React 18부터는 isMounted 변수를 사용하여 언마운트 시 상태 업데이트를 방지할 필요가 없어졌습니다. React가 자동으로 처리해 줍니다

*/
