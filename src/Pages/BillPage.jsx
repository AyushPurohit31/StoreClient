import React, { useState } from 'react'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Chip, CircularProgress, Tooltip, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-hot-toast';


const BillPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [billList, setBillList] = React.useState([]);
  const [status, setStatus] = React.useState("all");
  const [loading, setLoading ] = useState(false);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const getFilteredBills = () => {
    if (status === "all") {
      return billList;
    } else {
      return billList.filter((bill) => bill.status === status);
    }
  };
  const filteredBills = getFilteredBills();

  const statusUpdate = async(bid)=>{
    const userId = userInfo._id;
    const billId = bid;
      try {
        setLoading(true);
        const response = await axios.post('/store/updateStatus', { userId, billId });
        toast.success(response.data.message);
        getBills();
        setLoading(false);
        } 
      catch (error) {
        toast.error('Error updating bill status:');
        setLoading(false);
      }
  }

  const getBills = () =>{
    const userId = userInfo._id;

    axios.get(`/store/bills/${userId}`)
      .then((response) => {
        setBillList(response.data.bills);
      })
      .catch((error) => {
        console.error('Error fetching store items:', error);
      });
  }

  React.useEffect(()=>{
    getBills();
  },[])
  return (
    <>
        <Header/>
        <Navbar/>

        <div className='flex-col m-10'>         
          <Chip 
            className='backCss text-lg font-bold'
            style={{backgroundColor:'rgba(226, 213, 252, 0.8)', padding:"2px"}} 
            label={<a href='/' className='flex items-center '><ArrowBackIosNewIcon/>&nbsp;<p>Dashboard</p></a>}  
            variant="outlined" 
          />
          <div className='flex sm:flex-row flex-col justify-between'>
            <Typography sx={{fontWeight : 700, fontSize: 25, my:3}}>Available Bills</Typography>
            <Box sx={{ width: {md:"300px", xs:"150px"}}}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  size='small'
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>

        <div className='flex justify-center'>
          <TableContainer sx={{ maxWidth: "90%" }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead sx={{backgroundColor:"#E8F1A7"}}>
              <TableRow>
                <TableCell align='center'>Sr</TableCell>
                <TableCell align="center">Customer name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredBills.map((row, key) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{key+1}</TableCell>
                <TableCell align='center' component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.phone}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="center">{row.amount}</TableCell>
                <TableCell sx={{color:`${(row.status!=="paid")?"red":"green"}`}} align="center">
                  {row.status}&nbsp;{(row.status!=="paid")?
                    <Tooltip title="Update status to paid">
                      <button onClick={()=>statusUpdate(row._id)}>
                        {(loading)?<CircularProgress size="0.5rem"/>:<EditIcon sx={{height:"20px", color:"black"}}/>}
                      </button>
                    </Tooltip>:""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </div>
    </>
  )
}

export default BillPage
