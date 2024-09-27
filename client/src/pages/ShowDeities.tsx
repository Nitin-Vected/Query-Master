import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Chip,
  CardContent,
  Card,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import LanguageIcon from "@mui/icons-material/Language";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from "@mui/icons-material/CheckCircle";

import {
  Email,
  LocationOn,
  Camera,
  Verified,
  DonutSmall,
  ArrowOutward,
} from "@mui/icons-material";

const Data = [
  {
    title: "Add phots",
  },

  {
    title: "Add language",
  },
  {
    title: "Add Job",
  },
];

const ShowDeities = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleBoxClick = () => {
    document.getElementById("fileInput").click();
  };

  const newData = [
    {
      title: "Resume",
      subTitle: "Update",
      onPress: handleBoxClick
    },

    {
      title: "Resume headline",
    },
    {
      title: "Key skills",
    },
    {
      title: "Employment",
      subTitle: "Add",
    },
    {
      title: "IT skills",
      subTitle: "Add",
    },
    {
      title: "Profile summary",
    },
    {
      title: "Accomplishments",
    },
    {
      title: "Career profile",
    },
  ];

  const ProfileCard: React.FC = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: "20px 20px 20px 30px",
          minHeight: "264px",
          boxShadow: "0px 6px 12px rgba(30, 10, 58, 0.04)",
          borderRadius: "10px",
          position: "relative",
          maxWidth: {
            xs: "1070px",
            sm: "1100px",
            md: "1100px",
            lg: "1200px",
          },
          background: "white",
          mx: "auto",
          width: "100%",
          boxSizing: "inherit",
        }}
      >
        <Grid container spacing={20}>
          <Grid
            item
            xs={12}
            sm={7}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Stack in column for small screens
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: "150px", // Set width as per your style
                height: "150px", // Set height as per your style
                padding: 0, // Set padding to 0
                display: "flex", // Flexbox display
                cursor: "pointer", // Set cursor to pointer for clickable interaction
                position: "relative", // Relative positioning
              }}
              src=""
              alt="Profile Picture"
            />
            <Box
              sx={{
                ml: { xs: 0, sm: 4 },
                mt: { xs: 2, sm: 1 },
                textAlign: "left",
              }}
            >
              <Typography
                sx={{
                  wordWrap: "break-word", // Enabling word wrapping
                  color: "var(--N800)", // Using your custom color variable
                  fontWeight: 700, // Set font-weight to 700 (bold)
                  fontSize: "24px", // Set font size to 24px
                  lineHeight: "31px", // Set line-height to 31px
                }}
              >
                Aman Gurjar
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: 520,
                }}
              >
                <Typography
                  sx={{
                    marginTop: "4px!important",

                    fontSize: 15,
                    color: "#474D6A",
                    fontWeight: "500",
                  }}
                >
                  React Native Mobile Application
                  <br />
                  Developer
                </Typography>
                <Typography
                  sx={{
                    ml: { xs: 0, sm: 2 },
                    fontSize: 14.5,
                    mt: { xs: 1, sm: 0 }, // Space on small screens
                    color: "gray",
                    textAlign: "left",
                  }}
                >
                  Profile last updated: 23 Sep
                </Typography>
              </Box>

              <Typography
                sx={{
                  marginTop: "4px!important",

                  fontSize: 14,
                  color: "black",
                }}
              >
                Vhitural Height
              </Typography>
              <hr
                style={{
                  borderWidth: 0.2,
                  borderRight: "1px solid var(--N400)",
                  marginTop: 5,
                  width: "84%",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  mt: 2,

                  flexDirection: {
                    xs: "column",
                    sm: "row",
                    lg: "row",
                    md: "column",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mr: { sm: 3 },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocationOn sx={{ fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, ml: 1, color: "gray" }}
                    >
                      Mp Indore, INDIA
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocationOn sx={{ fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 13,
                        ml: 1,
                        color: "gray",
                        mr: { sm: 18 },
                      }}
                      style={{
                        width: 120,
                      }}
                    >
                      2 Years 2 Months
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocationOn sx={{ fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, ml: 1, color: "gray" }}
                    >
                      45 Days or less notice period
                    </Typography>
                    <Verified sx={{ fontSize: 20, color: "green", ml: 1 }} />
                  </Box>
                </Box>

                <hr
                  style={{
                    borderWidth: 0.2,
                    width: "46.667%",
                    borderColor: "#3c3b3b",
                    borderRight: "1px solid var(--N400)",
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mr: { sm: 3 },
                    marginLeft: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocationOn sx={{ fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, ml: 1, color: "gray" }}
                    >
                      Mp Indore, INDIA
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocationOn sx={{ fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 13,
                        ml: 1,
                        color: "gray",
                        mr: { sm: 18 },
                      }}
                      style={{
                        width: 120,
                      }}
                    >
                      2 Years 2 Months
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocationOn sx={{ fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, ml: 1, color: "gray" }}
                    >
                      45 Days or less notice period
                    </Typography>
                    <Verified sx={{ fontSize: 20, color: "green", ml: 1 }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12} // Full width on extra-small screens
            sm={15} // Half width on small screens
            md={5} // One-third width on medium screens
          >
            <Box
              sx={{
                width: "380px",
                padding: "22px",
                margin: 0,
                boxShadow: "none",
                backgroundColor: "#FFF2E3",
                borderRadius: "10px",
                position: "relative", // Added position: relative
                left: 2,
              }}
            >
              {Data.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                    }}
                  >
                    <Camera />
                    <Typography
                      sx={{
                        ml: 2,
                        fontSize: 15.5,
                        fontWeight: "5",
                        color: "#474d6a",
                        margin: "auto 20px",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      background: "white",
                      padding: "3px", // Updated padding
                      width: "47px", // Updated width
                      textAlign: "center", // Center align the text
                      borderRadius: "10px", // Rounded border
                      margin: "auto 0", // Center align the box vertically
                      border: "1px solid var(--N300)", // Updated border style,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowOutward style={{ height: 12, width: 12 }} />
                    <Typography
                      sx={{ fontSize: 12, fontWeight: "500", color: "#47b749" }}
                    >
                      10%
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  backgroundColor: "#f05537",
                  fontSize: 12.8,
                  color: "white",
                  borderRadius: "60px",
                  padding: "10px 14px",
                  margin: "auto",
                  width: 200,
                  fontWeight: "bold",
                }}
              >
                Add 3 missing details
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // const ProfileCard: React.FC = () => {
  //   return (

  //     <Box
  //       sx={{
  //         display: "flex",
  //         flexDirection: "column",
  //         p: 2,
  //         borderRadius: 2,
  //         boxShadow: "0px 0.6px 6px rgba(0, 0, 0, 0.1)", // Adjust shadow size as needed
  //         backgroundColor: "white",
  //         maxWidth: {
  //           xs: "1070px", // for extra-small screens
  //           sm: "1070px", // for small screens
  //           md: "1070px", // for medium screens
  //           lg: "1200px", // for large screens
  //         },

  //         mx: "auto",
  //         width: "100%",

  //         marginTop: 3.5,
  //        }}
  //     >
  //       <Grid container spacing={20} sx={{
  //                       padding:2

  //       }}>
  //         <Grid
  //           item
  //           xs={12}
  //           sm={7}
  //           sx={{
  //             display: "flex",
  //             flexDirection: { xs: "column", sm: "row" }, // Stack in column for small screens
  //             alignItems: "center",
  //           }}
  //         >
  //           <Avatar
  //             sx={{ width: 140, height: 140 }}
  //             src=""
  //             alt="Profile Picture"
  //           />
  //           <Box
  //             sx={{
  //               ml: { xs: 0, sm: 4 },
  //               mt: { xs: 2, sm: 1 },
  //               textAlign: "left",

  //             }}
  //            >
  //             <Typography style={{ fontSize: 15 }} fontWeight="bold">
  //               Aman Gurjar
  //             </Typography>
  //             <Box
  //               sx={{
  //                 display: "flex",
  //                 flexDirection: "row",
  //                 alignItems: "center",
  //               }}
  //             >
  //               <Typography variant="body1">
  //                 React Native Mobile Application Developer
  //               </Typography>
  //               <Typography
  //                 variant="body2"
  //                 sx={{
  //                   ml: { xs: 0, sm: 2 },
  //                   fontSize: 14.8,
  //                   color: "gray",
  //                   mt: { xs: 1, sm: 0 }, // Space on small screens
  //                 }}
  //               >
  //                 Profile last updated: 23 Sep, 2024
  //                 Profile
  //               </Typography>
  //             </Box>

  //             <Typography variant="body2"  >
  //               Vhitural Height
  //             </Typography>
  //             <hr
  //               style={{
  //                 borderWidth: 0.2,
  //                 marginTop: 10,
  //               }}
  //             />

  //             <Box
  //               sx={{
  //                 display: "flex",
  //                 mt: 2,

  //                 flexDirection: { xs: "column", sm: "row" },
  //               }}
  //             >
  //               <Box
  //                 sx={{
  //                   display: "flex",
  //                   flexDirection: "column",
  //                   mr: { sm: 3 },
  //                 }}
  //               >
  //                 <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
  //                   <LocationOn sx={{ fontSize: 20 }} />
  //                   <Typography
  //                     variant="body2"
  //                     sx={{ fontSize: 13, ml: 1, color: "gray" }}
  //                   >
  //                     Mp Indore, INDIA
  //                   </Typography>
  //                 </Box>
  //                 <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
  //                   <LocationOn sx={{ fontSize: 20 }} />
  //                   <Typography
  //                     variant="body2"
  //                     sx={{ fontSize: 13, ml: 1, color: "gray" ,mr: { sm: 18 },}}
  //                     style={{
  //                       width:120
  //                     }}
  //                   >
  //                     2 Years 2 Months
  //                   </Typography>
  //                 </Box>
  //                 <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
  //                   <LocationOn sx={{ fontSize: 20 }} />
  //                   <Typography
  //                     variant="body2"
  //                     sx={{ fontSize: 13, ml: 1, color: "gray" }}
  //                   >
  //                     45 Days or less notice period
  //                   </Typography>
  //                   <Verified sx={{ fontSize: 20, color: "green", ml: 1 }} />
  //                 </Box>
  //               </Box>

  //               {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
  //                 <Box sx={{ display: "flex", alignItems: "center", mt: 1,  sm:12}}>
  //                   <Email sx={{ fontSize: 20 }} />
  //                   <Typography
  //                     variant="body2"
  //                     sx={{ fontSize: 13, ml: 1, color: "gray" }}
  //                   >
  //                     amangurjar1507@gmail.com
  //                   </Typography>
  //                   <Verified sx={{ fontSize: 20, color: "green", ml: 1 }} />
  //                 </Box>
  //               </Box> */}
  //             </Box>
  //           </Box>
  //         </Grid>

  //         {/* Right Section with Action Buttons */}
  //         <Grid
  //           item
  //           xs={12} // Full width on extra-small screens
  //           sm={15} // Half width on small screens
  //           md={5} // One-third width on medium screens
  //           sx={{
  //             marginTop: 2,
  //             marginBottom: 1,
  //           }}
  //         >
  //           <Box
  //             sx={{
  //               display: "flex",
  //               flexDirection: "column",
  //               justifyContent: "space-between",
  //               height: "100%",
  //               p: 3,
  //               borderRadius: 2,
  //               background:"#FFF2E3"

  //             }}
  //           >
  //             {Data.map((item, index) => (
  //               <Box
  //                 key={index}
  //                 sx={{
  //                   display: "flex",
  //                   justifyContent: "space-between",
  //                   alignItems: "center",
  //                   mb: 1,
  //                 }}
  //               >
  //                 <Box sx={{ display: "flex", alignItems: "center" }}>
  //                   <Camera />
  //                   <Typography
  //                     sx={{
  //                       ml: 2,
  //                       fontSize: 13.5,
  //                       fontWeight: "500",
  //                       color: "gray",
  //                     }}
  //                   >
  //                     {item.title}
  //                   </Typography>
  //                 </Box>
  //                 <Typography
  //                   sx={{ fontSize: 14, fontWeight: "600", color: "green" }}
  //                 >
  //                   5%
  //                 </Typography>
  //               </Box>
  //             ))}

  //             <Button
  //               variant="contained"
  //               fullWidth
  //               sx={{
  //                 mt: 1,
  //                 backgroundColor: "#F05537",
  //                 fontSize: 13.5,
  //                 color: "white",
  //                 borderRadius: 5,
  //               }}
  //             >
  //               Add 3 missing details
  //             </Button>
  //           </Box>
  //         </Grid>
  //       </Grid>
  //     </Box>
  //   );
  // };

  return (
    <Box
      sx={{
        background: "#F8F8F8",
      }}
    >
      <Box sx={{ padding: 5 }}>
        <ProfileCard />
      </Box>
      <Grid container spacing={2} style={{ justifyContent: "center" }}>
        <Grid item xs={12} sm={11.9} md={16} lg={1.5}>
          <Paper
            elevation={1}
            style={{
              width: "100%",
              borderRadius: 10,
              borderColor: "red",
              borderWidth: 3,
              boxShadow: "0px 0.6px 6px rgba(0, 0, 0, 0.1)", // Adjust shadow size as needed
              padding: 8,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 1,
              }}
            >
              <Typography
                style={{
                  color: "black",
                  fontSize: 16,
                  fontWeight: "600",
                  fontStyle: "normal",
                  textAlign: "start",
                  marginLeft: 2,
                }}
              >
                Quick links
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // Stack items in a column for better layout
                alignItems: "flex-start",
                padding: 1, // Added padding for better spacing
              }}
            >
              <ul style={{ padding: 0 }}>
                {newData.map((item) => (
                  <li
                    key={item.title} // Make sure the key is unique, like item.title
                    style={{
                      marginBottom: "7px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 3,
                      width: "100%", // Ensure the links take up full width
                    }}
                  >
                    <Typography
                      variant="h6"
                      style={{
                        color: "black",
                        fontSize: 15,
                        fontWeight: "500",
                        fontStyle: "normal",
                        marginLeft: 7,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Box sx={{}}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "blue",
                          fontSize: {
                            xs: "1px", // for extra-small screens
                            sm: "1px", // for small screens
                            md: "5px", // for medium screens
                            lg: "15px", // for large screens
                          },

                          fontWeight: 500,
                          ml: { xs: 1, sm: 1, lg: 2 },
                        }}
                      >
                        {item.subTitle}
                      </Typography>
                    </Box>
                  </li>
                ))}
              </ul>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={15.9} md={16} lg={8.3}>
          <Paper
            elevation={1}
            style={{
              padding: "20px",
              flexDirection: "column",
              borderRadius: 10,
              borderColor: "gray",
              borderWidth: 3,
              marginBottom: "30px",
              boxShadow: "0px 0.6px 6px rgba(0, 0, 0, 0.1)", // Adjust shadow size as needed
            }}
          >
            <Typography
              style={{
                color: "black",
                fontSize: 15.5,
                fontWeight: "600",
                fontStyle: "normal",
                textAlign: "start",
                marginTop: -10,
              }}
            >
              Resume
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box
                display="flex"
                flexDirection="column"
                sx={{ textAlign: "start", marginTop: 2 }}
              >
                <Typography
                  variant="h6"
                  style={{
                    color: "black",
                    fontSize: 15,
                    fontWeight: "500",
                    fontStyle: "normal",
                  }}
                >
                  Ram-Rajput-Resume-july2021-1 9.pdf
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    color: "black",
                    fontSize: 15,
                    fontWeight: "500",
                    fontStyle: "normal",
                  }}
                >
                  Uploaded on Aug 28, 2024
                </Typography>
              </Box>
              <Box
                sx={{
                  flexDirection: "row",
                  display: "flex",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    color: "black",
                    fontSize: 15,
                    fontWeight: "500",
                    fontStyle: "normal",
                  }}
                >
                  Uploaded on Aug
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                color: "grey",
                borderWidth: 2,
                borderStyle: "dotted",
                padding: 2,
                borderRadius: 2,
                marginTop: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <Box
                  sx={{
                    padding: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    borderColor: "#2E5DF5",
                    color: "grey",
                    borderWidth: 1,
                    borderStyle: "solid",
                    flexDirection: "column",
                    cursor: "pointer", // Change cursor to pointer
                  }}
                  onClick={handleBoxClick} // Click to open file dialog
                >
                  <Typography
                    variant="h6"
                    style={{
                      color: "#2E5DF5",
                      fontSize: 14,
                      fontWeight: "bold",
                      fontStyle: "normal",
                    }}
                  >
                    {fileName || "Upload Resume"}
                  </Typography>
                </Box>
              </div>

              {/* <Box
                sx={{
                  padding: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  borderColor: "#2E5DF5",
                  color: "grey",
                  borderWidth: 1,
                  borderStyle: "solid",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    color: "#2E5DF5",
                    fontSize: 14,
                    fontWeight: "bold",
                    fontStyle: "normal",
                  }}
                >
                  Resume Uploaded
                </Typography>
              </Box> */}
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "500",
                  fontStyle: "normal",
                  marginTop: 12,
                }}
              >
                Supported Formats: doc, docx, rtf, pdf, upto 2 MB
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={1}
            style={{
              width: "100%",
              borderRadius: 10,
              borderColor: "gray",
              borderWidth: 3,
              textAlign: "start",
              padding: "20px",
              marginBottom: "40px",
              boxShadow: "0px 0.6px 6px rgba(0, 0, 0, 0.1)", // Adjust shadow size as needed
            }}
          >
            <Typography
              style={{
                color: "black",
                fontSize: 15.5,
                fontWeight: "600",
                fontStyle: "normal",
                textAlign: "start",
                marginTop: -12,
              }}
            >
              Resume headlineedit
            </Typography>{" "}
            <Typography
              variant="h6"
              style={{
                color: "black",
                fontSize: 15,
                fontWeight: "500",
                fontStyle: "normal",
                marginTop: 12,
              }}
            >
              I'm having around of Total Experience in React + React Native with
              good knowledge of SDLC and Agile. Looking for an employer where I
              can use my skills.{" "}
            </Typography>{" "}
          </Paper>

          <Paper
            elevation={1}
            style={{
              padding: "20px",
              marginBottom: "30px",
              flexDirection: "column",
              borderRadius: 10,
              borderColor: "gray",
              borderWidth: 3,
              textAlign: "start",
            }}
          >
            {" "}
            {/* Key Skills Section */}
            <Typography
              style={{
                color: "black",
                fontSize: 15.5,
                fontWeight: "600",
                fontStyle: "normal",
                marginTop: -12,
              }}
            >
              Key skill
            </Typography>
            <Box style={{ marginTop: "10px" }}>
              {[
                "Third Party API",
                "Redux State Management",
                "Firebase",
                "XCode",
                "Android Studio",
                "HTML",
                "Javascript",
                "React Native",
              ].map((skill) => (
                <Chip label={skill} key={skill} style={{ margin: "5px" }} />
              ))}
            </Box>
          </Paper>

          <Paper
            elevation={1}
            style={{
              padding: "20px",
              marginBottom: "30px",
              flexDirection: "column",
              borderRadius: 10,
              borderColor: "gray",
              borderWidth: 3,
              textAlign: "start",
              boxShadow: "0px 0.6px 6px rgba(0, 0, 0, 0.1)", // Adjust shadow size as needed
            }}
          >
            <Box
              flexDirection={"row"}
              justifyContent={"space-between"}
              display={"flex"}
            >
              <Typography
                style={{
                  color: "black",
                  fontWeight: "600",
                  fontStyle: "normal",
                  marginTop: -12,
                }}
                sx={{
                  fontSize: {
                    xs: "12px", // Font size for small screens
                    md: "15.5px", // Font size for medium and larger screens
                  },
                }}
              >
                EmploymentAdd
              </Typography>
              <Typography
                style={{
                  color: "#2E5DF5",
                  fontWeight: "600",
                  fontStyle: "normal",
                  marginTop: -12,
                }}
                sx={{
                  fontSize: {
                    xs: "12px", // Font size for small screens
                    md: "15.5px", // Font size for medium and larger screens
                  },
                }}
              >
                Add employment
              </Typography>
            </Box>

            <Box
              flexDirection={"column"}
              justifyContent={"space-between"}
              display={"flex"}
            >
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "500",
                  fontStyle: "normal",
                  marginTop: 12,
                }}
              >
                React + React Native Mobile and Web Developer
              </Typography>{" "}
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontSize: 14,
                  fontWeight: "500",
                  fontStyle: "normal",
                }}
              >
                VSA
              </Typography>{" "}
              <Typography
                variant="h6"
                style={{
                  color: "gray",
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 14.5,
                }}
              >
                Full-time Feb 2023 to Present (1 year 8 months) 15 Days or less
                Notice Period
              </Typography>
              <Typography
                variant="h6"
                style={{
                  color: "#2E5DF5",
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 14.5,
                }}
              >
                Add job profile
              </Typography>{" "}
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 14.5,
                }}
              >
                Top 5 key skills:
              </Typography>{" "}
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 15.5,
                  marginTop: 3,
                }}
              >
                IT & Information Security - Other
              </Typography>{" "}
            </Box>
          </Paper>

          <Paper
            elevation={1}
            style={{
              padding: "20px",
              marginBottom: "30px",
              flexDirection: "column",
              borderRadius: 10,
              borderColor: "gray",
              borderWidth: 3,
              textAlign: "start",
              boxShadow: "0px 0.6px 6px rgba(0, 0, 0, 0.1)", // Adjust shadow size as needed
            }}
          >
            <Box
              flexDirection={"row"}
              justifyContent={"space-between"}
              display={"flex"}
            >
              <Typography
                style={{
                  color: "black",
                  fontWeight: "600",
                  fontStyle: "normal",
                  marginTop: -12,
                }}
                sx={{
                  fontSize: {
                    xs: "12px", // Font size for small screens
                    md: "15.5px", // Font size for medium and larger screens
                  },
                }}
              >
                EmploymentAdd
              </Typography>
              <Typography
                style={{
                  color: "#2E5DF5",
                  fontWeight: "600",
                  fontStyle: "normal",
                  marginTop: -12,
                }}
                sx={{
                  fontSize: {
                    xs: "12px", // Font size for small screens
                    md: "15.5px", // Font size for medium and larger screens
                  },
                }}
              >
                Add employment
              </Typography>
            </Box>

            <Box
              flexDirection={"column"}
              justifyContent={"space-between"}
              display={"flex"}
            >
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontSize: 15.5,
                  fontWeight: "600",
                  fontStyle: "normal",
                  marginTop: 12,
                }}
              >
                BCA Computers
              </Typography>{" "}
              <Typography
                variant="h6"
                style={{
                  color: "gray",
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 14.5,
                }}
              >
                Devi Ahilya Vishwa Vidhyalaya (DAVV), Indore
              </Typography>
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 14.5,
                }}
              >
                2021-2024Full Time
              </Typography>{" "}
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 14.5,
                  marginTop: 5,
                }}
              >
                Class XII
              </Typography>{" "}
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 14.5,
                }}
              >
                Madhya Pradesh
              </Typography>{" "}
              <Typography
                variant="h6"
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 15.5,
                }}
              >
                2015
              </Typography>
              <Typography
                variant="h6"
                style={{
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 16.5,
                  color: "#2E5DF5",
                  marginTop: 12,
                }}
              >
                Add doctorate/PhD
              </Typography>
              <Typography
                variant="h6"
                style={{
                  fontWeight: "500",
                  fontStyle: "normal",
                  fontSize: 16.5,
                  color: "#2E5DF5",
                  marginTop: 12,
                }}
              >
                Add masters/post-graduation
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShowDeities;
