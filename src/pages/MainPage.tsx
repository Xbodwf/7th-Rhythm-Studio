import React, { useState } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, Typography, useMediaQuery, 
  useTheme, IconButton, Divider, Paper, Collapse 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SubscriptionList from '../components/SubscriptionList';
import ToolList from '../components/ToolList';
import ToolDetail from '../components/ToolDetail';
import { Tool } from '../types/subscription';

const drawerWidth = 280;
const miniDrawerWidth = 60;

const MainPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDrawerCollapsed(!drawerCollapsed);
    }
  };

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleBackToList = () => {
    setSelectedTool(null);
  };

  const drawer = (
    <Box sx={{ 
      overflow: 'hidden',
      width: drawerCollapsed ? miniDrawerWidth : drawerWidth,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        pr: 1
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ opacity: drawerCollapsed ? 0 : 1 }}>
          {!drawerCollapsed && '订阅管理'}
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          {drawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      {drawerCollapsed ? null : <SubscriptionList />}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { 
            xs: '100%',
            md: `calc(100% - ${drawerCollapsed ? miniDrawerWidth : drawerWidth}px)` 
          },
          ml: { 
            xs: 0,
            md: `${drawerCollapsed ? miniDrawerWidth : drawerWidth}px` 
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          borderRadius: { xs: 0, sm: '0 0 12px 12px' },
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: 'text.primary',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              display: { md: 'none' }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            7th Rhythm Studio
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ 
          width: { 
            md: drawerCollapsed ? miniDrawerWidth : drawerWidth 
          },
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerCollapsed ? miniDrawerWidth : drawerWidth,
              borderRadius: '0 12px 12px 0',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              backgroundColor: 'background.paper',
              backgroundImage: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: { 
            xs: '100%',
            md: `calc(100% - ${drawerCollapsed ? miniDrawerWidth : drawerWidth}px)` 
          },
          height: '100vh',
          overflow: 'auto',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: 'background.paper',
            backgroundImage: 'none',
          }}
        >
          {selectedTool ? (
            <ToolDetail tool={selectedTool} onBack={handleBackToList} />
          ) : (
            <ToolList onSelectTool={handleSelectTool} />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MainPage;
