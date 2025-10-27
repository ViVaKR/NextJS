// src/app/demos/Drawer.tsx
"use client";
import { getOddsItems } from "@/data/menu-items";
import { IMenu } from "@/interfaces/i-menu";
import {
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    styled,
    useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import AirplayOutlinedIcon from '@mui/icons-material/AirplayOutlined';

export interface DrawerProps {
    open?: boolean;
    setOpen: (value: boolean) => void;
}

const drawerWidth = 'auto';

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

export default function VivDrawer({ open = false, setOpen }: DrawerProps) {
    const theme = useTheme();
    const menus: IMenu[] = getOddsItems();

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    height: "calc(100vh - 5em)",
                    top: '5em',
                    overflowY: 'auto',
                    textWrap: 'nowrap',
                    borderRadius: '0.5em',
                    mr: '1em',
                    zIndex: '100',
                    boxSizing: "border-box",
                },
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: theme.palette.grey[400],
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: theme.palette.grey[100],
                },
            }}
            variant="temporary"
            anchor="right"
            open={open}

            onClose={() => setOpen(false)}
        >
            <DrawerHeader>
                <IconButton onClick={() => setOpen(false)}>
                    {theme.direction === "rtl" ? (
                        <ChevronLeftIcon />
                    ) : (
                        <ChevronRightIcon />
                    )}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {menus.map((menu, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            component={Link}
                            href={menu.url}
                            onClick={() => setOpen(false)}
                        >
                            <span className="flex gap-2 items-center w-auto">
                                <AirplayOutlinedIcon />
                                <ListItemText primary={menu.title} />
                            </span>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}
