// // src/app/demos/page.tsx
// "use client";
// import { getDemoItems } from "@/data/menu-items";
// import { IMenu } from "@/interfaces/i-menu";
// import {
//   Box,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   styled,
//   useTheme,
// } from "@mui/material";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { useRouter } from "next/navigation";
// // import Link from "next/link";

// export interface DemosPageProps {
//   open?: boolean;
//   setOpen: (value: boolean) => void;
// }

// const drawerWidth = 250;

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

// export default function DemosPage({ open = false, setOpen }: DemosPageProps) {
//   const theme = useTheme();
//   const menus: IMenu[] = getDemoItems();
//   const route = useRouter();

//   const handleGoto = (url: string) => {
//     handleDrawerClose();
//     route.push(url);
//   }

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <Drawer
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//             height: "100vh",
//             position: 'absolute',
//             top: '4.6em',
//             boxSizing: "border-box",
//           },
//         }}
//         variant="temporary"
//         anchor="left"
//         open={open}
//       >
//         <DrawerHeader>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === "ltr" ? (
//               <ChevronLeftIcon />
//             ) : (
//               <ChevronRightIcon />
//             )}
//           </IconButton>
//         </DrawerHeader>
//         <Divider />
//         <List>
//           {menus.map((menu, index) => (
//             <ListItem key={index}>
//               <ListItemButton onClick={() => handleGoto(menu.url)}>
//                 <ListItemText primary={menu.title} />
//               </ListItemButton>
//               {/* <Link key={index} href={menu.url}>{menu.title}</Link> */}
//               {/* <ListItemButton
//                 component={Link}
//                 href={menu.url}
//                 onClick={() => setOpen(false)}
//                 sx={{ "&:hover": { bgcolor: "grey.100" } }}
//               ></ListItemButton> */}
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>
//     </Box>
//   );
// }


// src/app/demos/page.tsx
"use client";
import { Typography } from "@mui/material";

export default function DemosPage() {
  return (
    <Typography variant="h6">Welcome to the Demos Page!</Typography>
  );
}
