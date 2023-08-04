import React, { useState } from 'react'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link } from 'react-router-dom'
import '../index.css'
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, Chip, CircularProgress, TextField, Typography } from '@mui/material';
import ItemsTable from '../components/ItemsTable';
import { UserState } from '../../context/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Store = () => {
    const [addLoading, setAddLoading] = useState(false);
    const {user} = UserState();

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [itemsList, setItemsList] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleAddItemsToDatabase = () => {
    if(itemsList.length==0){
      toast.error("add item please!");
    }else{
    const userId = userInfo._id;
    const data = {
      userId: userId,
      items: itemsList,
    };
    setAddLoading(true);
    axios
      .post('/store/addItems', data)
      .then((response) => {
        setAddLoading(false);
        toast.success(response.data.message);
        setItemsList([]);
      })
      .catch((error) => {
        setAddLoading(false);
        toast.error("Something went wrong!")
      });
    }
  };

  const add=()=>{
    if (name && quantity && price) {
      const newItem = {
        name: name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      };

      setItemsList([...itemsList, newItem]);
      // Clear the text fields after adding the item
      setName('');
      setQuantity('');
      setPrice('');
    }else{
      toast.error("Fill all the details!")
    }
  }

  const handleRemoveItem = (index) => {
    setItemsList((prevItems) => prevItems.filter((item, i) => i !== index));
  };

  const renderedItems = itemsList.map((item, index) => (
    <div className='flex flex-row px-3'>
      <div key={index} className='bg-slate-700 flex flex-row p-3 h-15 m-2  sm:w-[250px] justify-between items-center rounded-2xl'>
      <p className='text-[#D0FFFB] font-bold text-lg tracking-wider'>{item.name}</p>
      <div className='ml-5 flex flex-col text-[#E8F1A7]'>
        <p>{item.price} $/unit</p>
        <p>{item.quantity} units</p>
      </div>
    </div>
    <button onClick={() => handleRemoveItem(index)}><DeleteIcon/></button>
    </div>
  ));
  return (
  <>
    <Header/>
    <Navbar/>
    <div className='store'>
      <div className='flex-col m-10'>         
          <Chip 
            className='backCss text-lg font-bold'
            style={{backgroundColor:'rgba(226, 213, 252, 0.8)', padding:"2px"}} 
            label={<a href='/' className='flex items-center '><ArrowBackIosNewIcon/>&nbsp;<p>Dashboard</p></a>}  
            variant="outlined" 
          />
          <Typography sx={{fontWeight : 700, fontSize: 30, my:3}}>Available Items</Typography>
      </div>

      <Box sx={{display:"flex", flexDirection:{lg:'row', xs:'column', justifyContent:'space-evenly'}}}>
      <div className=' mx-[5%] my-5 flex justify-center px-3'>
        <ItemsTable/> 
      </div>

      <Box sx={{display:"flex", flexDirection:{lg:'column', md:'row', xs:'column'}}}>
      <div className='flex flex-col mx-[5%]'>
        <Typography sx={{fontWeight : 700, fontSize: 27, my:1}}>Add Items</Typography>
        <div className='flex-col justify-around'>
            <div className=' flex-col'>
            <TextField
              className='min-w-[170px]'
              margin="normal"
              required
              fullWidth
              type='text'
              placeholder='name' value={name} onChange={(e) => setName(e.target.value)}
            />
            <TextField
              className='min-w-[170px]'
              margin="normal"
              required
              fullWidth
              placeholder='quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)}
            />
            <TextField
              className='min-w-[170px]'
              margin="normal"
              required
              fullWidth placeholder='price' value={price} onChange={(e) => setPrice(e.target.value)}
            />
            </div>
            <div className='flex flex-row'>
              <button onClick={add} className='mx-2 px-2 py-3 my-5 bg-slate-600 text-white rounded-md button'>
                Select
              </button>
              <button className='mx-2 px-2 py-3 my-5 bg-slate-600 text-white rounded-md button' onClick={handleAddItemsToDatabase}>
                {(addLoading)?<CircularProgress size="1.3rem" color='inherit'/>:"Add to store"}
              </button>
            </div>
        </div>
      </div>

      <div>
      {
        (itemsList.length>0) && 
        (<div className='overflow-y-scroll overflow-hidden h-[250px] flex flex-col p-3 my-10 mx-[auto] items-center border-2 max-w-[70%] sm:max-w-[500px] rounded-xl '>
            <p className='text-xl font-semibold'>Selected Items</p>
            {renderedItems}
        </div>)
      }
      </div>
      </Box>
      </Box>
    </div>
  </>
  )
}

export default Store
