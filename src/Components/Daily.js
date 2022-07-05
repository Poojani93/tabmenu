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

    var client  = mqtt.connect('ws://10.50.8.2:8083/mqtt');

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
                section = "http://localhost:5002/daily/18";
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
              section = "http://localhost:5002/daily/18"
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
      case "http://localhost:5002/daily/1":
        january = "http://localhost:5002/january/1";
        february = "http://localhost:5002/february/1";
        march = "http://localhost:5002/march/1";
        april = "http://localhost:5002/april/1";
        may = "http://localhost:5002/may/1";
        june = "http://localhost:5002/june/1";
        july = "http://localhost:5002/july/1";
        august = "http://localhost:5002/august/1";
        september = "http://localhost:5002/september/1";
        october = "http://localhost:5002/october/1";
        november = "http://localhost:5002/november/1";
        december = "http://localhost:5002/december/1"
        break;
      case "http://localhost:5002/daily/2":
        january = "http://localhost:5002/january/2";
        february = "http://localhost:5002/february/2";
        march = "http://localhost:5002/march/2"
        april = "http://localhost:5002/april/2";
        may = "http://localhost:5002/may/2";
        june = "http://localhost:5002/june/2";
        july = "http://localhost:5002/july/2";
        august = "http://localhost:5002/august/2";
        september = "http://localhost:5002/september/2";
        october = "http://localhost:5002/october/2";
        november = "http://localhost:5002/november/2";
        december = "http://localhost:5002/december/2"
        break;
      case "http://localhost:5002/daily/3":
        january = "http://localhost:5002/january/3";
        february = "http://localhost:5002/february/3";
        march = "http://localhost:5002/march/3"
        april = "http://localhost:5002/april/3";
        may = "http://localhost:5002/may/3";
        june = "http://localhost:5002/june/3";
        july = "http://localhost:5002/july/3";
        august = "http://localhost:5002/august/3";
        september = "http://localhost:5002/september/3";
        october = "http://localhost:5002/october/3";
        november = "http://localhost:5002/november/3";
        december = "http://localhost:5002/december/3"
        break;
      case "http://localhost:5002/daily/4":
        january = "http://localhost:5002/january/4";
        february = "http://localhost:5002/february/4";
        march = "http://localhost:5002/march/4"
        april = "http://localhost:5002/april/4";
        may = "http://localhost:5002/may/4";
        june = "http://localhost:5002/june/4";
        july = "http://localhost:5002/july/4";
        august = "http://localhost:5002/august/4";
        september = "http://localhost:5002/september/4";
        october = "http://localhost:5002/october/4";
        november = "http://localhost:5002/november/4";
        december = "http://localhost:5002/december/4"
        break;
      case "http://localhost:5002/daily/5":
        january = "http://localhost:5002/january/5";
        february = "http://localhost:5002/february/5";
        march = "http://localhost:5002/march/5"
        april = "http://localhost:5002/april/5";
        may = "http://localhost:5002/may/5";
        june = "http://localhost:5002/june/5";
        july = "http://localhost:5002/july/5";
        august = "http://localhost:5002/august/5";
        september = "http://localhost:5002/september/5";
        october = "http://localhost:5002/october/5";
        november = "http://localhost:5002/november/5";
        december = "http://localhost:5002/december/5"
        break;
      case "http://localhost:5002/daily/6":
        january = "http://localhost:5002/january/6";
        february = "http://localhost:5002/february/6";
        march = "http://localhost:5002/march/6"
        april = "http://localhost:5002/april/6";
        may = "http://localhost:5002/may/6";
        june = "http://localhost:5002/june/6";
        july = "http://localhost:5002/july/6";
        august = "http://localhost:5002/august/6";
        september = "http://localhost:5002/september/6";
        october = "http://localhost:5002/october/6";
        november = "http://localhost:5002/november/6";
        december = "http://localhost:5002/december/6"       
        break;
      case "http://localhost:5002/daily/7":
        january = "http://localhost:5002/january/7";
        february = "http://localhost:5002/february/7";
        march = "http://localhost:5002/march/7"
        april = "http://localhost:5002/april/7";
        may = "http://localhost:5002/may/7";
        june = "http://localhost:5002/june/7";
        july = "http://localhost:5002/july/7";
        august = "http://localhost:5002/august/7";
        september = "http://localhost:5002/september/7";
        october = "http://localhost:5002/october/7";
        november = "http://localhost:5002/november/7";
        december = "http://localhost:5002/december/7"     
        break;
      case "http://localhost:5002/daily/8":
        january = "http://localhost:5002/january/8";
        february = "http://localhost:5002/february/8";
        march = "http://localhost:5002/march/8"
        april = "http://localhost:5002/april/8";
        may = "http://localhost:5002/may/8";
        june = "http://localhost:5002/june/8";
        july = "http://localhost:5002/july/8";
        august = "http://localhost:5002/august/8";
        september = "http://localhost:5002/september/8";
        october = "http://localhost:5002/october/8";
        november = "http://localhost:5002/november/8";
        december = "http://localhost:5002/december/8"
        break;
      case "http://localhost:5002/daily/9":
        january = "http://localhost:5002/january/9";
        february = "http://localhost:5002/february/9";
        march = "http://localhost:5002/march/9"
        april = "http://localhost:5002/april/9";
        may = "http://localhost:5002/may/9";
        june = "http://localhost:5002/june/9";
        july = "http://localhost:5002/july/9";
        august = "http://localhost:5002/august/9";
        september = "http://localhost:5002/september/9";
        october = "http://localhost:5002/october/9";
        november = "http://localhost:5002/november/9";
        december = "http://localhost:5002/december/9"        
        break;
      case "http://localhost:5002/daily/10":
        january = "http://localhost:5002/january/10";
        february = "http://localhost:5002/february/10";
        march = "http://localhost:5002/march/10"
        april = "http://localhost:5002/april/10";
        may = "http://localhost:5002/may/10";
        june = "http://localhost:5002/june/10";
        july = "http://localhost:5002/july/10";
        august = "http://localhost:5002/august/10";
        september = "http://localhost:5002/september/10";
        october = "http://localhost:5002/october/10";
        november = "http://localhost:5002/november/10";
        december = "http://localhost:5002/december/10"
        break;
      case "http://localhost:5002/daily/11":
        january = "http://localhost:5002/january/11";
        february = "http://localhost:5002/february/11";
        march = "http://localhost:5002/march/11"
        april = "http://localhost:5002/april/11";
        may = "http://localhost:5002/may/11";
        june = "http://localhost:5002/june/11";
        july = "http://localhost:5002/july/11";
        august = "http://localhost:5002/august/11";
        september = "http://localhost:5002/september/11";
        october = "http://localhost:5002/october/11";
        november = "http://localhost:5002/november/11";
        december = "http://localhost:5002/december/11"
        break;
      case "http://localhost:5002/daily/12":
        january = "http://localhost:5002/january/12";
        february = "http://localhost:5002/february/12";
        march = "http://localhost:5002/march/12"
        april = "http://localhost:5002/april/12";
        may = "http://localhost:5002/may/12";
        june = "http://localhost:5002/june/12";
        july = "http://localhost:5002/july/12";
        august = "http://localhost:5002/august/12";
        september = "http://localhost:5002/september/12";
        october = "http://localhost:5002/october/12";
        november = "http://localhost:5002/november/12";
        december = "http://localhost:5002/december/12"
        break;
      case "http://localhost:5002/daily/13":
        january = "http://localhost:5002/january/13";
        february = "http://localhost:5002/february/13";
        march = "http://localhost:5002/march/13"
        april = "http://localhost:5002/april/13";
        may = "http://localhost:5002/may/13";
        june = "http://localhost:5002/june/13";
        july = "http://localhost:5002/july/13";
        august = "http://localhost:5002/august/13";
        september = "http://localhost:5002/september/13";
        october = "http://localhost:5002/october/13";
        november = "http://localhost:5002/november/13";
        december = "http://localhost:5002/december/13"
        break;
      case "http://localhost:5002/daily/14":
        january = "http://localhost:5002/january/14";
        february = "http://localhost:5002/february/14";
        march = "http://localhost:5002/march/14"
        april = "http://localhost:5002/april/14";
        may = "http://localhost:5002/may/14";
        june = "http://localhost:5002/june/14";
        july = "http://localhost:5002/july/14";
        august = "http://localhost:5002/august/14";
        september = "http://localhost:5002/september/14";
        october = "http://localhost:5002/october/14";
        november = "http://localhost:5002/november/14";
        december = "http://localhost:5002/december/14"
        break;
      case "http://localhost:5002/daily/15":
        january = "http://localhost:5002/january/15";
        february = "http://localhost:5002/february/15";
        march = "http://localhost:5002/march/15"
        april = "http://localhost:5002/april/15";
        may = "http://localhost:5002/may/15";
        june = "http://localhost:5002/june/15";
        july = "http://localhost:5002/july/15";
        august = "http://localhost:5002/august/15";
        september = "http://localhost:5002/september/15";
        october = "http://localhost:5002/october/15";
        november = "http://localhost:5002/november/15";
        december = "http://localhost:5002/december/15"
        break;
      case "http://localhost:5002/daily/16":
        january = "http://localhost:5002/january/16";
        february = "http://localhost:5002/february/16";
        march = "http://localhost:5002/march/16"
        april = "http://localhost:5002/april/16";
        may = "http://localhost:5002/may/16";
        june = "http://localhost:5002/june/16";
        july = "http://localhost:5002/july/16";
        august = "http://localhost:5002/august/16";
        september = "http://localhost:5002/september/16";
        october = "http://localhost:5002/october/16";
        november = "http://localhost:5002/november/16";
        december = "http://localhost:5002/december/16"
        break;
        case "http://localhost:5002/daily/17":
          january = "http://localhost:5002/january/17";
          february = "http://localhost:5002/february/17";
          march = "http://localhost:5002/march/17"
          april = "http://localhost:5002/april/17";
          may = "http://localhost:5002/may/17";
          june = "http://localhost:5002/june/17";
          july = "http://localhost:5002/july/17";
          august = "http://localhost:5002/august/17";
          september = "http://localhost:5002/september/17";
          october = "http://localhost:5002/october/17";
          november = "http://localhost:5002/november/17";
          december = "http://localhost:5002/december/17"
          break;
          case "http://localhost:5002/daily/18":
            january = "http://localhost:5002/january/18";
            february = "http://localhost:5002/february/18";
            march = "http://localhost:5002/march/18"
            april = "http://localhost:5002/april/18";
            may = "http://localhost:5002/may/18";
            june = "http://localhost:5002/june/18";
            july = "http://localhost:5002/july/18";
            august = "http://localhost:5002/august/18";
            september = "http://localhost:5002/september/18";
            october = "http://localhost:5002/october/18";
            november = "http://localhost:5002/november/18";
            december = "http://localhost:5002/december/18"
            break;
      default:
        january = "0";
    }

    let offPeak, day, peak;
    
  return (
    <div className="containers">
      <div className="cards ceb" style={{textAlign:"left"}}>
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
                    <td>Reading</td>
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
                        <td className='mainReading'>Reading</td>
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
                        <td>Reading</td>
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
                        <td className='mainReading'>Reading</td>
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
  )
}

export default Daily