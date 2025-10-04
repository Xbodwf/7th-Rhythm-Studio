import React, { useState } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, Typography, useMediaQuery, 
  useTheme, IconButton, Divider, Paper, Collapse, Menu, MenuItem,
  ListItemIcon, ListItemText, Button, Dialog, DialogTitle, Tabs, Tab, Switch
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../App';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import AddIcon from '@mui/icons-material/Add';
import SubscriptionList from '../components/SubscriptionList';
import ToolList from '../components/ToolList';
import ToolDetail from '../components/ToolDetail';
import { Tool } from '../types/subscription';
import { useSubscription } from '../contexts/SubscriptionContext';

// 主题切换按钮组件
const ThemeToggleButton = () => {
  const theme = useTheme();
  const colorMode = useColorMode();
  
  return (
    <IconButton 
      color="inherit" 
      onClick={colorMode.toggleColorMode}
      sx={{ mr: 1 }}
    >
      {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

const drawerWidth = 280;
const miniDrawerWidth = 60;

const MainPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(true); // 默认折叠
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [subscriptionMenuOpen, setSubscriptionMenuOpen] = useState(false);
  const [subscriptionMenuAnchor, setSubscriptionMenuAnchor] = useState<null | HTMLElement>(null);
  const [subscriptionManageOpen, setSubscriptionManageOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // 窗口控制函数
  const handleMinimize = () => {
    window.ipcRenderer.send('minimize-window');
  };
  
  const handleMaximize = () => {
    window.ipcRenderer.send('maximize-window');
  };
  
  const handleClose = () => {
    window.ipcRenderer.send('close-window');
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const { 
    subscriptions, 
    activeSubscription,
    enableSubscription
  } = useSubscription();

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
  
  const handleSubscriptionMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSubscriptionMenuAnchor(event.currentTarget);
    setSubscriptionMenuOpen(true);
  };
  
  const handleSubscriptionMenuClose = () => {
    setSubscriptionMenuOpen(false);
    setSubscriptionMenuAnchor(null);
  };
  
  const handleSubscriptionSelect = (id: string) => {
    enableSubscription(id);
    handleSubscriptionMenuClose();
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
        {drawerCollapsed ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={handleDrawerToggle}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        ) : (
          <>
            <Button 
              onClick={handleSubscriptionMenuOpen}
              endIcon={<ExpandMoreIcon />}
              sx={{ textTransform: 'none' }}
            >
              <Typography variant="subtitle1" noWrap>
                {activeSubscription?.name || '选择订阅'}
              </Typography>
            </Button>
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </>
        )}
      </Toolbar>
      <Divider />
      {!drawerCollapsed && (
        <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <ToolList onSelectTool={handleSelectTool} />
        </Box>
      )}
      
      <Menu
        anchorEl={subscriptionMenuAnchor}
        open={subscriptionMenuOpen}
        onClose={handleSubscriptionMenuClose}
        PaperProps={{
          sx: { 
            width: 250,
            maxHeight: 300,
            borderRadius: 3,
            mt: 1
          }
        }}
      >
        {subscriptions.map((subscription) => (
          <MenuItem 
            key={subscription.id}
            onClick={() => handleSubscriptionSelect(subscription.id)}
            selected={activeSubscription?.id === subscription.id}
            sx={{ borderRadius: 2, mx: 1 }}
          >
            <ListItemText primary={subscription.name} />
          </MenuItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={() => {
            handleSubscriptionMenuClose();
            setSubscriptionManageOpen(true);
          }}
          sx={{ borderRadius: 2, mx: 1 }}
        >
          <ListItemText primary="管理订阅" />
        </MenuItem>
      </Menu>
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
          WebkitAppRegion: 'drag', // 允许拖拽
        }}
      >
        <Toolbar sx={{ minHeight: '48px' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              display: { md: 'none' },
              WebkitAppRegion: 'no-drag' // 按钮不可拖拽
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* 选项卡 */}
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              flexGrow: 1,
              '& .MuiTab-root': { 
                minHeight: '48px',
                WebkitAppRegion: 'no-drag'
              }
            }}
          >
            <Tab label="工具" />
            <Tab icon={<AddIcon fontSize="small" />} sx={{ minWidth: '40px', width: '40px' }} />
          </Tabs>
          
          <Box sx={{ 
            display: 'flex', 
            WebkitAppRegion: 'no-drag',
            alignItems: 'center',
            height: '100%'
          }}>
            {/* 主题切换按钮 */}
            <ThemeToggleButton />
            <IconButton 
              onClick={handleMinimize}
              sx={{ 
                borderRadius: 0, 
                height: '100%',
                width: '46px',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Box sx={{ 
                width: '10px', 
                height: '1px', 
                bgcolor: 'text.primary',
                position: 'relative',
                bottom: '-8px'
              }} />
            </IconButton>
            <IconButton 
              onClick={handleMaximize}
              sx={{ 
                borderRadius: 0, 
                height: '100%',
                width: '46px',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Box sx={{ 
                width: '10px', 
                height: '10px', 
                border: '1px solid',
                borderColor: 'text.primary'
              }} />
            </IconButton>
            <IconButton 
              onClick={handleClose}
              sx={{ 
                borderRadius: 0, 
                height: '100%',
                width: '46px',
                '&:hover': { bgcolor: 'error.main', color: 'white' }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
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
          width: { md: `calc(100% - ${drawerCollapsed ? miniDrawerWidth : drawerWidth}px)` },
          ml: { md: `${drawerCollapsed ? miniDrawerWidth : drawerWidth}px` },
          mt: { xs: '56px', sm: '64px' },
          display: 'flex',
          overflow: 'hidden',
          height: 'calc(100vh - 64px)'
        }}
      >
        <Box 
          sx={{ 
            width: '100%',
            flexGrow: 1,
            overflowY: 'auto',
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: 1
          }}
        >
          {selectedTool ? (
            <ToolDetail tool={selectedTool} onBack={handleBackToList} />
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                欢迎使用7th Rhythm Studio
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                请从左侧选择一个工具开始使用
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* 订阅管理对话框 */}
      <Dialog 
        open={subscriptionManageOpen} 
        onClose={() => setSubscriptionManageOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: '100%',
            maxWidth: 600
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">订阅管理</Typography>
            <IconButton onClick={() => setSubscriptionManageOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <Box sx={{ p: 2, maxHeight: '70vh', overflow: 'auto' }}>
          <SubscriptionList />
        </Box>
      </Dialog>
    </Box>
  );
};

export default MainPage;
