import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  InputBase,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Search, Menu as MenuIcon, Close } from "@mui/icons-material";
import image from "../../assets/image";
import { useNavigate, useLocation } from "react-router-dom";
import theme from "../../theme/theme";

const HeaderView = () => {
  interface MenuItem {
    name: string;
    path: string;
  }

  const menuItems: MenuItem[] = [
    { name: "Home", path: "/" },
    { name: "Leads", path: "/leads" },
    { name: "Orders", path: "/orders" },
    { name: "Students", path: "/students" },
    { name: "Transactions", path: "/transactions" },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeButtonIndex = menuItems.findIndex(
    (item) => item.path === location.pathname
  );

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClick = (path: string) => {
    if (drawerOpen) setDrawerOpen(false);
    navigate(path);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleCloseMenu();
  };

  const handleLogoutClick = () => {
    handleCloseMenu();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <IconButton onClick={handleDrawerToggle}>
        <Close />
      </IconButton>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.name}
            onClick={() => handleClick(item.path)}
            sx={{ textAlign: "center" }}
          >
            <ListItemText
              primary={item.name}
              sx={{
                borderBottom:
                  activeButtonIndex === index
                    ? `3px solid ${theme.palette.primary.dark}`
                    : "3px solid transparent",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: theme.palette.primary.contrastText,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 0 }}>
            <img
              src={image.vectorLogo}
              alt="Logo"
              style={{
                height: "40px",
                marginRight: "15px",
              }}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              backgroundColor: theme.palette.primary.main,
              justifyContent: "center",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            {menuItems.map((item, index) => {
              const isActive = activeButtonIndex === index;

              return (
                <Button
                  key={item.name}
                  onClick={() => handleClick(item.path)}
                  sx={{
                    color: theme.palette.text.primary,
                    borderBottom: isActive
                      ? `3px solid ${theme.palette.warning.light}`
                      : "",
                    textTransform: "none",
                    margin: 1,
                    fontSize: "1rem",
                    padding: 0,
                    borderRadius: 0,
                    height: "100%",
                    "&:hover": {
                      color: theme.palette.action.hover,
                    },
                  }}
                >
                  {item.name}
                </Button>
              );
            })}
          </Box>

          <InputBase
            placeholder={"Search, Contact, More"}
            startAdornment={
              <Search sx={{ mr: 1, color: theme.palette.secondary.main }} />
            }
            sx={{
              border: `1px solid ${theme.palette.primary.dark}`,
              borderRadius: "8px",
              padding: "2px 8px",
              width: "100%",
              maxWidth: "300px",
            }}
          />
          <Avatar
            alt="Profile"
            src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjEwMzQtZWxlbWVudC0wNi0zOTcucG5n.png"
            sx={{
              marginLeft: 2,
              height: 50,
              width: "auto",
            }}
            onClick={handleAvatarClick}
          />

          <IconButton
            edge="end"
            aria-label="menu"
            sx={{
              display: { xs: "flex", md: "none" },
              color: theme.palette.secondary.main,
            }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { md: "none" } }}
      >
        {drawer}
      </Drawer>

      {/* Avatar Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        MenuListProps={{ "aria-labelledby": "avatar-button" }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default HeaderView;
