'use client';
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { IBlogPost } from '@/interfaces/i-blog-post';

export default function VivBlogCard({ post }: { post: IBlogPost }) {
  return (
    <Card
      sx={{
        maxWidth: 600, // 워드프레스처럼 적당한 너비
        margin: 'auto',
        my: 2, // 상하 마진
        boxShadow: 3, // 살짝 입체감
        borderRadius: 2, // 부드러운 모서리
      }}>
      {/* 이미지 */}
      <CardMedia
        component="img"
        height="200" // 고정 높이로 비율 유지
        image={post.imageUrl}
        alt={post.title}
        sx={{ objectFit: 'cover' }}
      />

      {/* 제목과 본문 */}
      <CardContent>
        {/* 제목 */}
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          sx={{ fontWeight: 'bold' }}>
          {post.title}
        </Typography>

        {/* 설명 (선택적) */}
        {post.description && (
          <Typography
            variant="body2"
            color="text.secondary">
            {post.description}
          </Typography>
        )}

        {/* 코드 텍스트 */}
        <Box
          component="pre"
          sx={{
            backgroundColor: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            overflowX: 'auto', // 긴 코드 스크롤 가능
            fontFamily: 'monospace',
          }}>
          <code>{post.codeText}</code>
        </Box>
      </CardContent>
    </Card>
  );
}
