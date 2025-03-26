// src/app/demos/Drawer.tsx
"use client";
import { getDemoItems } from "@/data/menu-items";
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
    const menus: IMenu[] = getDemoItems();

    return (
        <Drawer
            sx={{
                width: drawerWidth,

                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    height: "auto",
                    top: '5em',
                    overflowY: 'scroll',
                    textWrap: 'nowrap',
                    borderRadius: '0.5em',
                    mr: '1em',
                    boxSizing: "border-box",
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
                            <span className="material-symbols-outlined mr-2">
                                {menu.icon}
                            </span>
                            <ListItemText primary={menu.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}
