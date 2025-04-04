'use client'
import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Crud, DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { useDemoRouter } from '@toolpad/core/internal';

const NAVIGATION: Navigation = [
    {
        segment: 'notes',
        title: 'Notes',
        icon: <StickyNote2Icon />,
        pattern: 'notes{/:noteId}*',
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
});

export interface Note extends DataModel {
    id: number;
    title: string;
    text: string;
}

let notesStore: Note[] = [
    { id: 1, title: 'Grocery List Item', text: 'Buy more coffee.' },
    { id: 2, title: 'Personal Goal', text: 'Finish reading the book.' },
];

export const notesDataSource: DataSource<Note> = {
    fields: [
        { field: 'id', headerName: 'ID' },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'text', headerName: 'Text', flex: 1 },
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
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window?: () => Window;
}

/*

--> 문제: 컴포넌트가 화면에 나타나기(마운트) 전에 상태를 바꾸려 해서 경고가 남.
--> 해결: isMounted로 "화면에 나타날 때까지 기다리자!"라고 설정한 내용으로 . useEffect는 컴포넌트가 준비된 후에만 동작하니까 충돌이 없어짐.
--> 결과: <Crud />가 데이터를 가져오는 동안 기다리게 해서 경고가 사라짐..

*/

export default function CrudBasic({ window }: DemoProps) {
    // const { window } = props;
    const router = useDemoRouter('/notes');
    const [isReady, setIsRead] = React.useState(false);

    // Remove this const when copying and pasting into your project.
    // const demoWindow = window !== undefined ? window() : undefined;

    React.useEffect(() => {
        setIsRead(true);
    }, []);

    const title = React.useMemo(() => {
        if (!isReady) return undefined; // 초기화 전에는 title 계산 안함.
        if (router.pathname === '/notes/new') {
            return 'New Note';
        }
        const editNoteId = matchPath('/notes/:noteId/edit', router.pathname);
        if (editNoteId) {
            return `Note ${editNoteId} - Edit`;
        }
        const showNoteId = matchPath('/notes/:noteId', router.pathname);
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
                        rootPath="/notes"
                        initialPageSize={10}
                        defaultValues={{ title: 'New note' }}
                    />
                    {/* preview-end */}
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}
