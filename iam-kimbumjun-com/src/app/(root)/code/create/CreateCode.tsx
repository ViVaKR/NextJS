// src/app/(root)/code/create/CreateCode.tsx
'use client'
import { CodeData } from '@/types/code-form-data';
import { userDetail, getToken } from '@/services/auth.service';
import { Box, Button, ButtonGroup, ButtonProps, Grid, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { postCodes } from '@/lib/fetchCodes';
import { useSnackbar } from '@/lib/SnackbarContext';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import FileManager from '@/components/file-manager/FileManager';
import { ICategory } from '@/interfaces/i-category';
import { fetchCategories } from '@/lib/fetchCategories';


export default function CreateCodePage() {

    const [rows, setRows] = useState(5);
    const router = useRouter();
    const snackbar = useSnackbar();
    const startValue = 5;
    const stepValue = 15;
    const numberOfButtons = 10;

    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        const fetchAndSortCategories = async () => {
            try {
                const result = await fetchCategories();
                const sorted = result.sort((a, b) =>
                    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                );
                setCategories(sorted);
            } catch (err: any) {
                snackbar.showSnackbar(err.message);
            }
        };
        fetchAndSortCategories();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleRowsClick(rowsCount: number) {
        setRows(rowsCount);
    }

    const genButtons = Array.from({ length: numberOfButtons }).map((_, index) => {
        const currentValue = startValue + (index * stepValue);
        return (
            <Button key={currentValue} onClick={() => handleRowsClick(currentValue)}>
                {currentValue}
            </Button>
        )
    });

    // 페이지 로드시 토큰 체크
    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/membership/sign-in'); // 토큰 없으면 리다리렉션
            return;
        }
    }, [router])

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty, isLoading, isSubmitting },
        watch,
        reset,
        setValue,
        register
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
            userId: userDetail()?.id,
            userName: userDetail()?.fullName,
            myIp: '0.0.0.0',
            attachImageName: '',
            attachFileName: '',
        },
        mode: 'onTouched'
    });


    const onSubmit = async (data: CodeData) => {
        try {
            const response = await postCodes(data);
            if (response) {
                snackbar.showSnackbar(`${response.message}`, `${response.isSuccess ? 'success' : 'warning'}`);
                if (response.isSuccess) {
                    reset();
                    router.push('/code'); // 목록 페이지로 이동
                }

            }
        } catch (err: any) {
            snackbar.showSnackbar(err.message, 'error')
        }
    };

    return (

        <Box sx={{ px: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <form
                autoComplete='off'
                className='flex flex-col gap-5 w-full'
                onSubmit={handleSubmit(onSubmit)}>
                <Grid container sx={{ width: '100%' }} columns={16} spacing={2} >
                    <Grid size={11}>
                        {/* 제목 */}
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: '제목을 입력해주세요.' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
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
                    <Grid size={5}>
                        {/* 카테고리 */}
                        <Controller
                            name="categoryId"
                            control={control}
                            rules={{ required: "카테고리를 선택하여 주세요." }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="카테고리"
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    variant="filled"
                                    color="success"
                                    fullWidth
                                    error={!!errors.categoryId}
                                    helperText={errors.categoryId?.message}
                                >
                                    {[...categories].map((category, index) => (
                                        <MenuItem key={index} value={category.id}>
                                            <span className="flex items-center gap-2">
                                                <span className="material-symbols-outlined">point_scan</span>
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

                <div className='w-full p-0 flex justify-center items-center overflow-x-scroll'>
                    <ButtonGroup size='small' sx={{ mx: 'auto' }} color='success'>
                        {genButtons}
                    </ButtonGroup>
                </div>

                {/* 코드, content */}
                <Controller
                    name='content'
                    control={control}
                    rules={{ required: '코드를 입력해주세요.' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            name='content'
                            variant='filled'
                            rows={rows}
                            label="코드"
                            error={!!errors.content}
                            helperText={errors.content?.message}
                            color='success'
                            multiline
                        />
                    )}
                />

                {/* 보조코드, subContent */}
                <Controller
                    name='subContent'
                    control={control}
                    rules={{ required: '코드를 입력해주세요.' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            name='subContent'
                            variant='filled'
                            rows={rows}
                            label="보조코드"
                            error={!!errors.subContent}
                            helperText={errors.subContent?.message}
                            color='success'
                            multiline
                        />
                    )}
                />

                {/* 노트, note */}
                <Controller
                    name='note'
                    control={control}
                    rules={{ required: '노트를 입력해주세요.' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            name='note'
                            variant='filled'
                            rows={rows}
                            label="노트"
                            error={!!errors.note}
                            helperText={errors.note?.message}
                            color='success'
                            multiline
                        />
                    )}
                />

                {/* 마크다운, markdown */}
                <Controller
                    name='markdown'
                    control={control}
                    rules={{ required: '코드를 입력해주세요.' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            name='markdown'
                            variant='filled'
                            rows={rows}
                            label="마크다운"
                            error={!!errors.subContent}
                            helperText={errors.subContent?.message}
                            color='success'
                            multiline
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

                {/*  */}
                <FileManager
                    title='코드관련 이미지 (drag & drop)'
                    choice={1} // 첨부 이미지 모드
                    // onLoadFinished prop은 choice={0}일 때를 위해 남겨두거나,
                    // choice={1} 시나리오에서는 사용하지 않으므로 제거해도 무방하네.
                    // onLoadFinished={(fileInfo) => { console.log('Avatar uploaded:', fileInfo); }}

                    // choice={1}이므로 onAttachImageFinished prop 사용
                    onAttachImageFinished={(dbPath: string) => {
                        // setValue를 호출하여 attachImageName 필드 업데이트
                        setValue('attachImageName', dbPath, { shouldDirty: true }); // 수정됨 상태로 변경
                        // snackbar.showSnackbar(`이미지 첨부 완료: ${dbPath}`, 'success'); // 성공 피드백
                    }}
                />

                {/* watch로 값이 잘 들어갔는지 확인 */}
                {watch('attachImageName') && (
                    <div style={{ marginTop: '10px', border: '1px solid lightblue', padding: '5px' }}>
                        <Typography variant="caption" display="block" gutterBottom>
                            첨부된 이미지 경로 (watch 확인용):
                        </Typography>
                        <Typography variant="body2" style={{ wordBreak: 'break-all' }}>
                            {watch('attachImageName')}
                        </Typography>
                        {/* 실제 이미지 미리보기를 원한다면 next/image나 img 태그 사용 */}
                        {/* 예시: <img src={watch('attachImageName')} alt="첨부 이미지 미리보기" width="100" /> */}
                        {/* 단, next/image를 사용하려면 해당 이미지 호스트를 next.config.js에 등록해야 할 수도 있네! */}
                    </div>
                )}

                {/* 버튼 그룹 */}
                <div className='w-full flex justify-center'>
                    <Button
                        disabled={isSubmitting}
                        className='px-4
                        py-2
                        rounded-lg cursor-pointer
                        my-4
                        border-slate-400
                        border' type="submit">
                        {isSubmitting ? '저장 중' : '저장'}
                    </Button>

                </div>
            </form >



            <small className='text-xs text-slate-400'>
                {watch('title')}
                {isLoading ? (<div>Loading...</div>) : (<div>Loaded..</div>)}
                {/* // 수정 여부 알림 */}
                {isDirty && <Typography sx={{ fontSize: '0.75em' }}>변경된 내용이 있습니다!</Typography>}
            </small>

            {/*
            // 버튼 클릭 시 title 값 변경
            <Button onClick={() => setValue('title', 'New Title', { shouldValidate: true })}>
                제목 변경
            </Button>

            // API 응답으로 값 설정
            useEffect(() => {
                fetchSomeData().then((data) => setValue('content', data.content));
            }, []);

            */}
            {/* <p>
                {watch('created')?.toLocaleDateString()}
            </p> */}
            {/* <div className="flex justify-evenly mt-6">
                <CustomButton type="button">취소</CustomButton>
                <CustomButton type="button" className='!text-red-400' onClick={() => console.log('Clicked')}>이미회원이신가요? 로그인</CustomButton>
                <CustomButton type="submit">회원가입</CustomButton>
            </div> */}


            {/* <Form action={`/search`} onSubmit={}>
                <input type="text" className='px-4 py-2 w-full border rounded-full text-slate-600' value={`Hello, World`} />
                <button>Hello</button>
            </Form> */}
        </Box>
    );
}

/*

{errors.subContent && <span>{errors.subContent.message}</span>}

  newForm(val: string): void {
    this.form = this.fb.group({
      id: 0,
      title: [val, Validators.required],
      subTitle: [val, Validators.required],
      content: [val, Validators.required],
      subContent: [val],
      markdown: [val],
      created: [null],
      modified: [new Date()],
      note: [val],
      categoryId: [1],
      userId: [val],
      userName: [val],
      myIp: [val],
      attachFileName: [val],
      attachImageName: [val]
    });
  }

// const now = new Intl.DateTimeFormat("ko-KR", {
//     dateStyle: 'full',
//     timeStyle: 'full',
//     timeZone: 'Asia/Seoul'
// }).format(new Date());
// created: new Date(today.toISOString().split('T')[0]),
*/



// interface CustomButtonProps extends ButtonProps {
//     children: React.ReactNode;
// }

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };

// function getStyles(name: string, personName: readonly string[], theme: Theme) {
//     return {
//         fontWeight: personName.includes(name)
//             ? theme.typography.fontWeightMedium
//             : theme.typography.fontWeightRegular,
//     };
// }

// const CustomButton = ({ children, ...props }: CustomButtonProps) => (
//     <Button
//         variant="outlined"
//         color="primary"
//         className="!font-bold hover:!bg-sky-500 hover:!text-white"
//         {...props}
//     >
//         {children}
//     </Button>
// );

// function formatDate(now: string) {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(now).toLocaleDateString();
// }
