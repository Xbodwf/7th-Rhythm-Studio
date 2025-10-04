import React, { useState } from 'react';
import { 
  List, ListItem, ListItemText, ListItemAvatar, ListItemButton, 
  Avatar, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, TextField, FormControl, InputLabel, 
  Select, MenuItem, Typography, Divider, Box
} from '@mui/material';
import { 
  Folder as FolderIcon, 
  Link as LinkIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Subscription, UpdateInterval } from '../types/subscription';

const SubscriptionList: React.FC = () => {
  const { 
    subscriptions, 
    activeSubscription,
    enableSubscription, 
    deleteSubscription,
    addSubscription,
    updateSubscription,
    refreshSubscription,
    isLoading
  } = useSubscription();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isLocal, setIsLocal] = useState(false);
  const [updateInterval, setUpdateInterval] = useState<UpdateInterval>('startup');

  const handleAddClick = () => {
    setEditMode(false);
    setName('');
    setUrl('');
    setIsLocal(false);
    setUpdateInterval('startup');
    setDialogOpen(true);
  };

  const handleEditClick = (subscription: Subscription) => {
    setEditMode(true);
    setCurrentSubscription(subscription);
    setName(subscription.name);
    setUrl(subscription.url);
    setIsLocal(subscription.isLocal);
    setUpdateInterval(subscription.updateInterval);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      return; // 名称不能为空
    }
    
    if (!isLocal && !url.trim()) {
      return; // 如果不是本地订阅，URL不能为空
    }
    
    if (editMode && currentSubscription) {
      updateSubscription({
        ...currentSubscription,
        name,
        url,
        isLocal,
        updateInterval
      });
    } else {
      addSubscription(name, url, isLocal, updateInterval);
    }
    setDialogOpen(false);
  };

  const handleRefresh = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await refreshSubscription(id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSubscription(id);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6">订阅</Typography>
        <IconButton color="primary" onClick={handleAddClick}>
          <AddIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ width: '100%' }}>
        {subscriptions.map((subscription) => (
          <ListItem
            key={subscription.id}
            disablePadding
            secondaryAction={
              !subscription.isNative && (
                <Box>
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleRefresh(subscription.id, e)}
                    disabled={isLoading || subscription.isLocal}
                  >
                    <RefreshIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleEditClick(subscription)}
                    disabled={subscription.isNative}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleDelete(subscription.id, e)}
                    disabled={subscription.isNative}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )
            }
          >
            <ListItemButton 
              selected={subscription.id === activeSubscription?.id}
              onClick={() => enableSubscription(subscription.id)}
            >
              <ListItemAvatar>
                <Avatar>
                  {subscription.isLocal ? <FolderIcon /> : <LinkIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={subscription.name} 
                secondary={
                  <>
                    {subscription.isNative ? '<native link>' : subscription.url}
                    <br />
                    {`上次更新: ${formatDate(subscription.lastUpdated)}`}
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editMode ? '编辑订阅' : '添加订阅'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="名称"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="URL 或文件路径"
            type="text"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>类型</InputLabel>
            <Select
              value={isLocal ? 'local' : 'remote'}
              onChange={(e) => setIsLocal(e.target.value === 'local')}
            >
              <MenuItem value="remote">远程链接</MenuItem>
              <MenuItem value="local">本地文件</MenuItem>
            </Select>
          </FormControl>
          {!isLocal && (
            <FormControl fullWidth margin="dense">
              <InputLabel>更新间隔</InputLabel>
              <Select
                value={updateInterval}
                onChange={(e) => setUpdateInterval(e.target.value as UpdateInterval)}
              >
                <MenuItem value="startup">每次启动</MenuItem>
                <MenuItem value="daily">每天</MenuItem>
                <MenuItem value="weekly">每周</MenuItem>
                <MenuItem value="monthly">每月</MenuItem>
                <MenuItem value="manual">手动</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>取消</Button>
          <Button onClick={handleSubmit} disabled={!name || !url}>确定</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionList;
