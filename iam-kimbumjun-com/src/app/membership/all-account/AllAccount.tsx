'use client';
import { useAuth } from '@/lib/AuthContext';
import { useEffect, useState, useMemo } from 'react';
import { IUserDetailDTO } from '@/dtos/i-userdetail-dto';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { redirect, useRouter } from 'next/navigation';
import VivTitle from '@/components/Title';
//--> Table Header Describe
interface HeadCell {
  id: keyof IUserDetailDTO;
  label: string;
  numeric: boolean;
  disablePadding: boolean;
}

const headCells: HeadCell[] = [
  // { id: 'id', label: 'ID', numeric: false, disablePadding: true },
  { id: 'fullName', label: '이름', numeric: false, disablePadding: false },
  { id: 'email', label: '이메일', numeric: false, disablePadding: false },
  { id: 'roles', label: '역할', numeric: false, disablePadding: false },
  // {
  //   id: 'phoneNumber',
  //   label: '전화번호',
  //   numeric: false,
  //   disablePadding: false,
  // },
  // { id: 'avata', label: '아바타', numeric: false, disablePadding: false },
];

//--> Sort Comparator Function
type Order = 'asc' | 'desc';

function descendingComparator(
  a: IUserDetailDTO,
  b: IUserDetailDTO,
  orderBy: keyof IUserDetailDTO
) {
  if (orderBy === 'roles') {
    const aValue = Array.isArray(a[orderBy]) ? a[orderBy].join(', ') : '';
    const bValue = Array.isArray(b[orderBy]) ? b[orderBy].join(', ') : '';
    return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
  }
  const aValue = a[orderBy] ?? ''; // 선택적 속성 대비
  const bValue = b[orderBy] ?? '';
  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function getComparator(
  order: Order,
  orderBy: keyof IUserDetailDTO
): (a: IUserDetailDTO, b: IUserDetailDTO) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

//--> Table Header Componet
interface EnhancedTableHeadProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IUserDetailDTO
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof IUserDetailDTO) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box
                  component="span"
                  sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

//--> Toolbar Component
interface EnhancedTableToolbarProps {
  numSelected: number;
}

//--> Delete User
const handleDelete = () => {
  alert('To be Deleted');
};

//--> Table Toolbar
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}>
      {/* 회원 목록 */}
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div">
          <span className="flex items-center justify-start">
            회원
            <span className="text-red-500 font-poppins">[ {numSelected} ]</span>
            명 선택
          </span>
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"></Typography>
      )}
      {/* Delete Button */}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
}

//--> Main Component <--//
export default function AllAccount() {
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<IUserDetailDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof IUserDetailDTO>('fullName');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // setError('로그인이 필요합니다.');
      // showSnackbar('로그인이 필요합니다.', 'error'); // 스넥바 표시
      setLoading(false);

      // router.push('/membership/sign-in');
      redirect(`/membership/sign-in`); // Navigate to the new post page
      return;
    }

    if (!isAdmin()) {
      setError('관리자 권한이 필요합니다.');
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/account/list`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) throw new Error('인증 실패');
          if (response.status === 403) throw new Error('관리자 권한 필요');
          throw new Error('회원 목록을 가져오는데 실패하였습니다.');
        }

        const data: IUserDetailDTO[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
        if (err.message === '인증 실패') logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, isAdmin, logout, authLoading, router]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IUserDetailDTO
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = users.map((u) => u.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  // 회원디테일 페이지
  const handleRowClick = (id: string) => {
    // user 객체를 JSON 문자열로 변환하고 URL 인코딩
    const userQuery = encodeURIComponent(JSON.stringify(user));
    // 쿼리 파라미터로 id와 user 전달
    router.push(`/membership/user-detail/${id}?user=${userQuery}`);
  };

  const handleChangePage = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () =>
      [...users]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [users, order, orderBy, page, rowsPerPage]
  );

  if (loading || authLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <Box sx={{ width: '100%' }}>
      <div>{VivTitle({ title: '회원 목록' })}</div>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={users.length}
            />
            <TableBody>
              {visibleRows.map((row) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${row.id}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => {
                      handleClick(event, row.id);
                      handleRowClick(row.id);
                    }}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(e) => {
                          e.stopPropagation(); // 체크박스 클릭 시 네비게이션 방지
                          handleClick(e, row.id); // 기존 선택 로직 유지
                        }}
                      />
                    </TableCell>
                    {/* 목록  */}
                    <TableCell
                      sx={{ display: 'none' }}
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none">
                      {row.id}
                    </TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.roles.join(', ')}</TableCell>
                    {/* <TableCell>{row.phoneNumber || '-'}</TableCell> */}
                    {/* <TableCell>{row.avata || '없음'}</TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
