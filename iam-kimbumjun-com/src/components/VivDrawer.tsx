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

const drawerWidth = 250;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

export default function VivDrawerComponent({ open = false, setOpen }: DrawerProps) {
    const theme = useTheme();
    const menus: IMenu[] = getDemoItems();

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    height: "100vh",
                    boxSizing: "border-box",
                },
            }}
            variant="temporary"
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
        >
            <DrawerHeader>
                <IconButton onClick={() => setOpen(false)}>
                    {theme.direction === "ltr" ? (
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
                            <ListItemText primary={menu.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}
