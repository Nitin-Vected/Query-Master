import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  Avatar,
  TextField,
  MenuItem,
} from "@mui/material";
import {Add, TrackChanges, AccessAlarm, Facebook, WhatsApp, WarningAmber} from "@mui/icons-material";
import { Task } from "./interface";

const tasks: Task[] = [
  {
    lead: "Sarah",
    description: "Message",
    assign: "Peter",
    status: "Late",
    dueDate: "02/02/2024",
    priority: "High",
  },
];

const getStartedSectionData = [
  {
    title: "Lead",
    description: "Connect with potential customers",
  },
  { title: "Reports", description: "Analyze your performance" },
  { title: "Enroll", description: "Sign up new customers" },
  { title: "Team", description: "Expand your network" },
];

const integrationDetails = [
  {
    icon: <Facebook sx={{ fontSize: 40 }} />,
    label: "Facebook",
    description: "Connect with potential customers",
  },
  {
    icon: <WhatsApp sx={{ fontSize: 40 }} />,
    label: "WhatsApp",
    description: "Connect with potential customers",
  },
];

const activityData = [
  { assign: "Sarah", calls: 65, duration: "21m" },
  { assign: "Martha", calls: 78, duration: "2m" },
  { assign: "Peter", calls: 23, duration: "10m" },
];

const reminderData = [
  { assign: "Sarah", upcoming: 1, done: 0 },
  { assign: "Martha", upcoming: 0, done: 6 },
  { assign: "Peter", upcoming: 5, done: 9 },
];

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: 10 }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" fontWeight="bold">
            Hi, John Doe
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6} style={{ padding: "0px" }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Get Started
              </Typography>
              <Grid container spacing={3} mt={1}>
                {getStartedSectionData.map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <Avatar
                          alt={`${item.title} Icon`}
                          src={`/path/to/${item.title.toLowerCase()}icon.png`}
                          sx={{ width: 56, height: 56, mx: "auto", mb: 2 }}
                        />

                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ mb: 2 }}
                        >
                          {item.description}
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          //   size="small"
                          startIcon={<Add style={{ fontSize: "15px" }} />}
                          sx={{
                            mt: 2,
                            bgcolor: "#FFC107",
                            color: "#000",
                            "&:hover": {
                              bgcolor: "#FFB300",
                            },
                            borderRadius: 2,
                            fontSize: "10px",
                            textWrap: "nowrap",
                            padding: "5px",
                            maxWidth: "110px",
                          }}
                        >
                          Add {item.title}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* My Task Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                My Task
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  select
                  size="small"
                  value="Me"
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value="Me">Me</MenuItem>
                  <MenuItem value="Team">Team</MenuItem>
                </TextField>
                <TextField
                  select
                  size="small"
                  value="Team"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="Team">Team</MenuItem>
                </TextField>
                <TextField
                  select
                  size="small"
                  value="Status"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="Status">Status</MenuItem>
                </TextField>
              </Box>
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "8px" }}>
                        Lead
                      </th>
                      <th style={{ textAlign: "left", padding: "8px" }}>
                        Description
                      </th>
                      <th style={{ textAlign: "left", padding: "8px" }}>
                        Assign
                      </th>
                      <th style={{ textAlign: "left", padding: "8px" }}>
                        Status
                      </th>
                      <th style={{ textAlign: "left", padding: "8px" }}>
                        Due Date
                      </th>
                      <th style={{ textAlign: "left", padding: "8px" }}>
                        Priority
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => (
                      <tr key={index}>
                        <td style={{ padding: "8px" }}>{task.lead}</td>
                        <td style={{ padding: "8px" }}>{task.description}</td>
                        <td style={{ padding: "8px" }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              alt={task.assign}
                              sx={{
                                width: 24,
                                height: 24,
                                mr: 1,
                                bgcolor: "#FFB300",
                                color: "#fff",
                                fontSize: 12,
                              }}
                            >
                              {task.assign.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">
                              {task.assign}
                            </Typography>
                          </Box>
                        </td>
                        <td style={{ padding: "8px" }}>
                          <Button
                            variant="outlined"
                            color={task.status === "Late" ? "error" : "success"}
                            size="small"
                            sx={{ borderRadius: 2 }}
                          >
                            {task.status}
                          </Button>
                        </td>
                        <td style={{ padding: "8px" }}>{task.dueDate}</td>
                        <td style={{ padding: "8px" }}>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                            }}
                            startIcon={<WarningAmber color="error" />}
                          >
                            Urgent
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={2}>
        {/* Integration Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Integration
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {integrationDetails.map((integration, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 2,
                    mb: 3,
                    borderRadius: 3,
                    boxShadow: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "start", mb: 2 }}>
                    {integration.icon}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {integration.label}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {integration.description}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#FFC107",
                          color: "#000",
                          "&:hover": {
                            bgcolor: "#FFB300",
                          },
                          borderRadius: 2,
                          mt: 1,
                        }}
                      >
                        Connect
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Dashboard Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Dashboard
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {/* Activity Section */}
                <Grid item xs={12} sm={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      boxShadow: 1,
                      padding: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Box display="flex" alignItems="center">
                          <TrackChanges sx={{ fontSize: 40, mr: 1 }} />
                          <Typography variant="h6" fontWeight="bold">
                            Activity
                          </Typography>
                        </Box>
                        <TextField
                          select
                          variant="outlined"
                          size="small"
                          defaultValue="Today"
                          sx={{ width: "auto", minWidth: "100px" }}
                        >
                          <option value="Today">Today</option>
                          <option value="Week">This Week</option>
                          <option value="Month">This Month</option>
                        </TextField>
                      </Box>
                      <Divider />
                      <table width="100%" style={{ marginTop: "1rem" }}>
                        <thead>
                          <tr>
                            <th>Assign</th>
                            <th>Calls</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activityData.map((row, index) => (
                            <tr key={index}>
                              <td style={{ padding: "8px" }}>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Avatar
                                    alt={row.assign}
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      mr: 1,
                                      bgcolor: "#FFB300",
                                      color: "#fff",
                                      fontSize: 12,
                                    }}
                                  >
                                    {row.assign.charAt(0)}
                                  </Avatar>
                                  <Typography variant="body2">
                                    {row.assign}
                                  </Typography>
                                </Box>
                              </td>
                              <td>{row.calls}</td>
                              <td>{row.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Reminder Section */}
                <Grid item xs={12} sm={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      boxShadow: 1,
                      padding: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Box display="flex" alignItems="center">
                          <AccessAlarm sx={{ fontSize: 40, mr: 1 }} />
                          <Typography variant="h6" fontWeight="bold">
                            Reminder
                          </Typography>
                        </Box>
                        <TextField
                          select
                          variant="outlined"
                          size="small"
                          defaultValue="Today"
                          sx={{ width: "auto", minWidth: "100px" }}
                        >
                          <option value="Today">Today</option>
                          <option value="Week">This Week</option>
                          <option value="Month">This Month</option>
                        </TextField>
                      </Box>
                      <Divider />
                      <table width="100%" style={{ marginTop: "1rem" }}>
                        <thead>
                          <tr>
                            <th>Assign</th>
                            <th>Upcoming</th>
                            <th>Done</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reminderData.map((row, index) => (
                            <tr key={index}>
                              <td style={{ padding: "8px" }}>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Avatar
                                    alt={row.assign}
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      mr: 1,
                                      bgcolor: "#FFB300",
                                      color: "#fff",
                                      fontSize: 12,
                                    }}
                                  >
                                    {row.assign.charAt(0)}
                                  </Avatar>
                                  <Typography variant="body2">
                                    {row.assign}
                                  </Typography>
                                </Box>
                              </td>
                              <td>{row.upcoming}</td>
                              <td>{row.done}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
