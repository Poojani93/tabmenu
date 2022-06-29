import React from 'react'
import { useState } from "react";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import './TabMenu.css'
import 'bootstrap/dist/css/bootstrap.css';
import Daily from './Daily';
// import Monthly from './Monthly';
import Navbar from './Navbar';

const TabMenu = () => {

    const [key, setKey] = useState('home');

  return (
    
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="home" title="Daily">
        {/* <Daily /> */}
      </Tab>
      <Tab eventKey="profile" title="Monthly">
        {/* <Monthly /> */}
      </Tab>
    </Tabs>
  )
}

export default TabMenu