import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AdminConfigPage from './UserPage';
import reportWebVitals from './reportWebVitals';
import Navbar from './Navbar2';
import RightSideContainer from './AddNew'
import NavBar from './Navbar3'
import DisplaySavePage from './DisplaySavePage'
import { BrowserRouter, Routes ,Route, Link } from 'react-router-dom';
import DisplayPublishPage from './DisplayPublishPage';
import ParallaxScroll from './parallax'
import UserManage from './UserManage';
import Login from './Login'
import NewsPage from './news'
import PoliciesPage from './PoliciesPage';
import PdfViewer from './pdfviewer'
import EventsPage from './events'
import Versioning from './VersioningPage'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/admin-config' element={<AdminConfigPage/>}/>
      <Route path='/user-end' element={<ParallaxScroll/>}/>
      <Route path='/add-new/' element={<RightSideContainer/>}/>
      <Route path='/display-publish/:pageid' element={<DisplayPublishPage/>}/>
      <Route path='/display-save/:pageid' element={<DisplaySavePage/>}/>
      <Route path='/display-parallax' element={<ParallaxScroll/>}/>
      <Route path='/user-manage' element={<UserManage/>}/>
      <Route path='/view-all-news' element={<NewsPage/>}/>
      <Route path='/view-all-events' element={<EventsPage/>}/>
      <Route path='/display-pdf/:itemid' element={<PdfViewer/>}/>
      <Route path='/view-versions/:fieldId' element={<Versioning/>}/>
      <Route path='/' element={<NewsPage/>}/>
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();