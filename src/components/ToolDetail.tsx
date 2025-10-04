import React, { useState } from 'react';
import { 
  Box, Typography, Button, Card, CardMedia, 
  Divider, Link, Chip, IconButton, Collapse
} from '@mui/material';
import { 
  Launch as LaunchIcon, 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Tool } from '../types/subscription';

interface ToolDetailProps {
  tool: Tool;
  onBack: () => void;
}

const ToolDetail: React.FC<ToolDetailProps> = ({ tool, onBack }) => {
  const [descExpanded, setDescExpanded] = useState(false);
  const [docExpanded, setDocExpanded] = useState(false);
  const [changelogExpanded, setChangelogExpanded] = useState(false);

  const handleDownload = () => {
    if (tool.downloadUrl) {
      window.open(tool.downloadUrl, '_blank');
    }
  };

  const handleDocumentation = () => {
    if (tool.documentation) {
      window.open(tool.documentation, '_blank');
    }
  };

  const handleAuthorLink = () => {
    if (tool.author.link) {
      window.open(tool.author.link, '_blank');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">工具详情</Typography>
      </Box>
      
      <Card sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
          <CardMedia
            component="img"
            sx={{ width: 80, height: 80, objectFit: 'contain' }}
            image={tool.icon || 'https://via.placeholder.com/80'}
            alt={tool.name}
          />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5" component="div">
              {tool.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Chip 
                label={`v${tool.version}`} 
                size="small" 
                sx={{ mr: 1 }} 
                variant="outlined" 
              />
              <Chip 
                label={tool.author.name} 
                size="small" 
                variant="outlined"
                onClick={handleAuthorLink}
                clickable={!!tool.author.link}
              />
            </Box>
          </Box>
        </Box>
      </Card>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        下载次数: {tool.downloads}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="medium">简介</Typography>
          {tool.description && tool.description.length > 100 && (
            <IconButton size="small" onClick={() => setDescExpanded(!descExpanded)}>
              {descExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>
        <Divider sx={{ my: 1 }} />
        <Collapse in={descExpanded} collapsedSize={80}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
            {tool.description || '暂无简介'}
          </Typography>
        </Collapse>
      </Box>

      {tool.documentation && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="medium">文档</Typography>
            <IconButton size="small" onClick={() => setDocExpanded(!docExpanded)}>
              {docExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Collapse in={docExpanded} collapsedSize={120}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <Link href={tool.documentation} target="_blank" rel="noopener">
                {tool.documentation} <LaunchIcon fontSize="inherit" />
              </Link>
            </Typography>
          </Collapse>
        </Box>
      )}

      {tool.changelog && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="medium">更新日志</Typography>
            <IconButton size="small" onClick={() => setChangelogExpanded(!changelogExpanded)}>
              {changelogExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Collapse in={changelogExpanded} collapsedSize={80}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
              {tool.changelog}
            </Typography>
          </Collapse>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        {tool.documentation && (
          <Button 
            variant="outlined" 
            startIcon={<LaunchIcon />}
            onClick={handleDocumentation}
          >
            查看文档
          </Button>
        )}
        {tool.downloadUrl && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleDownload}
          >
            下载
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ToolDetail;