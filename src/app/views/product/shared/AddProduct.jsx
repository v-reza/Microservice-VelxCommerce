import { Box, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useState, useRef } from 'react';
import ProductCategory from './ProductCategory';
import { Button, Fab, Icon, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

export default function AddProduct({setIsNewProduct}) {
  const AppButtonRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('sm')]: { margin: '16px' },
    '& .breadcrumb': {
      marginBottom: '30px',
      [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
    },
    '& .button': { margin: theme.spacing(1) },
    '& .input': { display: 'none' },
    '& .shareImgContainer' : {padding: '0 20px 10px 20px', position: 'relative'},
    '& .shareImg': {width: '250px', objectVit: 'cover', height: "250px"},
    '& .shareCancelImg': {position: "absolute", top: "0", cursor: "pointer", opacity: "0.7"}
  }));

  const [open, setOpen] = React.useState(false);
  const [file, setFile] = useState(null);
  const productName = useRef()
  const productDesc = useRef()
  const productPrice = useRef()
  const [productCategory, setProductCategory] = useState() 

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
  const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
  }));

  const handleImage = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        product_name: productName.current.value,
        product_desc: productDesc.current.value,
        product_price: productPrice.current.value,
        product_category: productCategory.category_name
      }
      if (file) {
        const data = new FormData()
        const fileName = Date.now() + file.name;
        data.append("name", fileName)
        data.append("file", file)
        newProduct.product_image = "/" + fileName
        await axios.post("http://localhost:3300/api/upload", data)
      }


      await axios.post("http://localhost:3300/api/product", newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('velx-token')}`
        }
      })
      setFile(null)
      setIsNewProduct(true)
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Add new product
      </Button>

      <Dialog fullScreen open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add new product</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              margin="dense"
              id="productName"
              label="Product Name"
              type="text"
              fullWidth
              inputRef={productName}
            />
            <TextField
              autoFocus
              margin="dense"
              id="productDesc"
              label="Product Description"
              type="text"
              fullWidth
              inputRef={productDesc}
            />

            <TextField
              autoFocus
              margin="dense"
              id="productPrice"
              label="Product Price"
              type="number"
              fullWidth
              inputRef={productPrice}
            />
            <ProductCategory setProductCategory={setProductCategory}/>
            <AppButtonRoot>
              <input
                accept="image/*"
                className="input"
                id="contained-button-file"
                multiple
                type="file"
                onChange={(e) => handleImage(e)}
              />
              <label htmlFor="contained-button-file">
                <StyledButton variant="contained" component="span">
                  Upload Product Image
                </StyledButton>
              </label>
              {file && (
                <div className="shareImgContainer">
                  <img alt="" className="shareImg" src={URL.createObjectURL(file)} />
                  <CloseIcon className="shareCancelImg" onClick={() => setFile(null)}/>
                </div>
              )}
            </AppButtonRoot>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={(e) => handleSubmit(e)} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
