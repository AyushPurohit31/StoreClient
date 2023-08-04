import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button } from '@mui/material';
import FormDialog from './Dialog';
import SettingsIcon from '@mui/icons-material/Settings';

export default function DataGridDemo() {

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const [itemList, setItemsList] = React.useState([]);

    const columns = [
      {
        field: 'name',
        headerName: 'Name',
        headerAlign: 'center',
        width: 170,
        editable: false,
        align:'center',
        headerClassName: 'listheader',
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        headerAlign: 'center',
        type: 'number',
        width: 170,
        editable: false,
        align:'center',
        headerClassName: 'listheader',
      },
      {
        field: 'price',
        headerName: 'Price',
        headerAlign: 'center',
        width: 170,
        editable: false,
        align:'center',
        headerClassName: 'listheader',
      },
      {
        field: "editUser",
        headerName: <SettingsIcon/>,
        width: 170,
        headerAlign: 'center',
        sortable: false,
        align:'center',
        headerClassName: 'listheader',
        renderCell: (params) => {
          const onClick = (e) => {
            e.stopPropagation();
          };
          return (
            <Button onClick={onClick}>
                <FormDialog data={params}/>
            </Button>
          );
        },
      },
    ];

    const rows = [];

    function createData(id, name, price, quantity){
        return {id, name, price, quantity}
    }

  itemList.forEach(item => {
    const data = createData(item._id, item.name, item.price, item.quantity);
    rows.push(data);
  });

  const getItems = () =>{
    const userId = userInfo._id; // Replace this with the actual user ID

    axios.get(`/store/items/${userId}`)
      .then((response) => {
        // Handle the store items data received from the backend
        setItemsList(response.data.storeItems);
      })
      .catch((error) => {
        console.error('Error fetching store items:', error);
      });
  }

  React.useEffect(()=>{
    getItems();
  },[itemList])


  return (
    <Box sx={{ height: 370, width: '100%' }}>
      <DataGrid
        sx={{
          maxWidth:"700px",
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}