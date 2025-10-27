'use client';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Typography, useTheme } from '@mui/material';
interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


export default function ScrollableTabsButtonAuto() {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();

    const handleChange = (e: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', width: '95%', marginBottom: '2em', margin: 'auto', minHeight: '30vh' }}>

            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"

            >
                <Tab label="Item One"  {...a11yProps(0)} />
                <Tab label="Item Two"  {...a11yProps(1)} />
                <Tab label="Item Three"  {...a11yProps(2)} />
                <Tab label="Item Four"  {...a11yProps(3)} />
                <Tab label="Item Five"  {...a11yProps(4)} />
                <Tab label="Item Six"  {...a11yProps(5)} />
                <Tab label="Item Seven"  {...a11yProps(6)} />
            </Tabs>
            <TabPanel value={value} index={0} dir={theme.direction}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={4} dir={theme.direction}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={5} dir={theme.direction}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={6} dir={theme.direction}>
                Item Three
            </TabPanel>
        </Box>
    );
}
