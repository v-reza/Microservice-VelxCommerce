import { Autocomplete, styled, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';

const AutoComplete = styled(Autocomplete)(() => ({
  width: 300,
  marginBottom: '16px',
}));

const filter = createFilterOptions();

const ProductCategory = ({setProductCategory}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = React.useState(null);

  useEffect(() => {
    const getCategory = async () => {
      await axios.get('http://localhost:3300/api/product/list/category').then((res) => {
        setSuggestions(res.data);
      });
    };
    getCategory();
  }, []);

  
  return (
    <Fragment>
      <AutoComplete
        options={suggestions}
        getOptionLabel={(option) => option.category_name}
        fullWidth
        isOptionEqualToValue={(option) => option.category_name}
        renderInput={(params) => (
          <TextField {...params} label="Product Category" variant="outlined" fullWidth />
        )}
        onChange={(e, value) => {
          e.preventDefault();
          setProductCategory(value)
        }}
      />
    </Fragment>
  );
};

export default ProductCategory;
