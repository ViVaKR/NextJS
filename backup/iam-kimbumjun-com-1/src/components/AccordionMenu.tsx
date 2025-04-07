import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ICategory } from '@/interfaces/i-category';
import { getCategories } from '@/data/category';
export default function AccordionMenu() {
  const menus: ICategory[] = getCategories();
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
              <Typography component="span">{menu.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>{menu.id}</AccordionDetails>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
