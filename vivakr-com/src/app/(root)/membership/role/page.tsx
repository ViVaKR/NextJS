// src/app/(root)/roles/RolePage.tsx
'use client';
import { IRole } from '@/interfaces/i-role';
import { deleteRole, fetchRoles } from '@/lib/fetchRoles';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, FormControl, InputLabel, FilledInput, FormHelperText, Button } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from '@/lib/SnackbarContext';
import { getToken, isAdmin } from '@/services/auth.service';
import { IResponse } from '@/interfaces/i-response';
import VivTitle from '@/components/VivTitle';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
type RoleData = {
  roleName: string;
};

export default function RolePage() {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<{ id: string; name: string } | null>(null);
  const { showSnackbar } = useSnackbar();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RoleData>({
    defaultValues: {
      roleName: '',
    }
  });

  const loadRoles = async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const data = await fetchRoles(controller.signal);
      setRoles(data);
    } catch (err: any) {
      setError('역할 데이터를 가져오는 중 오류가 발생했습니다.');
      showSnackbar(`오류: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  };

  useEffect(() => {
    loadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // 역할 추가
  const onSubmit = async (data: RoleData) => {
    if (!isAdmin()) {
      showSnackbar('권한이 부족합니다.', 'error');
      return;
    }
    if (data.roleName.length < 3) {
      showSnackbar('역할 이름은 3자 이상이어야 합니다.', 'error');
      return;
    }

    try {
      const token = await getToken();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/role/create`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ roleName: data.roleName }),
      });

      const result: IResponse = await response.json();
      if (response.ok) {
        showSnackbar(`새로운 역할 "${data.roleName}" 추가 완료`, 'success');
        reset(); // 폼 초기화
        await loadRoles(); // 목록 갱신
      } else {
        showSnackbar(result.responseMessage || '역할 추가 실패', 'error');
      }
    } catch (err: any) {
      showSnackbar(`서버 오류: ${err.message}`, 'error');
    }
  };

  // 역할 삭제
  const handleClickDelete = async () => {
    if (!selectedRole) return;
    if (!isAdmin()) {
      showSnackbar('권한이 부족합니다.', 'error');
      return;
    }
    try {
      const result = await deleteRole(selectedRole.id);
      showSnackbar(`${selectedRole.name} ${result.responseMessage}`);
      setSelectedRole(null); // 선택해제
      await loadRoles(); // 목록갱신
    } catch (err: any) {
      showSnackbar(`서버오류 : ${err.message}`);
    }
  }

  // 역할 선택
  const handleSelectRole = (role: IRole) => {
    setSelectedRole({ id: role.id, name: role.name });
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className='w-full px-4 py-4'>
      <VivTitle title='역할 관리' />


      <form onSubmit={handleSubmit(onSubmit)} className='my-4'>

        <FormControl fullWidth sx={{ margin: '5px' }}>
          <InputLabel htmlFor="roleName">Create New Role</InputLabel>
          <Controller
            name="roleName"
            control={control}
            rules={{ required: 'please role name' }}
            render={({ field }) => (
              <FilledInput
                {...field}
                error={!!errors.roleName}
                id="roleName"
                className='!font-poppins'
                fullWidth
                color='info'
                onFocus={() => setSelectedRole(null)}
                type='text'
              />
            )}

          />
          <FormHelperText>{errors.roleName?.message}</FormHelperText>
        </FormControl>
        <div className='w-full flex justify-center'>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className="!text-slate-400
                      !font-bold
                      hover:!bg-sky-500
                      hover:!text-white">
            Create
          </Button>
        </div>
      </form>

      {/* 선택된 역할 삭제 버튼 */}
      <div className='w-full my-2 flex gap-8 items-center'>

        <div className='h-10 bg-slate-200 rounded-xl w-full flex items-center justify-center'>
          {selectedRole && (
            <Button color='success'
              className='flex gap-12 w-full justify-center items-center'
              onClick={handleClickDelete}>
              <span>
                [ {selectedRole.name} ]
              </span>
              <span>
                {selectedRole.id}
              </span>
              <DeleteOutlineOutlinedIcon />
            </Button>
          )}
        </div>

      </div>

      {/* 역할 목록 */}
      {roles.length === 0 ? (
        <Typography>역할이 존재하지 않습니다.</Typography>
      ) : (
        <List style={{ width: '100%' }}>
          {roles.map((role) => (
            <ListItem
              key={role.id}
              divider>
              <Button onClick={() => handleSelectRole(role)}>
                <ListItemText
                  primary={`${role.name}`}
                  secondary={`사용자 수: ${role.totalUsers},
                  Normalized: ${role.normalizedName},
                  Stamp: ${role.concurrencyStamp}`
                  }
                />
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}
