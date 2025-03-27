'use client';

import VivBlogCard from '@/components/VivBlogCard';
import VivTitle from '@/components/VivTitle';
import { IBlogPost } from '@/interfaces/i-blog-post';
import { Box } from '@mui/material';

export default function Blog() {
  const samplePost: IBlogPost = {
    id: 1,
    title: 'My First Blog Post',
    imageUrl: '/images/hills.webp',
    codeText: `function helloWorld() {\n  console.log("Hello, World!");\n}`,
    description: 'This is a sample blog post with code.',
  };
  return (
    <>
      <VivTitle title="Blog" />
      <Box sx={{ p: 4 }}>
        <VivBlogCard post={samplePost} />
      </Box>
    </>
  );
}
