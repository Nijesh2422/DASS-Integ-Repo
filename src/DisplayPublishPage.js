import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation,useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import DisplayView from "./DisplayView";
import Navbar from './Navbar2'
export default function DisplayPublishPage(){
  // const location = useLocation();
  const { pageid } = useParams();
  console.log(pageid);
  const [resp, setResp] = useState([]);

  async function fetchPageContents(index) {
    axios.get(`/api/display-publish/${index}`)
    .then(res => {
        setResp(res.data.items)
        console.log(res.data.items)
    })
    .catch(err => console.log(err))
  }
  
  useEffect(() => {
    fetchPageContents(pageid);
  }, [])

  return(
    <>
    <Navbar/>
    <DisplayView selectedItems={resp}/>
    </>
  );

}