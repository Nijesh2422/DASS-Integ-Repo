import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation,useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import DisplayEditPage from "./DisplayEdit";
import Navbar from './Navbar2'
export default function DisplaySavePage(){
  const {pageid} = useParams();
  const [resp, setResp] = useState([]);

  async function fetchPageContents(index) {
    axios.get(`/api/display-save/${index}`)
    .then(res => {
        setResp(res.data.items)
    })
    .catch(err => console.log(err))
  }
  
  useEffect(() => {
    fetchPageContents(pageid);
  }, [])

  return(
    <>
    <Navbar/>
    <DisplayEditPage Edititems={resp} responseData={pageid}/>
    </>
  );

}