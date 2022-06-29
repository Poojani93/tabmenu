import React from 'react'
import './Daily.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import mqtt from 'mqtt/dist/mqtt'
// import { useState } from "react";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import './TabMenu.css'
import 'bootstrap/dist/css/bootstrap.css';
import { months } from '../months';
import Months from './Months';
import '../App.css'

const Daily = (props) => {
    const [getenergy_daily, setBranch] = useState([]);
    const [key1, setKey1] = useState('home');
    const [key2, setKey2] = useState('home');
    const [urlM, setUrlM] = useState([]);
    const [urlG, setUrlG] = useState([]);
    const [main, setMain] = useState ([]);

    useEffect(() => {
        axios.get(section)
        .then(res => {
            console.log(res)
            setBranch(res.data)
            
        })
        .catch(err => {
            console.log(err)
        })
    }, [] ); 

    useEffect(() => {
      axios.get("http://localhost:5002/daily/18")
      .then(res => {
          console.log(res)
          setMain(res.data)
          
      })
      .catch(err => {
          console.log(err)
      })
  }, [] ); 

  console.log(main.main_reading1)

    let topic, mainReading, genReading, section, january, february, march, april, may, june, july, august, september, october, november, december;

    var client  = mqtt.connect('ws://192.168.8.110:8083/mqtt');

    client.subscribe("data/power/powerdash/9999");
    
    //   var note;
      client.on('message', function (topic, message) {
        setMesg(JSON.parse(message.toString()));
        // Updates React state with message 
        // setMesg(note);
        // console.log(note);
        client.end();
        });
    
      // Sets default React state 
      const [mesg, setMesg] = useState('0');  


    if(main.main_reading2 === main.main_reading1){
        switch (props.id) {
            case "powerReading0":
                mainReading = mesg.mainPowerReading;
                section = "http://localhost:5002/daily/1";
              break;
            case "powerReading1":
              mainReading = mesg.powerReading1;
              section = "http://localhost:5002/daily/1";
              break;
            case "powerReading2":
              mainReading = mesg.powerReading2;
              section = "http://localhost:5002/daily/2";
              break;
            case "powerReading3":
              mainReading = mesg.powerReading3;
              section = "http://localhost:5002/daily/3";
              break;
            case "powerReading4":
              mainReading = mesg.powerReading4;
              section = "http://localhost:5002/daily/4";
              break;
            case "powerReading5":
              mainReading = mesg.powerReading5;
              section = "http://localhost:5002/daily/5";
              break;
            case "powerReading6":
              mainReading = mesg.powerReading6;
              section = "http://localhost:5002/daily/6";
              break;
            case "powerReading7":
              mainReading = mesg.powerReading7;
              section = "http://localhost:5002/daily/7";
              break;
            case "powerReading8":
              mainReading = mesg.powerReading8;
              section = "http://localhost:5002/daily/8";
              break;
            case "powerReading9":
              mainReading = mesg.powerReading9;
              section = "http://localhost:5002/daily/9";
              break;
            case "powerReading10":
              mainReading = mesg.powerReading10;
              section = "http://localhost:5002/daily/10";
              break;
            case "powerReading11":
              mainReading = mesg.powerReading11;
              section = "http://localhost:5002/daily/11";
              break;
            case "powerReading12":
              mainReading = mesg.powerReading12;
              section = "http://localhost:5002/daily/12";
              break;
            case "powerReading13":
              mainReading = mesg.powerReading13;
              section = "http://localhost:5002/daily/13";
              break;
            case "powerReading14":
              mainReading = mesg.powerReading14;
              section = "http://localhost:5002/daily/14";
              break;
            case "powerReading15":
              mainReading = mesg.powerReading15;
              section = "http://localhost:5002/daily/15";
              break;
            case "powerReading16":
              mainReading = mesg.powerReading16;
              section = "http://localhost:5002/daily/16";
              break;
            default:
              mainReading = "No data";
          }
    }else{
        switch (props.id) {
            case "powerReading0":
              genReading = mesg.genPowerReading;
              section = "http://localhost:5002/daily/1"
            break;
            case "powerReading1":
              genReading = mesg.powerReading1;
              section = "http://localhost:5002/daily/1"
              break;
            case "powerReading2":
              genReading = mesg.powerReading2;
              section = "http://localhost:5002/daily/2"
              break;
            case "powerReading3":
              genReading = mesg.powerReading3;
              section = "http://localhost:5002/daily/3"
              break;
            case "powerReading4":
              genReading = mesg.powerReading4;
              section = "http://localhost:5002/daily/4"
              break;
            case "powerReading5":
              genReading = mesg.powerReading5;
              section = "http://localhost:5002/daily/5"
              break;
            case "powerReading6":
              genReading = mesg.powerReading6;
              section = "http://localhost:5002/daily/6"
              break;
            case "powerReading7":
              genReading = mesg.powerReading7;
              section = "http://localhost:5002/daily/7"
              break;
            case "powerReading8":
              genReading = mesg.powerReading8;
              section = "http://localhost:5002/daily/8"
              break;
            case "powerReading9":
              genReading = mesg.powerReading9;
              section = "http://localhost:5002/daily/9"
              break;
            case "powerReading10":
              genReading = mesg.powerReading10;
              section = "http://localhost:5002/daily/10"
              break;
            case "powerReading11":
              genReading = mesg.powerReading11;
              section = "http://localhost:5002/daily/11"
              break;
            case "powerReading12":
              genReading = mesg.powerReading12;
              section = "http://localhost:5002/daily/12"
              break;
            case "powerReading13":
              genReading = mesg.powerReading13;
              section = "http://localhost:5002/daily/13"
              break;
            case "powerReading14":
              genReading = mesg.powerReading14;
              section = "http://localhost:5002/daily/14"
              break;
            case "powerReading15":
              genReading = mesg.powerReading15;
              section = "http://localhost:5002/daily/15"
              break;
            case "powerReading16":
              genReading = mesg.powerReading16;
              section = "http://localhost:5002/daily/16"
              break;
            default:
              genReading = "0";
          }
    }

    switch (section) {
      case "powerReading0":
        january = "http://localhost:5002/section1/1";
        february = "http://localhost:5002/section1/2";
        march = "http://localhost:5002/section1/3";
        april = "http://localhost:5002/section1/4";
        may = "http://localhost:5002/section1/5";
        june = "http://localhost:5002/section1/6";
        july = "http://localhost:5002/section1/7";
        august = "http://localhost:5002/section1/8";
        september = "http://localhost:5002/section1/9";
        october = "http://localhost:5002/section1/10";
        november = "http://localhost:5002/section1/11";
        december = "http://localhost:5002/section1/12"
      break;
      case "http://localhost:5002/daily/1":
        january = "http://localhost:5002/section1/1";
        february = "http://localhost:5002/section1/2";
        march = "http://localhost:5002/section1/3";
        april = "http://localhost:5002/section1/4";
        may = "http://localhost:5002/section1/5";
        june = "http://localhost:5002/section1/6";
        july = "http://localhost:5002/section1/7";
        august = "http://localhost:5002/section1/8";
        september = "http://localhost:5002/section1/9";
        october = "http://localhost:5002/section1/10";
        november = "http://localhost:5002/section1/11";
        december = "http://localhost:5002/section1/12"
        break;
      case "http://localhost:5002/daily/2":
        january = "http://localhost:5002/section2/1";
        february = "http://localhost:5002/section2/2";
        march = "http://localhost:5002/section2/3"
        april = "http://localhost:5002/section2/4";
        may = "http://localhost:5002/section2/5";
        june = "http://localhost:5002/section2/6";
        july = "http://localhost:5002/section2/7";
        august = "http://localhost:5002/section2/8";
        september = "http://localhost:5002/section2/9";
        october = "http://localhost:5002/section2/10";
        november = "http://localhost:5002/section2/11";
        december = "http://localhost:5002/section2/12"
        break;
      case "http://localhost:5002/daily/3":
        january = "http://localhost:5002/section3/1";
        february = "http://localhost:5002/section3/2";
        march = "http://localhost:5002/section3/3"
        april = "http://localhost:5002/section3/4";
        may = "http://localhost:5002/section3/5";
        june = "http://localhost:5002/section3/6";
        july = "http://localhost:5002/section3/7";
        august = "http://localhost:5002/section3/8";
        september = "http://localhost:5002/section3/9";
        october = "http://localhost:5002/section3/10";
        november = "http://localhost:5002/section3/11";
        december = "http://localhost:5002/section3/12"
        break;
      case "http://localhost:5002/daily/4":
        january = "http://localhost:5002/section4/1";
        february = "http://localhost:5002/section4/2";
        march = "http://localhost:5002/section4/3"
        april = "http://localhost:5002/section4/4";
        may = "http://localhost:5002/section4/5";
        june = "http://localhost:5002/section4/6";
        july = "http://localhost:5002/section4/7";
        august = "http://localhost:5002/section4/8";
        september = "http://localhost:5002/section4/9";
        october = "http://localhost:5002/section4/10";
        november = "http://localhost:5002/section4/11";
        december = "http://localhost:5002/section4/12"
        break;
      case "http://localhost:5002/daily/5":
        january = "http://localhost:5002/section5/1";
        february = "http://localhost:5002/section5/2";
        march = "http://localhost:5002/section5/3";
        april = "http://localhost:5002/section5/4";
        may = "http://localhost:5002/section5/5";
        june = "http://localhost:5002/section5/6";
        july = "http://localhost:5002/section5/7";
        august = "http://localhost:5002/section5/8";
        september = "http://localhost:5002/section5/9";
        october = "http://localhost:5002/section5/10";
        november = "http://localhost:5002/section5/11";
        december = "http://localhost:5002/section5/12"
        break;
      case "http://localhost:5002/daily/6":
        january = "http://localhost:5002/section6/1";
        february = "http://localhost:5002/section6/2";
        march = "http://localhost:5002/section6/3";
        april = "http://localhost:5002/section6/4";
        may = "http://localhost:5002/section6/5";
        june = "http://localhost:5002/section6/6";
        july = "http://localhost:5002/section6/7";
        august = "http://localhost:5002/section6/8";
        september = "http://localhost:5002/section6/9";
        october = "http://localhost:5002/section6/10";
        november = "http://localhost:5002/section6/11";
        december = "http://localhost:5002/section6/12"        
        break;
      case "http://localhost:5002/daily/7":
        january = "http://localhost:5002/section7/1";
        february = "http://localhost:5002/section7/2";
        march = "http://localhost:5002/section7/3";
        april = "http://localhost:5002/section7/4";
        may = "http://localhost:5002/section7/5";
        june = "http://localhost:5002/section7/6";
        july = "http://localhost:5002/section7/7";
        august = "http://localhost:5002/section7/8";
        september = "http://localhost:5002/section7/9";
        october = "http://localhost:5002/section7/10";
        november = "http://localhost:5002/section7/11";
        december = "http://localhost:5002/section7/12"        
        break;
      case "http://localhost:5002/daily/8":
        january = "http://localhost:5002/section8/1";
        february = "http://localhost:5002/section8/2";
        march = "http://localhost:5002/section8/3";
        april = "http://localhost:5002/section8/4";
        may = "http://localhost:5002/section8/5";
        june = "http://localhost:5002/section8/6";
        july = "http://localhost:5002/section8/7";
        august = "http://localhost:5002/section8/8";
        september = "http://localhost:5002/section8/9";
        october = "http://localhost:5002/section8/10";
        november = "http://localhost:5002/section8/11";
        december = "http://localhost:5002/section8/12"
        break;
      case "http://localhost:5002/daily/9":
        january = "http://localhost:5002/section9/1";
        february = "http://localhost:5002/section9/2";
        march = "http://localhost:5002/section9/3";
        april = "http://localhost:5002/section9/4";
        may = "http://localhost:5002/section9/5";
        june = "http://localhost:5002/section9/6";
        july = "http://localhost:5002/section9/7";
        august = "http://localhost:5002/section9/8";
        september = "http://localhost:5002/section9/9";
        october = "http://localhost:5002/section9/10";
        november = "http://localhost:5002/section9/11";
        december = "http://localhost:5002/section9/12"        
        break;
      case "http://localhost:5002/daily/10":
        january = "http://localhost:5002/section10/1";
        february = "http://localhost:5002/section10/2";
        march = "http://localhost:5002/section10/3";
        april = "http://localhost:5002/section10/4";
        may = "http://localhost:5002/section10/5";
        june = "http://localhost:5002/section10/6";
        july = "http://localhost:5002/section10/7";
        august = "http://localhost:5002/section10/8";
        september = "http://localhost:5002/section10/9";
        october = "http://localhost:5002/section10/10";
        november = "http://localhost:5002/section10/11";
        december = "http://localhost:5002/section10/12"
        break;
      case "http://localhost:5002/daily/11":
        january = "http://localhost:5002/section11/1";
        february = "http://localhost:5002/section11/2";
        march = "http://localhost:5002/section11/3";
        april = "http://localhost:5002/section11/4";
        may = "http://localhost:5002/section11/5";
        june = "http://localhost:5002/section11/6";
        july = "http://localhost:5002/section11/7";
        august = "http://localhost:5002/section11/8";
        september = "http://localhost:5002/section11/9";
        october = "http://localhost:5002/section11/10";
        november = "http://localhost:5002/section11/11";
        december = "http://localhost:5002/section11/12"
        break;
      case "http://localhost:5002/daily/12":
        january = "http://localhost:5002/section12/1";
        february = "http://localhost:5002/section12/2";
        march = "http://localhost:5002/section12/3";
        april = "http://localhost:5002/section12/4";
        may = "http://localhost:5002/section12/5";
        june = "http://localhost:5002/section12/6";
        july = "http://localhost:5002/section12/7";
        august = "http://localhost:5002/section12/8";
        september = "http://localhost:5002/section12/9";
        october = "http://localhost:5002/section12/10";
        november = "http://localhost:5002/section12/11";
        december = "http://localhost:5002/section12/12"
        break;
      case "http://localhost:5002/daily/13":
        january = "http://localhost:5002/section13/1";
        february = "http://localhost:5002/section13/2";
        march = "http://localhost:5002/section13/3";
        april = "http://localhost:5002/section13/4";
        may = "http://localhost:5002/section13/5";
        june = "http://localhost:5002/section13/6";
        july = "http://localhost:5002/section13/7";
        august = "http://localhost:5002/section13/8";
        september = "http://localhost:5002/section13/9";
        october = "http://localhost:5002/section13/10";
        november = "http://localhost:5002/section13/11";
        december = "http://localhost:5002/section13/12"
        break;
      case "http://localhost:5002/daily/14":
        january = "http://localhost:5002/section14/1";
        february = "http://localhost:5002/section14/2";
        march = "http://localhost:5002/section14/3";
        april = "http://localhost:5002/section14/4";
        may = "http://localhost:5002/section14/5";
        june = "http://localhost:5002/section14/6";
        july = "http://localhost:5002/section14/7";
        august = "http://localhost:5002/section14/8";
        september = "http://localhost:5002/section14/9";
        october = "http://localhost:5002/section14/10";
        november = "http://localhost:5002/section14/11";
        december = "http://localhost:5002/section14/12"
        break;
      case "http://localhost:5002/daily/15":
        january = "http://localhost:5002/section15/1";
        february = "http://localhost:5002/section15/2";
        march = "http://localhost:5002/section15/3";
        april = "http://localhost:5002/section15/4";
        may = "http://localhost:5002/section15/5";
        june = "http://localhost:5002/section15/6";
        july = "http://localhost:5002/section15/7";
        august = "http://localhost:5002/section15/8";
        september = "http://localhost:5002/section15/9";
        october = "http://localhost:5002/section15/10";
        november = "http://localhost:5002/section15/11";
        december = "http://localhost:5002/section15/12"
        break;
      case "http://localhost:5002/daily/16":
        january = "http://localhost:5002/section16/1";
        february = "http://localhost:5002/section16/2";
        march = "http://localhost:5002/section16/3";
        april = "http://localhost:5002/section16/4";
        may = "http://localhost:5002/section16/5";
        june = "http://localhost:5002/section16/6";
        july = "http://localhost:5002/section16/7";
        august = "http://localhost:5002/section16/8";
        september = "http://localhost:5002/section16/9";
        october = "http://localhost:5002/section16/10";
        november = "http://localhost:5002/section16/11";
        december = "http://localhost:5002/section16/12"
        break;
      default:
        january = "0";
    }

    let offPeak, day, peak;
    
  return (
    <div className="containers">
      <div className="cards generator" style={{textAlign:"left"}}>
        <h2>Main</h2>
      <Tabs
      id="controlled-tab-example"
      activeKey={key1}
      onSelect={(k1) => setKey1(k1)}
      className="mb-3"
    >
      <Tab eventKey="home" title="Daily">
        {/* <Daily /> */}
        <table>
          <tbody>
            {getenergy_daily.map(machine => {
              if (machine.offPeak_main > machine.day_main) {
                offPeak = "Null";
              } else {
                offPeak = (machine.day_main - machine.offPeak_main - (machine.day_gen - machine.offPeak_gen));
              }
              if (machine.day_main > machine.peak_main) {
                day = "Null";
              } else {
                day = (machine.peak_main - machine.day_main - (machine.offPeak_gen - machine.day_gen));
              }
              if (machine.peak_main > machine.offPeak_main) {
                peak = "Null";
              } else {
                peak = (machine.offPeak_main - machine.peak_main - (machine.offPeak_gen - machine.offPeak_gen));
              }
                return(<>
                  <tr>
                    <td>Main Reading</td>
                    <td>{mainReading}</td>
                  </tr>
                  <tr>
                    <td>Off Peak</td>
                    <td key={machine.id}>{offPeak}</td>
                  </tr><tr>
                    <td>Day</td>
                    <td key={machine.id}>{day}</td>
                  </tr><tr>
                    <td>Peak</td>
                    <td key={machine.id}>{peak}</td>
                  </tr></>)
                })}
                
            </tbody>
          </table>
      </Tab>
      <Tab eventKey="profile" title="Monthly">
        {/* <Monthly /> */}
        <select className='select' style={{display: "inline"}} onChange={e => {
                    axios.get(e.target.value)
                    .then(res => {
                        console.log(res)
                        setUrlM(res.data)
                        
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }}>
            <option></option>
            <option value={january}>January</option>
            <option value={february}>February</option>
            <option value={march}>March</option>
            <option value={april}>April</option>
            <option value={may}>May</option>
            <option value={june}>June</option>
            <option value={july}>July</option>
            <option value={august}>August</option>
            <option value={september}>September</option>
            <option value={october}>October</option>
            <option value={november}>November</option>
            <option value={december}>December</option>
        </select>
        <table>
                <tbody>
                {urlM.map(option => {
                    return(<>
                    <tr>
                        <td className='mainReading'>mainReading</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Off Peak</td>
                        <td key={option.id}>{option.offPeak_main}</td>
                    </tr><tr>
                        <td>Day</td>
                        <td key={option.id}>{option.day_main}</td>
                    </tr><tr>
                        <td>Peak</td>
                        <td key={option.id}>{option.peak_main}</td>
                    </tr></>)
                })}
                
            </tbody>
            </table>
      </Tab>
    </Tabs>

    </div>

    <div className="cards generator" style={{textAlign:"left"}}>
      <h2>Generator</h2>
    <Tabs
      id="controlled-tab-example"
      activeKey={key2}
      onSelect={(k2) => setKey2(k2)}
      className="mb-3"
    >
      <Tab eventKey="home" title="Daily">
        {/* <Daily /> */}
        <table>
          <tbody>
            {getenergy_daily.map(machine => {
              if (machine.offPeak_gen > machine.day_gen) {
                offPeak = "Null";
              } else {
                offPeak = (machine.day_gen - machine.offPeak_gen);
              }
              if (machine.day_gen > machine.peak_gen) {
                day = "Null";
              } else {
                day = (machine.peak_gen - machine.day_gen);
              }
              if (machine.peak_gen > machine.offPeak_gen) {
                peak = "Null";
              } else {
                peak = (machine.offPeak_gen - machine.peak_gen);
              }
                    return(<>
                    <tr>
                        <td>Generator Reading</td>
                        <td>{genReading}</td>
                    </tr>
                    <tr>
                        <td>Off Peak</td>
                        <td key={machine.id}>{machine.offPeak_gen}</td>
                    </tr><tr>
                        <td>Day</td>
                        <td key={machine.id}>{machine.day_gen}</td>
                    </tr><tr>
                        <td>Peak</td>
                        <td key={machine.id}>{machine.peak_main}</td>
                    </tr></>)
                })}
                
            </tbody>
            </table>
      </Tab>
      <Tab eventKey="profile" title="Monthly">
        {/* <Monthly /> */}
        <select className='select' onChange={e => {
                    axios.get(e.target.value)
                    .then(res => {
                        console.log(res)
                        setUrlG(res.data)
                        
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }}>
            <option></option>
            <option value={january}>January</option>
            <option value={february}>February</option>
            <option value={march}>March</option>
            <option value={april}>April</option>
            <option value={may}>May</option>
            <option value={june}>June</option>
            <option value={july}>July</option>
            <option value={august}>August</option>
            <option value={september}>September</option>
            <option value={october}>October</option>
            <option value={november}>November</option>
            <option value={december}>December</option>
        </select>
        <table>
                <tbody>
                {urlG.map(option => {
                    return(<>
                    <tr>
                        <td className='mainReading'>mainReading</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Off Peak</td>
                        <td key={option.id}>{option.offPeak_gen}</td>
                    </tr><tr>
                        <td>Day</td>
                        <td key={option.id}>{option.day_gen}</td>
                    </tr><tr>
                        <td>Peak</td>
                        <td key={option.id}>{option.peak_gen}</td>
                    </tr></>)
                })}
                
            </tbody>
            </table>
      </Tab>
    </Tabs>

        </div>
    </div>
    // <div className='wrapper'>
    //   <div className='cards'>
    //     <div className='one'>
    //       <h2>Main</h2>
    //     </div>
    //     <div className='three'></div>
    //     <div className='oneone'>
    //     <Tabs
    //   id="controlled-tab-example"
    //   activeKey={key1}
    //   onSelect={(k1) => setKey1(k1)}
    //   className="mb-3"
    // >
    //    <Tab eventKey="home" title="Daily">
    //     {/* <Daily /> */}
    //      <table>
    //        <tbody>
    //          {getenergy_daily.map(machine => {
    //           if (machine.offPeak_main > machine.day_main) {
    //             offPeak = "Null";
    //           } else {
    //             offPeak = (machine.day_main - machine.offPeak_main - (machine.day_gen - machine.offPeak_gen));
    //           }
    //           if (machine.day_main > machine.peak_main) {
    //             day = "Null";
    //           } else {
    //             day = (machine.peak_main - machine.day_main - (machine.offPeak_gen - machine.day_gen));
    //           }
    //           if (machine.peak_main > machine.offPeak_main) {
    //             peak = "Null";
    //           } else {
    //             peak = (machine.offPeak_main - machine.peak_main - (machine.offPeak_gen - machine.offPeak_gen));
    //           }
    //             return(<>
    //               <tr>
    //                 <td>Main Reading</td>
    //                 <td>{mainReading}</td>
    //               </tr>
    //               <tr>
    //                 <td>Off Peak</td>
    //                 <td key={machine.id}>{offPeak}</td>
    //               </tr><tr>
    //                 <td>Day</td>
    //                 <td key={machine.id}>{day}</td>
    //               </tr><tr>
    //                 <td>Peak</td>
    //                 <td key={machine.id}>{peak}</td>
    //               </tr></>)
    //             })}
                
    //         </tbody>
    //       </table>
    //   </Tab>
    //    <Tab eventKey="profile" title="Monthly">
    //      {/* <Monthly /> */}
    //      <select className='select' style={{display: "inline"}} onChange={e => {
    //                 axios.get(e.target.value)
    //                 .then(res => {
    //                     console.log(res)
    //                     setUrlM(res.data)
                        
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                 })
    //         }}>
    //         <option></option>
    //         <option value={january}>January</option>
    //         <option value={february}>February</option>
    //         <option value={march}>March</option>
    //         <option value={april}>April</option>
    //         <option value={may}>May</option>
    //         <option value={june}>June</option>
    //         <option value={july}>July</option>
    //         <option value={august}>August</option>
    //         <option value={september}>September</option>
    //         <option value={october}>October</option>
    //         <option value={november}>November</option>
    //         <option value={december}>December</option>
    //     </select>
    //     <table>
    //             <tbody>
    //             {urlM.map(option => {
    //                 return(<>
    //                 <tr>
    //                     <td className='mainReading'>mainReading</td>
    //                     <td></td>
    //                 </tr>
    //                 <tr>
    //                     <td>Off Peak</td>
    //                     <td key={option.id}>{option.offPeak_main}</td>
    //                 </tr><tr>
    //                     <td>Day</td>
    //                     <td key={option.id}>{option.day_main}</td>
    //                 </tr><tr>
    //                     <td>Peak</td>
    //                     <td key={option.id}>{option.peak_main}</td>
    //                 </tr></>)
    //             })}
                
    //         </tbody>
    //         </table>
    //   </Tab>
    // </Tabs>
    //     </div>
    //   </div>
    //   <div className='cards'>
    //   <div className='one'>
    //     <h2>Generator</h2>
    //   </div>
    //     <div className='two'></div>
    //     <div className='three'></div>
    //     <div className='oneone'>
    //  <Tabs
    //   id="controlled-tab-example"
    //   activeKey={key2}
    //   onSelect={(k2) => setKey2(k2)}
    //   className="mb-3"
    // >
    //   <Tab eventKey="home" title="Daily">
    //      {/* <Daily /> */}
    //     <table>
    //       <tbody>
    //         {getenergy_daily.map(machine => {
    //           if (machine.offPeak_gen > machine.day_gen) {
    //             offPeak = "Null";
    //           } else {
    //             offPeak = (machine.day_gen - machine.offPeak_gen);
    //           }
    //           if (machine.day_gen > machine.peak_gen) {
    //             day = "Null";
    //           } else {
    //             day = (machine.peak_gen - machine.day_gen);
    //           }
    //           if (machine.peak_gen > machine.offPeak_gen) {
    //             peak = "Null";
    //           } else {
    //             peak = (machine.offPeak_gen - machine.peak_gen);
    //           }
    //                 return(<>
    //                 <tr>
    //                     <td>Generator Reading</td>
    //                     <td>{genReading}</td>
    //                 </tr>
    //                 <tr>
    //                     <td>Off Peak</td>
    //                     <td key={machine.id}>{machine.offPeak_gen}</td>
    //                 </tr><tr>
    //                     <td>Day</td>
    //                     <td key={machine.id}>{machine.day_gen}</td>
    //                 </tr><tr>
    //                     <td>Peak</td>
    //                     <td key={machine.id}>{machine.peak_main}</td>
    //                 </tr></>)
    //             })}
                
    //         </tbody>
    //         </table>
    //   </Tab>
    //   <Tab eventKey="profile" title="Monthly">
    //      {/* <Monthly /> */}
    //     <select className='select' onChange={e => {
    //                 axios.get(e.target.value)
    //                 .then(res => {
    //                     console.log(res)
    //                     setUrlG(res.data)
                        
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                 })
    //         }}>
    //         <option></option>
    //         <option value={january}>January</option>
    //         <option value={february}>February</option>
    //         <option value={march}>March</option>
    //         <option value={april}>April</option>
    //         <option value={may}>May</option>
    //         <option value={june}>June</option>
    //         <option value={july}>July</option>
    //         <option value={august}>August</option>
    //         <option value={september}>September</option>
    //         <option value={october}>October</option>
    //         <option value={november}>November</option>
    //         <option value={december}>December</option>
    //     </select>
    //     <table>
    //             <tbody>
    //             {urlG.map(option => {
    //                 return(<>
    //                 <tr>
    //                     <td className='mainReading'>mainReading</td>
    //                     <td></td>
    //                 </tr>
    //                 <tr>
    //                     <td>Off Peak</td>
    //                     <td key={option.id}>{option.offPeak_gen}</td>
    //                 </tr><tr>
    //                     <td>Day</td>
    //                     <td key={option.id}>{option.day_gen}</td>
    //                 </tr><tr>
    //                     <td>Peak</td>
    //                     <td key={option.id}>{option.peak_gen}</td>
    //                 </tr></>)
    //             })}
                
    //         </tbody>
    //         </table>
    //   </Tab>
    // </Tabs>
    //     </div>
    //   </div>
    // </div>
  )
}

export default Daily