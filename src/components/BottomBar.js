import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import TocIcon from '@mui/icons-material/Toc';
import AddIcon from '@mui/icons-material/Add';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import MoreIcon from '@mui/icons-material/MoreVert';


const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

export default function BottomAppBar() {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, height: 70 }}>
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" component={RouterLink} to='/app'>
          <HomeIcon />
        </IconButton>
        <StyledFab color="secondary" aria-label="add" component={RouterLink} to='/app/drive'>
          <PlayCircleFilledIcon />
        </StyledFab>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" component={RouterLink} to='/app/prelevement'>
          <TocIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}