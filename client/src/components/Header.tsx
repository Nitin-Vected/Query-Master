import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store"; // Import the necessary types
import { clearUserData } from "../app/authSlice"; // Import the action creator
import { GridCloseIcon } from "@mui/x-data-grid";

const ResponsiveDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch(); // Use Redux dispatch
  const userData = useSelector((state: RootState) => state.auth.userData); // Get user data from Redux store

  const onLogOut = () => {
    dispatch(clearUserData());
    navigate("/login");
  };
  const onNavigate = () => {
    setIsDrawerOpen(false)
    navigate("/showDeities");
  };

  const drawerList = () => (
    <Box sx={{ width: 360, padding: 2.2 }}>
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={toggleDrawer(false)}>
          <GridCloseIcon />
        </IconButton>
      </Box>

      {/* Profile Section */}
      <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
        <Avatar sx={{ width: 57, height: 57, mb: 1 }}>AG</Avatar>
        <Box display="flex" flexDirection="column" marginLeft={1.5}>
          <Typography
            style={{
              color: "black",
              fontSize: 16,
              fontWeight: "600",
              fontStyle: "normal",
            }}
          >
            Ram Gurjar
          </Typography>

          <Typography
            style={{
              color: "black",
              fontSize: 14,
              fontStyle: "normal",
              maxWidth: 180,
            }}
          >
            Vector skill academy Vector Skill Academy
          </Typography>
          <Typography
            onClick={onNavigate}
            style={{ color: "blue", fontSize: 15, marginTop: 10 }}
          >
            View & Update Profile
          </Typography>
        </Box>
      </Box>
      <hr style={{ borderWidth: 0.2, borderColor: "#ebd5d5" }} />
      <Box
        display="flex"
        flexDirection="row"
        marginTop={2.5}
        justifyContent={"space-between"}
        alignItems="center"
        mb={2}
      >
        <Typography
          style={{
            color: "black",
            fontSize: 15,
            fontWeight: "600",
          }}
        >
          Your Profile Performance
        </Typography>
        <Typography style={{ color: "gray", fontSize: 12, fontWeight: "500" }}>
          Last 90 days
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="space-around"
        alignItems={"center"}
        mb={2}
        sx={{
          background: "#F5FAFF",
          height: 110,
          borderRadius: 2.5,
        }}
      >
        <Box textAlign="center">
          <Typography
            variant="h6"
            style={{
              color: "black",
              fontSize: 20,
              fontWeight: "600",
              fontStyle: "normal",
            }}
          >
            575
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: "black",
              fontSize: 13.5,
            }}
          >
            Search Appearances
          </Typography>
          <Typography
            style={{
              color: "blue",
              fontSize: 12.5,
              marginTop: 2,
            }}
          >
            View all
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography
            variant="h6"
            color="primary"
            style={{
              color: "black",
              fontSize: 20,
              fontWeight: "600",
              fontStyle: "normal",
            }}
          >
            31
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: "black",
              fontSize: 13.5,
            }}
          >
            Recruiter Actions
          </Typography>
          <Typography
            style={{
              color: "blue",
              fontSize: 12.5,
              marginTop: 2,
            }}
          >
            View all
          </Typography>
        </Box>
      </Box>

      {/* List of Actions */}
      <List style={{ marginLeft: -14 }}>
        <ListItem>
          <ListItemIcon style={{ minWidth: "auto", marginRight: "8px" }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Recruiter Actions" />
        </ListItem>

        <ListItem>
          <ListItemIcon style={{ minWidth: "auto", marginRight: "8px" }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>

        <ListItem>
          <ListItemIcon style={{ minWidth: "auto", marginRight: "8px" }}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="FAQs" />
        </ListItem>

        <ListItem>
          <ListItemIcon style={{ minWidth: "auto", marginRight: "8px" }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText onClick={onLogOut} primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {/* <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}> */}
      <header className="header">
        <div className="logo">
          <Link to="/">Support Desk</Link>
        </div>
        <ul>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          {userData ? (
            <>
              <li>
                {/* <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton> */}
                {/* <span onClick={toggleDrawer(true)}>Role: {userData.role}</span>{" "} */}
                {/* Display user role */}
              </li>
              <li>
                <button className="btn" onClick={onLogOut}>
                  <FaSignOutAlt /> Log Out
                </button>
              </li>
            </>
          ) : (
            ""
          )}
        </ul>
      </header>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            borderRadius: "10px", // Adjust the value as per your design
          },
        }}
      >
        {drawerList()}
      </Drawer>
    </div>
  );
};

export default ResponsiveDrawer;
