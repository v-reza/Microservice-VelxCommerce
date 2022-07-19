import { Box, Stack, styled } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import AddProduct from './shared/AddProduct';
import ProductTable from './shared/ProductTable';
import { useState } from 'react';
import ProductSnackbar from './shared/ProductSnackbar';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const Product = () => {
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [deleteProduct, setIsDeleteProduct] = useState(false)
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'List', path: '/listproduct' }, { name: 'Product' }]} />
      </Box>

      <Stack spacing={3}>
        <AddProduct setIsNewProduct={setIsNewProduct}/>
        <SimpleCard title="List your product">
          <ProductTable isNewProduct={isNewProduct} setIsDeleteProduct={setIsDeleteProduct}/>
        </SimpleCard>
        <ProductSnackbar isNewProduct={isNewProduct} deleteProduct={deleteProduct}/>
      </Stack>
    </Container>
  );
};

export default Product;
