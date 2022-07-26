import React from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Input from '@mui/material/Input';

const SearchBar = ({placeholder, onChange}) => {
    return (
        <div>
            <SearchRoundedIcon />
            <Input 
                placeholder={placeholder} 
                onChange={onChange}
            />
        </div>
    )
}

export default SearchBar