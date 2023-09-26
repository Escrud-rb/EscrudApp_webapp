import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Stack } from '@mui/material';

import { Joystick } from 'react-joystick-component';

import { useData } from '../../App';

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

export default function DrivePage() {
    const {wsSend} = useData()
    const handleMove = e =>{
        console.log(e)
        wsSend({
            type: 'test_robot',
            content: e
        })
    }
    const handleStop = e =>{
        console.log(e)
    }
  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square sx={{ height: "100vh", display: 'flex', flexDirection: 'column', pb: '50px', background: '#333' }}>
        <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0, color: 'white' }}>  
            <IconButton color="inherit" aria-label="open drawer" component={RouterLink} to='/app'>
                <ArrowBackIosIcon/>
            </IconButton> Drive
        </Typography>

        <Box sx={{ mx: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }} >
            <Paper sx={{ p: 3, background: '#222', color: 'white', height: '35vh' }} >
                * View
            </Paper>
            <Paper sx={{ p: 2, pt: 1, height: '12vh', fontSize: 12 }} >
                <Typography variant="h6" component="div"> Data </Typography>
                <Grid container> 
                    <Grid item xs={6}>
                    <Typography variant="boby2" gutterBottom component="p"> PH: 0.00</Typography>
                    <Typography variant="boby2" gutterBottom component="p"> Azote (N): 0.00</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="boby2" gutterBottom component="p"> Phosphore (Ph): 0.00</Typography>
                        <Typography variant="boby2" gutterBottom component="p"> Humidité: 0.00</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{ p: 2, pt: 1.5, height: '35vh' }} >   
                <Stack direction='row' justifyContent='space-between'>          
                    <Button variant="contained"  size="small" disabled>
                    Prélever
                    </Button>
                    <Button variant="outlined" size="small">
                    Reports
                    </Button>
                    <Button variant="contained" color="success"  size="small">
                    Demarrer
                    </Button>
                </Stack>
                
                <Stack direction='row' sx={{ position: 'relative', p: 3, display: 'flex', justifyContent: 'center', height: '95%', width: '100%' }} alignItems='center'>
                    <Joystick size={150}  baseColor="silver" stickColor="green" move={handleMove} stop={handleStop}></Joystick>       
                </Stack>
            </Paper>
        </Box>
      </Paper>
    </React.Fragment>
  );
}