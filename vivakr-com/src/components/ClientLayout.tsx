// src/components/ClientLayout.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { ICode } from '@/interfaces/i-code';
import { ICategory } from '@/interfaces/i-category';
import CategoryAccordion from '@/components/CategoryAccordion';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Tooltip } from '@mui/material';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { userDetailAsync } from '@/services/auth.service';
import CreateIcon from '@mui/icons-material/Create';
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';

interface ClientLayoutProps {
  codes: ICode[];
  categories: ICategory[];
  children: React.ReactNode;
}

export default function ClientLayout({
  codes: initialCodes,
  categories: initialCategories,
  children,
}: ClientLayoutProps) {

  const [codes, setCodes] = useState<ICode[]>(initialCodes);
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // 클라이언트 마운트 여부 확인
  const pathname = usePathname();
  // const [admin, setAdmin] = useState<boolean>();
  const router = useRouter();
  const [fullName, setFullName] = useState<string>();
  const [confirmed, setConfirmed] = useState<boolean | null>(false);

  useEffect(() => {
    const getUserDetail = async () => {
      const detail: IUserDetailDTO | null = await userDetailAsync();
      setFullName(detail?.fullName);
      setConfirmed(detail?.emailConfirmed ?? false);
    }
    getUserDetail();

  }, [router]);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('menuCollapsed');
      if (savedState !== null) {
        setIsCollapsed(JSON.parse(savedState));
      }
    } catch (e: any) {
      setIsCollapsed(false); // 기본값으로 복구
    }
    setIsMounted(true); // 클라이언트 마운트 완료
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('menuCollapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isMounted]);

  useEffect(() => {
    setCodes(initialCodes); // 서버에서 받은 최신 코드로 갱신
    setCategories(initialCategories);
  }, [initialCodes, initialCategories]);

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev); // 토글
  };

  const gridClass = useMemo(() =>
    isCollapsed
      ? 'grid grid-cols-1 min-h-screen p-2'
      : 'grid grid-cols-[300px_minmax(200px,1fr)] min-h-screen p-2',
    [isCollapsed]);

  // Left Menu 애니메이션 variants 정의
  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    closed: {
      opacity: 0,
      x: -20, // 왼쪽으로 살짝 밀려나면서 사라짐
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  // * Start Point
  return (
    <div className={gridClass}>

      {/* 상단 아이콘 메뉴 */}
      <div
        className='col-span-2 max-w-full flex justify-evenly
        text-base border-b-slate-200 border-b-2 mb-2'
      >

        {/* 메뉴 숨김/보기 */}
        <button
          type="button"
          className="cursor-pointer
          hover:text-red-400
          text-slate-400
          start-0 shrink"
          onClick={handleToggle}
          aria-label={isCollapsed ? '카테고리 보기' : '카테고리 숨김'}
        >

          {isMounted && (
            <Tooltip title={isCollapsed ? '카테고리 보기' : '카테고리 숨김'} arrow>
              <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
                {isCollapsed ? (<CloseFullscreenOutlinedIcon />) : (<OpenInFullOutlinedIcon />)}
              </span>
            </Tooltip>
          )}
        </button>

        <Link
          href="/code"
          id='code'
          className="hover:text-red-400 text-slate-400 shrink">
          <Tooltip title="데이터 목록" arrow>
            <FormatListBulletedOutlinedIcon />
          </Tooltip>
        </Link>

        {fullName ? (
          <Link
            href="/code/create"
            id='code-create'
            className="hover:text-red-400 shrink text-slate-400">
            <Tooltip title={`${fullName}님! 글쓰기 (이메일 인증 후 필요)`} arrow>
              <EditNoteOutlinedIcon />
            </Tooltip>
          </Link>
        ) : (
          <Tooltip title='회원가입 및 이메일 확인 후 글쓰기 가능합니다.' arrow>
            <Link
              href={'/membership/sign-in'}
              id='membership-sign-in'
              className='text-base text-slate-400 hover:!text-red-500'>
              <CreateIcon />
            </Link>
          </Tooltip>
        )}

      </div >

      {/* Left Menu with Animation */}
      <AnimatePresence>
        {
          !isCollapsed && (
            <motion.aside
              className="start-0 flex flex-col gap-1 mr-2"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed">
              <h5 className="h-12 w-full bg-slate-100 rounded-full
                  shadow-cyan-500/50 shadow-xs content-center text-center" >
                카테고리
              </h5>
              <span className="max-h-screen overflow-y-scroll">
                <CategoryAccordion categories={categories} codes={codes} />
              </span>
            </motion.aside>
          )
        }
      </AnimatePresence >
      <AnimatePresence mode="wait">
        <motion.main key={pathname}
          className="max-md:start-0 start-1 w-full h-screen overflow-x-scroll"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }} >
          {children}
        </motion.main>
      </AnimatePresence>
    </div >
  );
}
