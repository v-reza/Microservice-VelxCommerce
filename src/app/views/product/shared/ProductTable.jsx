import {
  Box,
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

const StyledTable = styled(Table)(() => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': { '& th': { paddingLeft: 0, paddingRight: 0 } },
  },
  '& tbody': {
    '& tr': { '& td': { paddingLeft: 0, textTransform: 'capitalize' } },
  },
}));

const ProductTable = ({ isNewProduct, setIsDeleteProduct }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productList, setProductList] = useState([]);
  const PF = 'http://localhost:3300/images';

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = useCallback(async (e, productId) => {
    e.preventDefault();
    await axios.delete(`http://localhost:3300/api/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('velx-token')}`,
      },
    });
    setIsDeleteProduct(true);
  });

  useEffect(() => {
    const getProductById = async () => {
      const res = await axios.get('http://localhost:3300/api/product/by/userId', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('velx-token')}`,
        },
      });
      setProductList(res.data[0].product);
    };
    getProductById();
  }, [isNewProduct, handleDelete]);

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">Product Name</TableCell>
            <TableCell align="center">Product Price</TableCell>
            <TableCell align="center">Product Views</TableCell>
            <TableCell align="center">Product Category</TableCell>
            <TableCell align="center">Product Image</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productList && productList.length > 0 ? (
            productList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{product.product_name}</TableCell>
                  <TableCell align="center">${product.product_price}</TableCell>
                  <TableCell align="center">{product.product_views}</TableCell>
                  <TableCell align="center">{product.product_category}</TableCell>
                  <TableCell align="center">
                    <Box
                      component="img"
                      style={{ objectVit: 'cover' }}
                      sx={{
                        height: 100,
                        width: 100,
                        maxHeight: { xs: 233, md: 167 },
                        maxWidth: { xs: 350, md: 250 },
                      }}
                      alt="The house from the offer."
                      src={
                        product.product_image
                          ? PF + product.product_image
                          : PF + '/noProductImage.png'
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleDelete(e, product._id)}>
                      <Icon color="error">close</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <span>No Product Found</span>
          )}
        </TableBody>
      </StyledTable>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={productList.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ 'aria-label': 'Next Page' }}
        backIconButtonProps={{ 'aria-label': 'Previous Page' }}
      />
    </Box>
  );
};

export default ProductTable;
