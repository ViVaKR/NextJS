// src/app/code/page.tsx
'use client';
import { fetchCodeById, updateCodeAsync } from '@/lib/fetchCodes';
import { startTransition, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/lib/SnackbarContext';
import { ICategory } from '@/interfaces/i-category';
import { fetchCategories } from '@/lib/fetchCategories';
import { Controller, useForm } from 'react-hook-form';
import { CodeData } from '@/types/code-form-data';
import { fetchUserDetailAsync, getTokenAsync, userDetailAsync } from '@/services/auth.service';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined'
import { Box, Button, ButtonGroup, createTheme, Grid, MenuItem, styled, TextField, TextFieldProps, ThemeProvider, Typography } from '@mui/material';
import FileManager from '@/components/file-manager/FileManager';
import FileUploader from '@/components/file-manager/FileUploader';
import Image from 'next/image';
import { getIpInfomations } from '@/lib/fetchIpInfo';
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import ScrollButtons from '@/components/ScrollButtons';
import VivTitle from '@/components/VivTitle';

export default function CodePage({ params }: { params: Promise<{ id: number }> }) {
  const [rows, setRows] = useState(20);
  const router = useRouter();
  const snackbar = useSnackbar();
  const startValue = 5;
  const stepValue = 10;
  const numberOfButtons = 15;
  const [loaded, setLoaded] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const [error, setError] = useState<string | null>();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm<CodeData>({
    defaultValues: {
      id: 0,
      title: '',
      subTitle: '',
      content: '',
      subContent: '',
      markdown: '',
      created: undefined,
      modified: new Date(),
      note: '',
      categoryId: undefined,
      userId: '',
      userName: '',
      myIp: '0.0.0.0',
      attachImageName: '',
      attachFileName: '',
    },
    mode: 'all',
  });

  useEffect(() => {
    const getUserToken = async () => {
      const token = await getTokenAsync();
      if (!token) {
        router.push('/membership/sign-in');
      }
      const user: IUserDetailDTO | null = await fetchUserDetailAsync(token!);
      if (!user) {
        snackbar.showSnackbar('사용자 정보를 가져오지 못했습니다.', 'error');
        router.push('/membership/sign-in');
        return;
      }

      if (!user.emailConfirmed) {
        snackbar.showSnackbar("이메일 인증 후 사용하실 수 있습니다. 감사합니다.");
        router.push('/membership/confirm-email')
        return;
      }
    }
    getUserToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // * 코드 데이터 바인딩
  useEffect(() => {
    setLoaded(false);
    const getCode = async () => {

      try {
        const resolvedParams = await params;
        const data = await fetchCodeById(Number(resolvedParams.id));
        if (!data) {
          setLoaded(false);
          return;
        }
        setLoaded(true);

        const ipInfo = await getIpInfomations();

        reset({
          id: data.id,
          title: data.title,
          subTitle: data.subTitle,
          content: data.content,
          subContent: data.subContent ?? '',
          markdown: data.markdown ?? '',
          created: data.created,
          modified: new Date(),
          note: data.note,
          categoryId: data.categoryId,
          userId: data.userId,
          userName: data.userName,
          myIp: ipInfo.ip,
          attachImageName: data.attachImageName ?? '',
          attachFileName: data.attachFileName ?? '',
        });
      } catch (err: any) {
        setLoaded(false);
      }
    };
    getCode();

  }, [params, reset, router]);

  // 카테고리 가져오기
  useEffect(() => {
    setError('');
    const fetchAndSortCategories = async () => {
      try {
        const result = await fetchCategories();
        const sorted = result.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setCategories(sorted);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchAndSortCategories();
  }, [snackbar]);

  const handleRowsClick = (rowsCount: number) => {
    setRows(rowsCount);
  };

  const genButtons = Array.from({ length: numberOfButtons }).map((_, index) => {
    const currentValue = startValue + index * stepValue;
    return (
      <Button key={currentValue} onClick={() => handleRowsClick(currentValue)}>
        {currentValue}
      </Button>
    );
  });

  // 수정
  const onSubmit = async (data: CodeData) => {
    try {
      const response = await updateCodeAsync(data.id, data); // 수정 API가 있다면 updateCodes로 변경
      if (response) {
        snackbar.showSnackbar(`${response.message}`, `${response.isSuccess ? 'success' : 'warning'}`);
        if (response.isSuccess) {
          reset();
          router.push('/code');
          router.refresh();
        } else {
          snackbar.showSnackbar(response.message || '코드업데이트 실패', 'warning')
        }
      }
    } catch (err: any) {
      snackbar.showSnackbar(err.message, 'error');
    }
  };

  const theme = createTheme({
    typography: {
      fontSize: 18,
      fontWeightRegular: 400,
    }
  });

  const CodeTextField = styled((props: TextFieldProps) => (
    <TextField {...props} />))(({ theme }) => ({
      '& .MuiFilledInput-root': {
        fontFamily: [
          'Menlo'
        ],
        fontSize: 20,
        lineHeight: 1.4,
        color: '#0F435B'
      },

    }));


  const handleKeyDown = (e: React.KeyboardEvent) => {

    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const spaces = '    ';
      const newValue =
        target.value?.substring(0, start) +
        spaces +
        target.value?.substring(end);
      setValue(target.name as keyof CodeData, newValue, { shouldDirty: true });
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + spaces.length;
      }, 0);
    }
  };



  return (
    <>
      <VivTitle title={`코드번호 (${watch('id')}) 수정`} />
      <Box
        component="section" // Box 를 section 으로 설정하여 ref 연결가능
        ref={scrollContainerRef}
        sx={{
          px: 2,
          width: '100%',
          height: '100vh',
          display: 'flex',
          overflow: 'auto',
          position: 'relative',
          flexDirection: 'column', gap: 1
        }}>
        {error && (
          <div className='text-center text-red-400'>{error}</div>
        )}
        <div className='flex justify-between px-4 text-slate-400'>
          <Typography
            sx={{ textAlign: 'end' }}>
            {watch('myIp')}
          </Typography>
          <Typography

            sx={{ textAlign: 'center' }}>
            {watch('userName')}
          </Typography>

          <Typography
            sx={{ textAlign: 'end' }}>
            {(new Date()).toLocaleDateString()}
          </Typography>
        </div>
        <form autoComplete="off"
          className="flex flex-col gap-5 w-full"
          onSubmit={handleSubmit(onSubmit)}>
          <Grid container sx={{ width: '100%' }} columns={16} spacing={2}>
            <Grid size={11}>
              <Controller
                name="title"
                control={control}
                rules={{ required: '제목을 입력해주세요.' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="제목"
                    id='title'
                    name='title'
                    variant="filled"
                    error={!!errors.title}
                    sx={{ my: '0px' }}
                    color="success"
                    helperText={errors.title?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={5}>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: '카테고리를 선택해주세요.' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    id='categoryId'
                    name='categoryId'
                    label="카테고리"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    variant="filled"
                    color="success"
                    fullWidth
                    error={!!errors.categoryId}
                    helperText={errors.categoryId?.message}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        <span className="flex items-center gap-2">
                          <GpsFixedOutlinedIcon />
                          {category.name}
                        </span>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Controller
            name="subTitle"
            control={control}
            rules={{ required: '부제목을 입력해주세요.' }}
            render={({ field }) => (
              <TextField
                {...field}
                id='subTitle'
                name='subTitle'
                label="부 제목"
                color="success"
                variant="filled"
                error={!!errors.subTitle}
                helperText={errors.subTitle?.message}
                fullWidth
              />
            )}
          />

          <div className="w-full p-0 flex justify-center items-center overflow-x-scroll">
            <ButtonGroup size="small" sx={{ mx: 'auto' }} color="success">
              {genButtons}
            </ButtonGroup>
          </div>

          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <CodeTextField
                {...field}
                id='note'
                name='note'
                variant="filled"
                rows={rows}
                label="노트"
                error={!!errors.note}
                helperText={errors.note?.message}
                color="success"
                multiline
                onKeyDown={handleKeyDown}
              />
            )}
          />

          <Controller
            name="content"
            control={control}
            rules={{ required: '코드를 입력해주세요.' }}
            render={({ field }) => (
              <ThemeProvider theme={theme}>
                <TextField
                  {...field}
                  id='content'
                  name='content'
                  variant="filled"
                  rows={rows}
                  label="코드"
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  color="success"
                  multiline
                  onKeyDown={handleKeyDown}
                />
              </ThemeProvider>
            )}
          />

          <Controller
            name="subContent"
            control={control}
            render={({ field }) => (
              <ThemeProvider theme={theme}>
                <TextField
                  {...field}
                  id='subContent'
                  name='subContent'
                  variant="filled"
                  rows={rows}
                  label="보조코드"
                  error={!!errors.subContent}
                  helperText={errors.subContent?.message}
                  color="success"
                  multiline
                  onKeyDown={handleKeyDown}
                />
              </ThemeProvider>
            )}
          />

          <Controller
            name="markdown"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id='markdown'
                name='markdown'
                variant="filled"
                rows={rows}
                label="마크다운"
                error={!!errors.markdown}
                helperText={errors.markdown?.message}
                color="success"
                multiline
                onKeyDown={handleKeyDown}
              />
            )}
          />

          <div
            className='mt-4 border border-dashed border-slate-400 p-8 flex flex-col gap-4 items-center rounded-lg'
          >
            <FileManager
              title="사진변경 (drag & drop)"
              choice={1}
              onAttachImageFinished={(dbPath: string) => {
                setValue('attachImageName', dbPath, { shouldDirty: true, shouldValidate: true });
              }}
            />

            <Typography variant="caption" display="block"
              sx={{ mt: 4, color: 'gray' }} gutterBottom>
              현재 이미지 (25%)
            </Typography>
            {
              watch('attachImageName') && (
                <Image
                  width={768}
                  height={500}
                  sizes="100%" // 반응형 크기 조정
                  style={{ objectFit: 'contain', borderRadius: '1.5em', width: '25%' }}

                  src={`${process.env.NEXT_PUBLIC_API_URL}/images/Attach/${watch('attachImageName')}`}
                  alt={watch('attachImageName')!}
                  quality={100}
                  key={watch('attachImageName')}
                />
              )
            }

          </div>

          {watch('attachFileName') && (
            <div style={{ marginTop: '10px', border: '1px dashed lightgrey', padding: '1rem', borderRadius: '1rem' }}>
              <Typography variant="body2" textAlign='center' color='warning'>
                첨부된 파일: {watch('attachFileName')}
              </Typography>

            </div>
          )}
          <FileUploader
            title="파일 업로드 / 변경 (압축파일, 최대 50MB)" // 50MB로 업데이트
            onUploadComplete={(filePath: string) => {
              setValue('attachFileName', filePath, { shouldDirty: true });
            }}
          />

          <div className="w-full flex justify-center">
            <button
              disabled={isSubmitting}
              className="px-4 py-2 rounded-full text-slate-400
            hover:bg-red-500
            hover:text-slate-50
            hover:border-red-400
            mb-48
            cursor-pointer  my-4 border-slate-400 border"
              type="submit"
            >
              {isSubmitting ? '저장 중' : '저장'}
            </button>
          </div>
        </form>
        <ScrollButtons scrollableRef={scrollContainerRef} />
        <div className='min-h-screen w-full'></div>
      </Box>
    </>
  );
}
