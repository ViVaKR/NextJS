// src/components/CategoryAccordion.tsx
'use client';
import { ICategory } from '@/interfaces/i-category';
import { ICode } from '@/interfaces/i-code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface CategoryAccordionProps {
  categories: ICategory[];
  codes: ICode[];
}

export default function CategoryAccordion({
  categories,
  codes,
}: CategoryAccordionProps) {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const pathname = usePathname() ?? '';

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const getLinkClasses = (url: string) => {
    const isActive = pathname?.startsWith(url);
    const baseClasses = isActive ? 'text-red-500' : 'text-slate-700';
    const className =
      'text-sm hover:bg-slate-200 py-2 px-2\
      flex items-center\
      hover:rounded-lg hover:text-red-500\
      overflow:auto text-nowrap transition-colors\
      duration-200';

    const finalClasses = `${className} ${baseClasses}`;
    return finalClasses;
  };

  const getCountCode = (id: number) => {
    return codes.filter((code) => code.categoryId === id).length;
  };

  const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 'none',
    },
  });


  return (
    <div>
      {categories
        .sort((a, b) => a.name.localeCompare(b.name)) // 정렬
        .map((category) => {
          const categoryCodes = codes.filter(
            (code) => code.categoryId === category.id
          );

          return (
            <div
              key={category.id}
              className="mb-1">
              <Accordion
                expanded={expanded === category.name}
                onChange={handleChange(category.name)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${category.id}-content`}
                  id={`panel-${category.id}-header`}
                  onFocus={(e) => e.preventDefault()} // 포커스 이동 방지
                >
                  <Link
                    href={`/code/${category.id}`}
                    className="block font-bold text-sm hover:text-red-500 py-2 px-4 hover:rounded-lg text-slate-700"
                    title={category.name}>
                    <Typography
                      component="span"
                      className="flex justify-between w-full gap-4 items-center">
                      {category.name}

                      <span className="text-slate-400">{` (${getCountCode(
                        category.id
                      )})`}</span>
                    </Typography>
                  </Link>
                </AccordionSummary>
                <AccordionDetails>
                  {categoryCodes.length > 0 ? (
                    <ul>
                      {categoryCodes.map((code) => {
                        const url = `/code/read/${code.id}`;
                        return (
                          <li key={code.id}>

                            <NoMaxWidthTooltip title={`${code.title}, ${code.subTitle}`} arrow placement='right'>
                              <Link
                                href={url}

                                className={getLinkClasses(url)}>
                                <TouchAppOutlinedIcon sx={{ mr: 1 }} />
                                {code.id}. {code.title.length > 25 ? (code.title.substring(0, 25) + '...') : (code.title)}
                              </Link>
                            </NoMaxWidthTooltip>

                            {/* <Tooltip title={`${code.title} (${code.subTitle})`} arrow placement='right'>
                              <Link
                                href={url}

                                className={getLinkClasses(url)}>
                                <TouchAppOutlinedIcon sx={{ mr: 1 }} />
                                {code.id}. {code.title.length > 25 ? (code.title.substring(0, 25) + '...') : (code.title)}
                              </Link>
                            </Tooltip> */}

                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary">
                      코드없음
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
    </div>
  );
}
