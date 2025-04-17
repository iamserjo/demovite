import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import api, { Photo } from '../services/api';

// Alternative reliable image URL function
const getReliableImageUrl = (photo: Photo): string => {
  // Replace via.placeholder.com with placehold.co
  // If the original URL was using via.placeholder.com/150/[hex] format
  if (photo.thumbnailUrl.includes('via.placeholder.com')) {
    const colorCode = photo.thumbnailUrl.split('/').pop() || '92c952';
    return `https://placehold.co/150/${colorCode}`;
  }
  
  // Fallback to generic placeholder if there's any other issue
  return `https://placehold.co/150x150/cccccc/333333?text=Photo+${photo.id}`;
};

const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await api.photos.getAll();
        setPhotos(response.data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Calculate pagination slices
  const displayedPhotos = photos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 3,
          mb: 2
        }}
      >
        {displayedPhotos.map((photo) => (
          <Box 
            key={photo.id} 
            sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 18px)' } 
            }}
          >
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={getReliableImageUrl(photo)}
                alt={photo.title}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {photo.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      
      <TablePagination
        rowsPerPageOptions={[12, 24, 50, 100]}
        component="div"
        count={photos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Photos; 