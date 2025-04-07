import { GridColDef, DataGrid } from "@mui/x-data-grid";

export interface IGridControl<T, U> {
    fetchData: () => Promise<{ data: T[]; ref: U[] }>;
    columns: GridColDef[];
    getCategoryName?: (row: T, categories: U[]) => string; // 카테고리 이름 가져오는 함수
}
