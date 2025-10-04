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
    <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
        工具列表
      </Typography>
      <Divider sx={{ mb: 1.5 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: { xs: 0, sm: 0.5 } }}>
        {tools.map((tool) => (
          <Card 
            key={tool.id}
            sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              cursor: 'pointer',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: 2
              },
              height: '70px'
            }}
            onClick={() => onSelectTool(tool)}
          >
            <CardMedia
              component="img"
              sx={{ 
                width: 70, 
                height: 70, 
                objectFit: 'contain', 
                p: 1,
                borderRadius: 2
              }}
              image={tool.icon || 'https://via.placeholder.com/70'}
              alt={tool.name}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <CardContent sx={{ flex: '1 0 auto', py: 1, px: 1.5 }}>
                <Typography component="div" variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                  {tool.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div" sx={{ fontSize: '0.7rem' }}>
                  下载次数: {tool.downloads}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mt: 0.5,
                    fontSize: '0.7rem'
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