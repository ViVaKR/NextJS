'use client'
import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Crud, DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { useDemoRouter } from '@toolpad/core/internal';
import { TextField } from '@mui/material';

const NAVIGATION: Navigation = [
    {
        segment: 'questions',
        title: '문제은행',
        icon: <StickyNote2Icon />,
        pattern: 'questions{/:noteId}*',
    },
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },

    // components: {
    //     MuiTextField: {
    //         defaultProps: {
    //             fullWidth: true,
    //             variant: 'filled',
    //             multiline: true,
    //             rows: 5
    //         },

    //     },
    //     MuiFormControl: {
    //         styleOverrides: {
    //             root: {
    //                 width: '100vw', // FormControl도 전체 폭으로
    //                 marginBottom: '1rem', // 필드 간 세로 간격 추가
    //             },
    //         },
    //     },
    // },
});

export interface Note extends DataModel {
    id: number;
    level: number;
    types?: '주관식' | '객관식' | null;
    title: string;
    text?: string | null;
    choices?: string[] | undefined;
    answer?: string | number | undefined;

}

let notesStore: Note[] = [
    {
        id: 1,
        level: 1,
        type: '주관식',
        title: '채만식의 소설 중 태평천하는 제목에서 어떤 표현방법을 통해 풍자의 효과를 보여주고 있는지 3음절로 쓰세요',
        text: '',
        choices: [],
        answer: '반어법'
    },
    {
        id: 2,
        level: 1,
        type: '객관식',
        title: '1인칭 관찰자 시점에 대한 설명 중 잘못된 것은?',
        text: '',
        choices: [
            "모든 등장인물의 내면 심리를 파악할 수 있다",
            "내가 주인공이 되어 자신의 이야기를 한다",
            "독자와 등장인물 사이의 거리가 가깝다",
            "추측이 자주 나타난다"
        ],
        answer: '모든 등장인물의 내면 심리를 파악할 수 있다'
    },
];

export const notesDataSource: DataSource<Note> = {
    fields: [
        { field: 'id', headerName: 'ID' },
        { field: 'level', headerName: '단계' },
        { field: 'type', headerName: '유형' },
        {
            field: 'title',
            headerName: '제목',
            type: 'string',
        },
        {
            field: 'text', headerName: '부제목', type: 'string',
            renderEditCell: (params) => (
                <TextField
                    {...params}
                    id='test'
                    value='Hello'
                    multiline
                    rows={5}
                    fullWidth
                />
            )
        },
        {
            field: 'choices',
            headerName: '선택지',
            renderEditCell: (params) => {
                const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.target.value;
                    params.api.setEditCellValue({
                        id: params.id,
                        field: 'choices',
                        value: value.split(',').map(v => v.trim())
                    });
                };

                return (
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="filled"
                        value={Array.isArray(params.value) ? params.value.join(', ') : ''}
                        onChange={handleChange}
                    />
                );
            }
        },
        { field: 'answer', headerName: '정답', type: 'string' },

    ],

    getMany: ({ paginationModel, filterModel, sortModel }) => {
        return new Promise<{ items: Note[]; itemCount: number }>((resolve) => {
            setTimeout(() => {
                let processedNotes = [...notesStore];

                // Apply filters (demo only)
                if (filterModel?.items?.length) {
                    filterModel.items.forEach(({ field, value, operator }) => {
                        if (!field || value == null) {
                            return;
                        }

                        processedNotes = processedNotes.filter((note) => {
                            const noteValue = note[field];

                            switch (operator) {
                                case 'contains':
                                    return String(noteValue)
                                        .toLowerCase()
                                        .includes(String(value).toLowerCase());
                                case 'equals':
                                    return noteValue === value;
                                case 'startsWith':
                                    return String(noteValue)
                                        .toLowerCase()
                                        .startsWith(String(value).toLowerCase());
                                case 'endsWith':
                                    return String(noteValue)
                                        .toLowerCase()
                                        .endsWith(String(value).toLowerCase());
                                case '>':
                                    return (noteValue as number) > value;
                                case '<':
                                    return (noteValue as number) < value;
                                default:
                                    return true;
                            }
                        });
                    });
                }

                // Apply sorting
                if (sortModel?.length) {
                    processedNotes.sort((a, b) => {
                        for (const { field, sort } of sortModel) {
                            if ((a[field] as number) < (b[field] as number)) {
                                return sort === 'asc' ? -1 : 1;
                            }
                            if ((a[field] as number) > (b[field] as number)) {
                                return sort === 'asc' ? 1 : -1;
                            }
                        }
                        return 0;
                    });
                }

                // Apply pagination
                const start = paginationModel.page * paginationModel.pageSize;
                const end = start + paginationModel.pageSize;
                const paginatedNotes = processedNotes.slice(start, end);

                resolve({
                    items: paginatedNotes,
                    itemCount: processedNotes.length,
                });
            }, 750);
        });
    },

    getOne: (noteId) => {
        return new Promise<Note>((resolve, reject) => {
            setTimeout(() => {
                const noteToShow = notesStore.find((note) => note.id === Number(noteId));

                if (noteToShow) {
                    resolve(noteToShow);
                } else {
                    reject(new Error('Note not found'));
                }
            }, 750);
        });
    },

    createOne: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newNote = { id: notesStore.length + 1, ...data } as Note;
                notesStore = [...notesStore, newNote];
                resolve(newNote);
            }, 750);
        });
    },

    updateOne: (noteId, data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let updatedNote: Note | null = null;

                notesStore = notesStore.map((note) => {
                    if (note.id === Number(noteId)) {
                        updatedNote = { ...note, ...data };
                        return updatedNote;
                    }
                    return note;
                });

                if (updatedNote) {
                    resolve(updatedNote);
                } else {
                    reject(new Error('Note not found'));
                }
            }, 750);
        });
    },

    deleteOne: (noteId) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                notesStore = notesStore.filter((note) => note.id !== Number(noteId));

                resolve();
            }, 750);
        });
    },

    validate: (formValues) => {
        let issues: { message: string; path: [keyof Note] }[] = [];

        if (!formValues.title) {
            issues = [...issues, { message: 'Title is required', path: ['title'] }];
        }
        if (formValues.title && formValues.title.length < 3) {
            issues = [
                ...issues,
                {
                    message: 'Title must be at least 3 characters long',
                    path: ['title'],
                },
            ];
        }
        if (!formValues.text) {
            issues = [...issues, { message: 'Text is required', path: ['text'] }];
        }

        return { issues };
    },
};

const notesCache = new DataSourceCache();

function matchPath(pattern: string, pathname: string): string | null {
    const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);
    const match = pathname.match(regex);
    return match ? match[1] : null;
}

interface DemoProps {
    window?: () => Window;
}

export default function ExamQuestionsCrud({ window }: DemoProps) {
    // const { window } = props;
    const router = useDemoRouter('/questions');
    const [isReady, setIsRead] = React.useState(false);

    React.useEffect(() => {
        setIsRead(true);
    }, []);

    const title = React.useMemo(() => {
        if (!isReady) return undefined; // 초기화 전에는 title 계산 안함.
        if (router.pathname === '/questions/new') {
            return '새로운 문제';
        }
        const editNoteId = matchPath('/questions/:noteId/edit', router.pathname);
        if (editNoteId) {
            return `Note ${editNoteId} - Edit`;
        }
        const showNoteId = matchPath('/questions/:noteId', router.pathname);
        if (showNoteId) {
            return `Note ${showNoteId}`;
        }

        return undefined;
    }, [router.pathname, isReady]);

    const demoWindow = window !== undefined ? window() : undefined;

    if (!isReady) {
        return null; // 로딩 UI 로 대체 가능
    }

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout defaultSidebarCollapsed>
                <PageContainer title={title}>

                    {/* preview-start */}
                    <Crud<Note>
                        dataSource={notesDataSource}
                        dataSourceCache={notesCache}
                        rootPath="/questions"
                        initialPageSize={10}

                    // defaultValues={{
                    //     level: 1,
                    //     types: '주관식',
                    //     title: '제목',
                    //     text: '부 제목',
                    //     choices: [],
                    //     answer: undefined
                    // }}


                    />

                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}
