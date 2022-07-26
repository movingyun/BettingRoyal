import React from "react";
import { Card, Grid } from "@mui/material";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchBar from "../../components/common/SearchBar/SearchBar";

const Friend = () => {
    return (
        <Card>
            {/* {eader} */}
            <Grid item xs={8} sx={{marginLeft: '200px'}}>
                <BasicCard header={<SearchBar />}/>
            </Grid>
        </Card>
    );
}

export default Friend