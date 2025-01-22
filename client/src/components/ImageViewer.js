import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Box 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageViewer = ({ open, onClose, image }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0 }}>
          <img
            src={image?.url}
            alt={image?.title}
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ImageViewer; 