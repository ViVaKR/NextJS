// src/app/(root)/accounts/AccountList.tsx
'use client';
import VivDataGrid from '@/components/VivDataGrid';
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import { useAuth } from '@/lib/AuthContext';
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Chip,
  Autocomplete,
  CircularProgress,
  Typography,
  IconButton
} from '@mui/material';
import { useSnackbar } from '@/lib/SnackbarContext';
import { assignRole, removeRole } from '@/lib/roleApi';
import { fetchRoles } from '@/lib/fetchRoles';
import { IRole } from '@/interfaces/i-role';
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteAccount } from '@/lib/accountApi';
import { IAuthResponseDTO, IDeleteAccountDTO } from '@/interfaces/i-auth-response';

export default function AccountList() {
  const title = '회원관리';
  const { fetchUsers } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [users, setUsers] = useState<IUserDetailDTO[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUserDetailDTO | null>(null);
  const [editedRoles, setEditedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userData = await fetchUsers();
        const roleData = await fetchRoles(); // 모든 역할 목록 가져오기
        setUsers(userData);
        setRoles(roleData);
      } catch (err: any) {
        showSnackbar(`데이터 로드 실패: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUsers]);

  // 행 클릭 시 사용자 선택
  const handleRowClick = (params: GridRowParams) => {
    const user = params.row as IUserDetailDTO;
    setSelectedUser(user);
    setEditedRoles([...user.roles]); // 현재 역할 복사
  };

  // 역할 추가/삭제
  const handleRoleChange = (event: any, newValue: string[]) => {
    setEditedRoles(newValue);
  };

  // 변경 사항 저장
  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);

    try {
      // 추가된 역할
      const rolesToAdd = editedRoles.filter((role) => !selectedUser.roles.includes(role));
      for (const roleName of rolesToAdd) {
        const role = roles.find((r) => r.name === roleName);
        if (role) {
          await assignRole(selectedUser.id, role.id);
        }
      }

      // 삭제된 역할
      const rolesToRemove = selectedUser.roles.filter((role) => !editedRoles.includes(role));
      for (const roleName of rolesToRemove) {
        const role = roles.find((r) => r.name === roleName);
        if (role) {
          await removeRole(selectedUser.id, role.id);
        }
      }

      // 사용자 목록 갱신
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...u, roles: editedRoles } : u
      );
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, roles: editedRoles });
      showSnackbar('권한이 성공적으로 업데이트되었습니다.', 'success');
    } catch (err: any) {
      showSnackbar(`권한 업데이트 실패: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (email: string) => {
    try {
      const result: IAuthResponseDTO = await deleteAccount(email);
      const newUsers = users.filter((u) => u.email !== email);
      setUsers(newUsers);
      if (selectedUser?.email === email) {
        setSelectedUser(null);
      }
      showSnackbar(result.message ?? '계정을 성공적으로 삭제하였습니다!!!!!', 'success');
    } catch (err: any) {
      showSnackbar(`계정 삭제 실패: ${err.message}`, 'error');
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: '아이디', width: 250, filterable: true, type: 'string', headerAlign: 'center', },
    { field: 'fullName', headerName: '이름', width: 120, filterable: true, type: 'string', },
    { field: 'emailConfirmed', headerName: '인증', width: 100, filterable: true, type: 'boolean', },
    // { field: 'phoneNember', headerName: '전화번호', width: 200, filterable: true, type: 'string', valueGetter: (params: string) => params ?? '없음', },
    { field: 'roles', headerName: '권한', width: 300, filterable: true, type: 'string', valueGetter: (params: string[]) => Array.isArray(params) ? params.join(', ') : '', },
    {
      field: 'actions',
      headerName: '작업',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.email)}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <VivDataGrid<IUserDetailDTO>
        title={title}
        columns={columns}
        initialData={users}
        onRowClick={handleRowClick}
      />

      {selectedUser && (
        <Box mt={4} p={2} border={1} borderRadius={4} borderColor="grey.300">
          <Typography variant="h6">권한 편집: {selectedUser.email}</Typography>
          <Autocomplete
            multiple
            options={roles.map((role) => role.name)}
            value={editedRoles}
            onChange={handleRoleChange}
            freeSolo // 새로운 역할 입력 허용 (옵션)
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, onDelete, ...rest } = getTagProps({ index });
                return (
                  <Chip
                    key={option} // 역할 이름으로 고유성 보장
                    label={option}
                    onDelete={onDelete}
                    {...rest}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="역할" variant="outlined" fullWidth />
            )}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
            sx={{ mt: 2 }}
          >
            {saving ? '저장 중...' : '저장'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
