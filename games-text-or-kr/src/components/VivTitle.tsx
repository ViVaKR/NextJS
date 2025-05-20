import DesktopMacOutlinedIcon from '@mui/icons-material/DesktopMacOutlined';

import { Cute_Font } from 'next/font/google';
const cute = Cute_Font({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
});

interface VivTitleProps {
    title: string;
    fontColor?: string;
}

export default function VivTitle({
    title,
    fontColor,
}: VivTitleProps) {
    return (
        <h2
            className={`${fontColor ?? 'text-sky-800'}
        ${cute.className} rounded-full flex items-center justify-center text-center`}>
            <DesktopMacOutlinedIcon sx={{ mr: 1 }} />
            {title}
        </h2>
    );
}
