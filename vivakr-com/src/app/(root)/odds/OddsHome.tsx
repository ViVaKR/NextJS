'use client';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { getOddsItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import OddsAccordion from './accordion/OddsAccordion';
import OddsCodeRunner from './code-runner/OddsCodeRunner';
import OddsCodeHtml from './code-html/OddsCodeHtml';
import MazeGame from './maze/MazeGame';
import MarbleGame from './marble/page';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const components = [
  { id: 0, Component: OddsCodeRunner, props: {} },
  { id: 1, Component: OddsCodeHtml, props: {} },
  { id: 2, Component: OddsAccordion, props: {} },
  { id: 3, Component: MazeGame, props: {} },
  { id: 4, Component: MarbleGame, props: {} }

];

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function OddsHome() {

  const [value, setValue] = React.useState(0);
  const menus: IMenu[] = getOddsItems();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const filterMenus = menus.filter((menu) => {
    return true;
  });

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        margin: '0.5rem 1rem',
        maxWidth: '100%',
        minHeight: '100vh',
      }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{
          maxWidth: 'calc(100vw - 2rem)',
        }}>
        {filterMenus.map((menu, index) => (
          <Tab
            key={index}
            label={menu.title}
            {...a11yProps(menu.id)}
          />
        ))}
      </Tabs>
      <div>
        {components.map((menu, index) => (
          <CustomTabPanel
            key={index}
            value={value}
            index={menu.id}>
            <menu.Component
              key={menu.id}
              {...menu.props}
            />
          </CustomTabPanel>
        ))}
      </div>
    </Box>
  );
}
