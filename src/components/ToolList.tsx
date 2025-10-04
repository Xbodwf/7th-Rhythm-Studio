import React from 'react';
import { 
  Grid as MuiGrid, Card, CardContent, CardMedia, Typography, 
  Box, Chip, Skeleton, Divider, styled
} from '@mui/material';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Tool } from '../types/subscription';

const Grid = styled(MuiGrid)({});

interface ToolListProps {
  onSelectTool: (tool: Tool) => void;
}

const ToolList: React.FC<ToolListProps> = ({ onSelectTool }) => {
  const { tools, isLoading, activeSubscription } = useSubscription();

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        {[...Array(6)].map((_, index) => (
          <Card key={index} sx={{ mb: 2, display: 'flex', height: 100 }}>
            <Skeleton variant="rectangular" width={100} height={100} />
            <CardContent sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (!activeSubscription) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          请选择一个订阅
        </Typography>
      </Box>
    );
  }

  if (tools.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          没有找到工具
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Typography variant="h6" gutterBottom>
        工具列表
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: { xs: 0, sm: 2 } }}>
        {tools.map((tool) => (
          <Card 
            key={tool.id}
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              cursor: 'pointer',
              borderRadius: 4,
              overflow: 'hidden',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: 3
              }
            }}
            onClick={() => onSelectTool(tool)}
          >
            <CardMedia
              component="img"
              sx={{ 
                width: { xs: '100%', sm: 100 }, 
                height: { xs: 140, sm: 100 }, 
                objectFit: 'contain', 
                p: 1,
                borderRadius: 4
              }}
              image={tool.icon || 'https://via.placeholder.com/100'}
              alt={tool.name}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                <Typography component="div" variant="h6">
                  {tool.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  下载次数: {tool.downloads}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {tool.description}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                <Chip 
                  label={tool.version} 
                  size="small" 
                  sx={{ mr: 1, borderRadius: 3 }} 
                  variant="outlined"
                />
                <Chip 
                  label={tool.author.name} 
                  size="small" 
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                />
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ToolList;