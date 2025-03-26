import { GridColDef } from '@mui/x-data-grid';
import VivDataGrid from '@/components/VivDataGrid';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  { id: '1', title: '첫 번째 포스트', author: '친구', date: '2025-03-18' },
  { id: '2', title: '두 번째 포스트', author: '나', date: '2025-03-19' },
];

const columns: GridColDef[] = [
  { field: 'title', headerName: '제목', width: 200 },
  { field: 'author', headerName: '작성자', width: 150 },
  { field: 'date', headerName: '날짜', width: 150 },
];

export default function DemoDataGrid() {
  return (
    <VivDataGrid<BlogPost>
      columns={columns}
      initialData={blogPosts}
    />
  );
}
