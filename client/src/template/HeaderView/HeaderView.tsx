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
} from "@mui/material";
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import image from "../../assets/image"; // Ensure you import the correct logo path
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme"; // Adjust based on your theme location

const HeaderView = () => {
  interface MenuItem {
    name: string;
    path: string;
  }

  const menuItems: MenuItem[] = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/" },
    { name: "Leads", path: "/leads" },
    { name: "Transactions", path: "/" },
    { name: "Orders", path: "/" },
    { name: "Students", path: "/" },
  ];

  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClick = (path: string, index: number) => {
    setActiveButtonIndex(index);
    navigate(path);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <IconButton onClick={handleDrawerToggle}>
        <CloseIcon />
      </IconButton>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.name}
            onClick={() => handleClick(item.path, index)}
            sx={{ textAlign: "center" }}
          >
            <ListItemText primary={item.name} />
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
        elevation={0}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          {/* Logo for All Views */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 0 }}>
            <img
              src={image.vectorLogo}
              alt="Logo"
              style={{
                height: "45px",
                marginRight: "15px",
              }}
            />
          </Box>

          {/* Navigation Links for Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              backgroundColor: theme.palette.primary.main,
              justifyContent: "center",
            //   flexGrow: 1,
            }}
          >
            {menuItems.map((item, index) => (
              <Button
                key={item.name}
                onClick={() => handleClick(item.path, index)}
                sx={{
                  color: activeButtonIndex === index ? theme.palette.primary.dark : theme.palette.text.primary,
                  textTransform: "none",
                  marginLeft: 1.5,
                  "&:hover": {
                    color: theme.palette.action.hover,
                    backgroundColor: theme.palette.primary.main,
                  },
                  backgroundColor: activeButtonIndex === index ? theme.palette.primary.light : "transparent",
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Search Input for All Views */}
          <Box
            sx={{
              display: "flex",
              backgroundColor: theme.palette.primary.contrastText,
              borderRadius: "9px",
              borderWidth: 1.5,
              borderColor: theme.palette.divider,
              borderStyle: "solid",
              height: "39px",
              alignItems: "center",
              flexGrow: 1, // Fill remaining space
              maxWidth: { md: "400px" }, // Limit width on larger screens
              marginLeft: 2,
            }}
          >
            <IconButton>
              <SearchIcon
                style={{ fontSize: 20, color: theme.palette.secondary.main }}
              />
            </IconButton>
            <InputBase
              placeholder="Search, Contact, More"
              sx={{
                color: theme.palette.primary.dark,
                fontSize: { xs: "12px", sm: "14px" },
                flex: 1,
                "& .MuiInputBase-input::placeholder": {
                  color: theme.palette.secondary.main,
                },
              }}
            />
          </Box>

          {/* Avatar for All Views */}
          <Avatar
            alt="Profile"
            src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjEwMzQtZWxlbWVudC0wNi0zOTcucG5n.png"
            sx={{
              marginLeft: 2,
              height: 60,
              width: "auto",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          />

          {/* Hamburger Menu Icon for Mobile View */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "flex", md: "none" }, color: 'black'  }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Menu Links */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { md: "none" } }} // Only display drawer on mobile screens
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default HeaderView;
