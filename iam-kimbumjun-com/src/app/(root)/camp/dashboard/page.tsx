import VivBlogCard from '@/components/VivBlogCard';
import { IBlogPost } from '@/interfaces/i-blog-post';



export default function DashboardPage() {

    const posts: IBlogPost = {
        id: 1,
        title: 'Fine Thanks And You',
        imageUrl: '',
        codeText: 'Good',
        description: '설명 글'
    }

    return (
        <div>
            <VivBlogCard post={posts} />
        </div>
    );
}
