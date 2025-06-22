'use client'
import { ICategory } from '@/interfaces/i-category';
import { ICode } from '@/interfaces/i-code';
import { Box, Card, CardContent, Link, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';
import { useMemo } from 'react';

interface FeaturedCodeItemsProps {
    codes: ICode[];
    categories: ICategory[];
}

export default function VivFeaturedCodeItems({ codes, categories }: FeaturedCodeItemsProps) {
    // 카테고리 배열을 ID 기반의 Map으로 변환 (조회 성능 향상)
    // categories prop이 변경될 때만 다시 계산됨
    const categoryMap = useMemo(() => {
        // categories가 null 또는 undefined일 경우 빈 Map 반환
        if (!categories) return new Map<number, string>();
        // reduce를 사용하거나 new Map(iterable)을 사용하여 생성
        return new Map(categories.map(category => [category.id, category.name]));
    }, [categories]); // categories 배열이 바뀔 때만 재생성

    // ID로 카테고리 이름을 찾는 함수 (이제 splice 대신 Map 사용)
    const getName = (id: number): string => {
        return categoryMap.get(id) ?? "-"; // Map에서 조회, 없으면 "-" 반환
    }
    if (!codes || codes.length === 0) { return null; }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                최신 코드 스니펫 ✨
            </Typography>
            <Grid container spacing={1}>
                <Grid size={12} gap={1}>
                    {codes.map((code) => (
                        <Link key={code.id} component={Link} href={`/code/read/${code.id}`} underline="none">
                            <Card sx={{
                                border: '1px dotted gray',
                                borderRadius: '1rem',
                                margin: '1em 1rem'
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    {/* 글번호 */}
                                    <Typography variant="body2"
                                        sx={{ mb: 1, color: 'var(--color-slate-300)' }}>
                                        ( {code.id} )
                                    </Typography>

                                    {/* 카테고리 */}
                                    <Typography variant="body2" color="text.secondary"
                                        sx={{ mb: 1, color: 'var(--color-red-300)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <BubbleChartOutlinedIcon />
                                        {getName(code.categoryId)}
                                    </Typography>

                                    {/* 제목 */}
                                    <Typography gutterBottom variant="h5"
                                        component="div"
                                        sx={{ fontWeight: 'medium', color: 'var(--color-sky-500)' }}>
                                        {code.title}
                                    </Typography>


                                    {/* 부제목 */}
                                    <Typography variant="h6"
                                        sx={{ mb: 1, color: 'var(--color-stone-600)' }}>
                                        {/* 부제목이 길 수 있으니 줄임표 처리 */}
                                        {code.subTitle && code.subTitle.length > 80
                                            ? `${code.subTitle.substring(0, 80)}...`
                                            : code.subTitle}
                                    </Typography>

                                    <Typography variant="caption" display="block" sx={{ color: 'var(--color-slate-400)' }}>
                                        작성자: {code.userName} | 등록일: {new Date(code.created).toLocaleDateString()} | 수정일: {new Date(code.modified).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>

                    ))}
                </Grid>
            </Grid >
        </Box >
    )
}
