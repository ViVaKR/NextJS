'use client'
import { ICode } from '@/interfaces/i-code';
import { Item } from '@/styled/VivStyled';
import { Box, Card, CardContent, Link, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

interface FeaturedCodeItemsProps {
    codes: ICode[];
}

export default function VivFeaturedCodeItems({ codes }: FeaturedCodeItemsProps) {
    if (!codes || codes.length === 0) {
        return null;
    }

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
                                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
                                        {code.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {/* 부제목이 길 수 있으니 줄임표 처리 */}
                                        {code.subTitle && code.subTitle.length > 80
                                            ? `${code.subTitle.substring(0, 80)}...`
                                            : code.subTitle}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        작성자: {code.userName} | 등록일: {new Date(code.modified).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>

                    ))};
                </Grid>
            </Grid >
        </Box >
    );
}
