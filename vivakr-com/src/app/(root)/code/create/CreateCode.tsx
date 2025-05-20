// src/app/(root)/code/create/CreateCode.tsx
'use client'
import { CodeData } from '@/types/code-form-data';
import { getTokenAsync, fetchUserDetailAsync } from '@/services/auth.service';
import { Box, Button, ButtonGroup, Grid, IconButton, MenuItem, TextField, TextFieldProps, ThemeProvider, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSnackbar } from '@/lib/SnackbarContext';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import FileManager from '@/components/file-manager/FileManager';
import { ICategory } from '@/interfaces/i-category';
import { fetchCategories } from '@/lib/fetchCategories';
import FileUploader from '@/components/file-manager/FileUploader';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import { postCodesAsync } from '@/lib/fetchCodes';
import { getIpInfomations } from '@/lib/fetchIpInfo';
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import ScrollButtons from '@/components/ScrollButtons';
import { styled } from '@mui/system';

export default function CreateCodePage() {

    const [rows, setRows] = useState(20);
    const snackbar = useSnackbar();
    const startValue = 5;
    const stepValue = 10;
    const numberOfButtons = 15;
    const router = useRouter();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const scrollContainerRef = useRef<HTMLElement | null>(null);
    const [error, setError] = useState<string | null>();

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
    }, []);

    function handleRowsClick(rowsCount: number) {
        setRows(rowsCount);
    }

    const genButtons = Array.from({ length: numberOfButtons }).map((_, index) => {
        const currentValue = startValue + (index * stepValue);
        return (
            <Button tabIndex={-1} key={currentValue} onClick={() => handleRowsClick(currentValue)}>
                {currentValue}
            </Button>
        )
    });

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
        mode: 'onTouched'
    });

    useEffect(() => {
        const getUserDetail = async () => {
            setIsLoadingUser(true);
            try {
                const token = await getTokenAsync();
                if (!token) {
                    setError('로그인 후 사용가능합니다.');
                    router.push('/membership/sign-in');
                    return;
                }

                const user: IUserDetailDTO | null = await fetchUserDetailAsync(token);
                if (!user) {
                    setError('사용자 정보를 가져오지 못했습니다.');
                    router.push('/membership/sign-in');
                    return;
                }

                if (!user.emailConfirmed) {
                    setError('이메일 인증후 사용할 수 있습니다.');
                    router.push('/membership/confirm-email')
                    return;
                }
                setValue('userId', user.id, { shouldDirty: true });
                setValue('userName', user.fullName, { shouldDirty: true });
                setIsLoadingUser(false);
            } catch (err: any) {
                router.push('/membership/sign-in');
                return;
            } finally {
                setIsLoadingUser(false);
            }
        };
        getUserDetail();
    }, [router, setValue]);

    useEffect(() => {
        const getUserIp = async () => {
            const ipInfo = await getIpInfomations();
            setValue('myIp', ipInfo.ip)
        }
        getUserIp();
    }, [setValue]);

    const onSubmit = async (data: CodeData) => {
        try {
            const response = await postCodesAsync(data);
            if (response?.isSuccess) {
                snackbar.showSnackbar(response.message, 'success');
                reset();
                router.push('/code');
                router.refresh();
            } else {
                snackbar.showSnackbar(response?.message || '데이터 저장에 실패하였습니다.', 'warning');
            }
        } catch (err: any) {
            snackbar.showSnackbar(err.message, 'error');
        }
    };

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

    if (isLoadingUser) {
        return <div className='content-center text-slate-400 text-2xl'>로딩 중...</div>
    }

    return (
        <>
            <Box
                component="section" // Box 를 section 으로 설정하여 ref 연결가능
                ref={scrollContainerRef}
                sx={{
                    px: 2,
                    width: '100%',
                    display: 'flex',
                    height: '100vh',
                    overflow: 'auto',
                    flexDirection: 'column',
                    gap: 1,
                    position: 'relative'
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
                <form
                    autoComplete='off'
                    className='flex flex-col gap-5 w-full'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Grid container sx={{ width: '100%' }} columns={16} spacing={2}>
                        <Grid size={11}>
                            {/* 제목 */}
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: '제목을 입력해주세요.' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id='title'
                                        name='title'
                                        label="제목"
                                        variant="filled"
                                        error={!!errors.title}
                                        sx={{ my: '0px' }}
                                        color='success'
                                        helperText={errors.title?.message}
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid tabIndex={-1} size={5}>
                            {/* 카테고리 */}
                            <Controller
                                name="categoryId"
                                control={control}
                                rules={{ required: "카테고리를 선택하여 주세요." }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        id='categoryId'
                                        name='categoryId'
                                        label="카테고리"
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        variant="filled"
                                        color="success"
                                        fullWidth
                                        tabIndex={-1}
                                        slotProps={{ select: { tabIndex: -1 } }}
                                        error={!!errors.categoryId}
                                        helperText={errors.categoryId?.message}
                                    >
                                        {[...categories].map((category, index) => (
                                            <MenuItem key={index} value={category.id}>
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

                    {/* 부제목 */}
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
                                color='success'
                                variant='filled'
                                error={!!errors.subTitle}
                                helperText={errors.subTitle?.message}
                                fullWidth
                            />
                        )}
                    />

                    <div tabIndex={-1}
                        className='w-full p-0 flex justify-center items-center overflow-x-scroll'>
                        <ButtonGroup size='small' sx={{ mx: 'auto' }} color='success'>
                            {genButtons}
                        </ButtonGroup>
                    </div>

                    {/* 노트, note */}
                    <Controller
                        name='note'
                        control={control}
                        rules={{ required: '노트를 입력해주세요.' }}
                        render={({ field }) => (
                            <CodeTextField
                                {...field}
                                id='note'
                                name='note'
                                variant='filled'
                                rows={rows}
                                label="노트"
                                error={!!errors.note}
                                helperText={errors.note?.message}
                                color='success'
                                multiline
                                onKeyDown={handleKeyDown}
                            />
                        )}
                    />

                    {/* 코드, content */}
                    <Controller
                        name='content'
                        control={control}
                        rules={{ required: '코드를 입력해주세요.' }}
                        render={({ field }) => (
                            <CodeTextField
                                {...field}
                                id='content'
                                name='content'
                                variant='filled'
                                rows={rows}
                                label="코드"
                                error={!!errors.content}
                                helperText={errors.content?.message}
                                color='success'
                                multiline
                                onKeyDown={handleKeyDown}
                            />
                        )}
                    />

                    {/* 보조코드, subContent */}
                    <Controller
                        name='subContent'
                        control={control}
                        rules={{ required: '코드를 입력해주세요.' }}
                        render={({ field }) => (
                            <CodeTextField
                                {...field}
                                id='subContent'
                                name='subContent'
                                variant='filled'
                                rows={rows}
                                label="보조코드"
                                error={!!errors.subContent}
                                helperText={errors.subContent?.message}
                                color='success'
                                multiline
                                onKeyDown={handleKeyDown}
                            />
                        )}
                    />

                    {/* 마크다운, markdown */}
                    <Controller
                        name='markdown'
                        control={control}
                        rules={{ required: '코드를 입력해주세요.' }}
                        render={({ field }) => (
                            <CodeTextField
                                {...field}
                                id='markdown'
                                name='markdown'
                                variant='filled'
                                rows={rows}
                                label="마크다운"
                                error={!!errors.subContent}
                                helperText={errors.subContent?.message}
                                color='success'
                                multiline
                                onKeyDown={handleKeyDown}
                            />
                        )}
                    />

                    <div className='flex flex-col items-center justify-start'>
                        <p>
                            <strong>이미지</strong> 정상 업로드 시 미리보기와 결과 첨부된 이미지가 함께 표시됩니다.
                        </p>
                        <IconButton color="secondary">
                            <AddAPhotoOutlinedIcon />
                        </IconButton>
                    </div>

                    {/* 이미지 드레그앤드롭 */}
                    <FileManager
                        title='코드관련 이미지 (drag & drop)'
                        choice={1}
                        onAttachImageFinished={(dbPath: string) => {
                            setValue('attachImageName', dbPath, { shouldDirty: true });
                        }}
                    />

                    {/* 파일 업로드 */}
                    <FileUploader
                        title="압축 파일 업로드 (최대 30MB)"
                        onUploadComplete={(filePath: string) => {
                            setValue('attachFileName', filePath, { shouldDirty: true });
                        }}
                    />

                    {watch('attachFileName')}

                    {/* watch로 값이 잘 들어갔는지 확인 */}
                    {watch('attachImageName') && (
                        <div style={{ marginTop: '10px', border: '1px solid lightblue', padding: '5px' }}>
                            <Typography variant="caption" display="block" gutterBottom>
                                첨부된 이미지 경로 (watch 확인용):
                            </Typography>
                            <Typography variant="body2" style={{ wordBreak: 'break-all' }}>
                                {watch('attachImageName')}
                            </Typography>

                        </div>
                    )}

                    {/* 버튼 그룹 */}
                    <div className='w-full flex justify-center'>
                        <Button
                            disabled={isSubmitting}
                            className='px-4 py-2
                        cursor-pointer
                        hover:!text-white
                        !border
                        !my-8 hover:!bg-red-400'
                            type="submit">
                            {isSubmitting ? '저장 중' : '저장'}
                        </Button>

                    </div>
                </form >
                <ScrollButtons scrollableRef={scrollContainerRef} />
                <div className='min-h-screen w-full'></div>
            </Box >
        </>
    );
}
