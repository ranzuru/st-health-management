import React from 'react';
import Sidebar from './Sidebar';
import BarGraphDashboard from './graphs/BarGraphDashboard.js';
import { Card, CardContent, Typography, Grid, CardActionArea} from '@mui/material';
import { useNavigate } from 'react-router-dom';


import numberOfUser from './Data/numberOfUser.png';
import numberOfStudents from './Data/numberOfStudents.png';
import clinicPatients from './Data/clinicPatients.png';
import feedingPrograms from './Data/feedingProgram.png';
import graphImage from './Data/barGraph.png';

const Dashboard = () => {
    const navigate = useNavigate();
  
    const handleCardClickManageUser = () => {
      navigate('/manage-users');
    };

    const handleCardClickStudents = () => {
      navigate('/students-profile');
    };

    const handleCardClickClinic = () => {
      navigate('/clinic-records');
    };

    const handleCardClickFeeding = () => {
      navigate('/feeding-program');
    };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="bg-black h-64 w-full mb-4">
      <div className="flex-grow p-4">
        <h1 className="text-5xl font-bold text-white pt-4" >Welcome Jeremiah!</h1>
        </div>
        <Grid  className="pt-14 pr-4 pl-4" container spacing={3}>
          <Grid item xs={3}>
            <Card className="h-44">
            <CardActionArea onClick={handleCardClickManageUser}>
              <CardContent className="pl-5 pt-3 pb-1 relative">
              <div className="flex items-center">
              <img
                src={numberOfUser}
                alt="Icon"
                className="h-16 w-16"
              />
              <div className="ml-10 flex flex-col justify-center">
                <Typography variant="h3" component="div">
                      12
                    </Typography>
                  </div>
              </div>
              <div className=" pt-4 flex flex-col items-start">
                <Typography gutterBottom variant="h6" component="div" >
                  Number of User
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total number of user of this system.
                </Typography>
                </div>
              </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card className="h-44">
          <CardActionArea onClick={handleCardClickStudents}>
            <CardContent className="pl-5 pt-3 pb-1 relative">
              <div className="flex items-center">
              <img
                src={numberOfStudents}
                alt="Icon"
                className="h-16 w-16"
              />
              <div className="ml-10 flex flex-col justify-center">
                <Typography variant="h3" component="div">
                      2500
                    </Typography>
                  </div>
              </div>
              <div className=" pt-4 flex flex-col items-start">
                <Typography gutterBottom variant="h6" component="div" >
                  Number of Students
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total number of students.
                </Typography>
                </div>
              </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card className="h-44">
          <CardActionArea onClick={handleCardClickClinic}>
            <CardContent className="pl-5 pt-3 pb-1 relative">
              <div className="flex items-center">
              <img
                src={clinicPatients}
                alt="Icon"
                className="h-16 w-16"
              />
              <div className="ml-10 flex flex-col justify-center">
                <Typography variant="h3" component="div">
                      250
                    </Typography>
                  </div>
              </div>
              <div className=" pt-4 flex flex-col items-start">
                <Typography gutterBottom variant="h6" component="div" >
                  Clinic Patients
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total number of clinic patients.
                </Typography>
                </div>
              </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card className="h-44">
          <CardActionArea onClick={handleCardClickFeeding}>
            <CardContent className="pl-5 pt-3 pb-1 relative">
              <div className="flex items-center">
              <img
                src={feedingPrograms}
                alt="Icon"
                className="h-16 w-16"
              />
              <div className="ml-10 flex flex-col justify-center">
                <Typography variant="h3" component="div">
                      150
                    </Typography>
                  </div>
              </div>
              <div className=" pt-4 flex flex-col items-start">
                <Typography variant="h6" component="div" >
                  Feeding Program
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total of students eligible for feeding program.
                </Typography>
                </div>
              </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        <Grid item xs={9}>
          <Card className="w-full mt-4">
          <CardContent>
           <div className="flex items-center mb-4">
              <img
                  src={graphImage}
                  alt="Icon"
                  className="w-16 h-16 ml-2 inline-block"
                />
            <Typography variant="h6" component="div">
            &nbsp;&nbsp; Clinic Patients For School Year 2022-2023
            </Typography>
            </div>
            <BarGraphDashboard />
          </CardContent>
        </Card>
        </Grid>
        <Grid item xs={3}>
            <Card className="mt-4">         
              <CardContent className="pl-5 pt-3 pb-1 relative">
              <div className="flex flex-col justify-center">
                <Typography variant="h5" component="div">
                    Today's Agenda
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="body2" color="text.secondary">
                    August 20, 2023
                </Typography>
              </div>
              </CardContent>    
            </Card>
          </Grid>
       </Grid>
      </div>
    </div>
  );
};

export default Dashboard;