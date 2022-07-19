import { Alert, Button, Snackbar } from '@mui/material';
import { amber, green } from '@mui/material/colors';
import { styled } from '@mui/system';
import React, { useEffect } from 'react';

const ContentRoot = styled('div')(({ theme }) => ({
  '& .icon': { fontSize: 20 },
  '& .success': { backgroundColor: green[600] },
  '& .warning': { backgroundColor: amber[700] },
  '& .error': { backgroundColor: theme.palette.error.main },
  '& .info': { backgroundColor: theme.palette.primary.main },
  '& .iconVariant': { opacity: 0.9, marginRight: theme.spacing(1) },
  '& .message': { display: 'flex', alignItems: 'center' },
  '& .margin': { margin: theme.spacing(1) },
}));

export default function ProductSnackbar({ isNewProduct, deleteProduct }) {
  const [open, setOpen] = React.useState(false);
  function handleClose(_, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  useEffect(() => {
    if (isNewProduct || deleteProduct) {
        setOpen(true);
    } else {
        setOpen(false)
    }
  }, [deleteProduct, isNewProduct]);

  return (
    <ContentRoot>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={isNewProduct ? "success" : "error"} sx={{ width: '100%' }} variant="filled">
          {isNewProduct ? "Success Add New Product" : "Success Delete Product"}
        </Alert>
      </Snackbar>
    </ContentRoot>
  );
}
