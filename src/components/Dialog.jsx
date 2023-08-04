import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FormDialog(params) {
  const data = params.data;
  const [open, setOpen] = React.useState(false);
  const [name,setName] = React.useState(data.row.name);
  const [price,setPrice] = React.useState(data.row.price);
  const [quantity,setQuantity] = React.useState(data.row.quantity);
  const [loading, setLoading] = React.useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
   
  const deleteItem = ()=>{
    const formData = {
        itemId: data.row.id,
      };
    const userId = userInfo._id;
    setLoading(true);

    axios.post(`/store/deleteItem/${userId}`, formData)
      .then((response) => {
        toast.success("Item deleted successfully")
      })
      .catch((error) => {
        console.error('Error deleting store item:', error);
      });
    setLoading(false);
  }

  const editItem = async () => {
    const formData = {
      name,
      price,
      quantity,
      itemId: data.row.id,
    };
    const userId = userInfo._id;
    setLoading(true);

    axios.put(`/store/editItem/${userId}`, formData)
      .then((response) => {
        toast.success("Item updated successfully")
      })
      .catch((error) => {
        console.error('Error fetching store items:', error);
      });
    setLoading(false);
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button sx={{color:"#6a26d1"}} onClick={handleClickOpen}>
        <EditIcon/>
      </Button>
      <Button sx={{color:"orange"}} onClick={deleteItem}>
        <DeleteIcon/>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent sx={{display:'flex', flexDirection:'column'}}>
        <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={editItem}>{(loading)?(<CircularProgress/>):"Save"}</Button>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
