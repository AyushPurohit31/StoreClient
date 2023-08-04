import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { Autocomplete, Button, CircularProgress, Input, Radio, TextField } from '@mui/material';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-hot-toast';


const Dashboard = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [itemList, setItemsList] = useState([]);
  const [addedItemList, setAddedItemsList] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [availableQt, setAvailableQt] = useState("");

  const [selectedValue, setSelectedValue] = React.useState('paid');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  //customer details
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate the total sum of quantities
  const totalSumOfQuantities = addedItemList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = addedItemList.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const handleDelete = (itemName)=>{
    const updatedItemList = addedItemList.filter((item) => item.name !== itemName);
    setAddedItemsList(updatedItemList);
    console.log(addedItemList)
    toast.success("Item deleted")
  }

  const userId = userInfo._id; // Replace this with the actual user ID

    const fetchData = async () => {
      try {
        const response = await axios.get(`/store/items/${userId}`);
        console.log('Response:', response.data);
        setItemsList(response.data.storeItems); // Set filtered items initially to all items
      } catch (error) {
        console.error('Error fetching store items:', error);
      }
    };

  const handleAddToAddedItemsList = () => {
    // Parse the quantity as an integer
    const parsedQuantity = parseInt(quantity);
    const parsedAvailable = parseInt(availableQt)
  
    // Check if quantity is a valid integer and greater than 0
    if (name!=="" && Number.isInteger(parsedQuantity) && parsedQuantity > 0 && parsedQuantity<=parsedAvailable) {
      const newItem = {
        name: name,
        price: price,
        quantity: parsedQuantity,
      };
  
      const existingItem = addedItemList.find((item) => item.name === name);
  
      if (existingItem) {
        const updatedItemList = addedItemList.map((item) => {
          if (item.name === name) {
            return { ...item, price: price, quantity: parsedQuantity };
          } else {
            return item;
          }
        });
  
        setAddedItemsList(updatedItemList);
      } else {
        setAddedItemsList((prevItems) => [...prevItems, newItem]);
      }
    } else {
      if(name===""){
        toast.error('Please select Item!');
      }
      else if(!Number.isInteger(parsedQuantity) || parsedQuantity <= 0){
        toast.error('Please enter a valid quantity (>0)!');
      }else if(quantity>availableQt){
        toast.error("This much item is not available!")
      }
    }
  };

  const handleCheckOut = async()=>{
      if(!customer || !email || !phone){
        toast("Please fill all the details!");
      }else if(addedItemList.length==0){
        toast.error("Please select items!")
      }
      else{
      const d = new Date();
      const userId = userInfo._id;
      const data = {
        userId : userId,
        bill : {
          name: customer,
          email: email,
          phone: phone,
          amount: totalPrice,
          date : d,
          status: selectedValue
        },
        items: addedItemList
      }
      try {
        setLoading(true);
        const response = await axios.post('/store/addBill', data);
        setLoading(false);
        toast.success("Bill Prepared and sent to customer email!");
        fetchData();
        setAddedItemsList([]);
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong!");
      }
    }
  }
  

  useEffect(() => {
    if (name) {
      // Find the selected item from the itemList
      const item = itemList.find((item) => item.name === name);
      setPrice(item.price)
      setAvailableQt(item.quantity);
    }
  }, [name, itemList]);
  

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Header />
      <Navbar />
      <div className='flex flex-col md:flex-row bg-slate-50'>
        <div className='flex flex-col w-[90%] md:w-[35%] mx-auto'>
        <div className='my-5 p-1 w-[90%] mx-auto bg-slate-400 h-[340px] rounded-xl flex flex-col'>
          <div className='w-full flex flex-col items-center'>
            <p className='px-1 my-2 font-semibold text-2xl'>Add Products</p>
            <Autocomplete
              sx={{width:"87%"}}
              options={itemList}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params}  placeholder='Search item' />
              )}
              onChange={(e)=>setName(e.target.innerText)}
            />
          </div>
          <div className='flex flex-col w-[90%] items-start pl-3 my-2'>
            <p className='my-1 ml-[5%] text-lg font-semibold'>Name = {name}</p>
            <p className='my-1 ml-[5%] text-lg font-semibold'>Price = {price}</p>
            <p className='my-1 ml-[5%] text-lg font-semibold'>Available quantity = {availableQt}</p>
            <TextField size='small' onChange={(e)=>setQuantity(e.target.value)} sx={{ml:"5%", my:1}} placeholder='Quantity ?'/>
          </div>
          <div className='w-full flex justify-end pr-4'>
            <Button onClick={handleAddToAddedItemsList} sx={{bgcolor:"cyan", color:"black", ":hover":{bgcolor:"aqua", opacity:"0.7"}}}>+ Add item</Button>
          </div>
        </div>

        <div className='my-5 p-3 w-[90%] mx-auto bg-slate-400 h-[360px] flex flex-col rounded-xl'>
          <div className='flex flex-col bg-slate-400'>
              <div className='flex justify-center w-full'>
                <p className='px-1 my-2 font-semibold text-2xl '>Customer details</p>
              </div>
              <div className='flex flex-col w-full justify-start'>
                <TextField  
                  sx={{my:1, width:"90%", mx:"auto"}} 
                  size='small' type='text' placeholder='Name'
                  onChange={(e)=>setCustomer(e.target.value)}
                  />
                <TextField 
                  sx={{my:1, width:"90%", mx:"auto"}} 
                  size='small'  type='email' placeholder='Email'
                  onChange={(e)=>setEmail(e.target.value)}
                  />
                <TextField 
                  sx={{my:1, width:"90%", mx:"auto"}} 
                  size='small' placeholder='Phone'
                  onChange={(e)=>setPhone(e.target.value)}
                  />
              </div>
              <div className='flex flex-col items-center my-1.5'>
                <div className='flex flex-col w-[90%] ml-[7%]'>
                  <p className='SummeryCss'>Payment status = </p>
                  <div className='flex flex-row my-auto justify-center items-center'>
                    <div className='flex flex-row items-center mx-2'>
                      <p className='font-semibold'>Paid</p>
                      <Radio
                        size='small'
                        checked={selectedValue === 'paid'}
                        onChange={handleChange}
                        label="Paid"
                        value="paid"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'Paid' }}
                      />
                    </div>
                    <div className='flex flex-row  items-center mx-2'>
                      <p className='font-semibold'>Pending</p>
                      <Radio
                        size='small'
                        checked={selectedValue === 'pending'}
                        onChange={handleChange}
                        value="pending"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'Pending' }}
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  sx={{bgcolor:"cyan", color:"black", ":hover":{bgcolor:"aqua", opacity:"0.7"}}}
                  onClick={handleCheckOut}
                >{(loading)?<CircularProgress size="1.6rem" color="secondary" />:"Checkout"}</Button>
              </div>
            </div>
        </div>
        </div>

        <div className='my-5 mx-auto h-full w-[90%] md:w-[55%] rounded-xl flex flex-col'>
          <div className='flex flex-col rounded-xl bg-slate-400'>
            <div className='w-full flex justify-center '><p className='px-1 my-2 font-semibold text-2xl '>Added Products</p></div>
            <TableContainer component={Paper}>
              <Table sx={{ width: 'full', overflowY:true, height:'full'}} aria-label="simple table">
                <TableHead sx={{bgcolor:"cyan"}}>
                  <TableRow>
                    <TableCell align='center'>Item name</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell width="80px" align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addedItemList.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align='center' component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.price}</TableCell>
                      <TableCell align="center">{row.quantity}</TableCell>
                      <TableCell align="center">{row.price * row.quantity}</TableCell>
                      <TableCell align="center">
                        <button onClick={()=>handleDelete(row.name)} className='text-orange-600'><DeleteIcon/></button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className='rounded-xl w-[50%] mx-auto flex flex-col mt-10 bg-slate-400'>
              <div className='w-full flex justify-center '><p className='px-1 my-2 font-semibold text-2xl '>Summery</p></div>
              <div className='w-full bg-[#E8F1A7] flex flex-col rounded-b-xl p-2 items-center'>
                  <p className='SummeryCss'>Total Products = {addedItemList.length}</p>
                  <p className='SummeryCss'>Total quantity = {totalSumOfQuantities}</p>
                  <p className='SummeryCss'>Billing amount = {totalPrice}</p>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
