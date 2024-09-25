import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Divider,
  Link,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
 import { CameraAlt, Translate, Description } from '@mui/icons-material';


const ShowDeities = () => {


  const ProfileCard  =  () => {
    return (
<Card sx={{ p: 2, borderRadius: 4, boxShadow: 3, maxWidth: 800, margin: 'auto' }}>
      <Grid container spacing={2}>
        {/* Left section with avatar and completion rate */}
        <Grid item xs={12} md={3} container >
          <Box  textAlign="center">
            <Avatar
              alt="Profile Image"
              sx={{ width: 180, height: 180 }}
            />
            {/* <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'white',
                px: 1,
                borderRadius: '50%',
                boxShadow: 1,
              }}
            >
              <Typography variant="caption" color="green">85%</Typography>
            </Box> */}
          </Box>
        </Grid>

        {/* Middle section with profile details */}
        <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h6" component="div">
              Aman Gurjar <IconButton size="small">✎</IconButton>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              React Native Mobile Application Developer at Vhtural Height
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Profile last updated - 23 Sep, 2024
            </Typography>

            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body2">📍 Indore, INDIA</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">2 Years 2 Months</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">₹ 3,45,000</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">📞 9343513692 ✅</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">📧 amangurjar1507@gmail.com ✅</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">⏳ 15 Days or less notice period</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>

        {/* Right section with action buttons */}
        <Grid item xs={12} md={3} container alignItems="center">
          <Box sx={{ p: 2, bgcolor: '#FFF5E1', borderRadius: 2, textAlign: 'center', width: '100%' }}>
            <Box>
              <IconButton>
                <CameraAlt />
              </IconButton>
              <Typography variant="body2">Add photo</Typography>
              <Typography variant="caption" color="green">+5%</Typography>
            </Box>
            <Box mt={2}>
              <IconButton>
                <Translate />
              </IconButton>
              <Typography variant="body2">Add languages</Typography>
              <Typography variant="caption" color="green">+2%</Typography>
            </Box>
            <Box mt={2}>
              <IconButton>
                <Description />
              </IconButton>
              <Typography variant="body2">Add job summary</Typography>
              <Typography variant="caption" color="green">+8%</Typography>
            </Box>
            <Box mt={2}>
              <Button variant="contained" color="error" sx={{ width: '100%' }}>
                Add 3 missing details
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>


    );
  };
  



  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
    <ProfileCard/>
    </Box>
  );
};

export default ShowDeities;
