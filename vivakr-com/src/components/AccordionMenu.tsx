import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ILanguage } from '@/interfaces/i-language';
import { categoryLang } from '@/data/languages';
export default function AccordionMenu() {
  const menus: ILanguage[] = categoryLang;
  return (
    <div>
      {menus.map((menu, idx) => (
        <div
          key={idx}
          className="mb-1">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header">
              <Typography component="span">{menu.id}. {menu.displayName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt possimus hic ea maxime eaque molestias quisquam labore sed optio! Est quisquam, doloremque eum eius soluta ratione autem impedit in fugiat.
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
