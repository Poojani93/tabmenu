const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { response } = require('express');
const schedule = require('node-schedule');
const mqtt = require('mqtt')

// const { createConnection } = require('mysql2/promise');
// const plantrouter = require('./routes/plant')

const app = express();

app.use(cors());
app.use(bodyParser.json());

//create mysql connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '1234',
//     database: 'power'
// });

// db.connect((err) => {
//     if(err){
//         throw err;
//     }
//     console.log('mysql connected');
// });

var db = mysql.createConnection ({
    host: 'localhost',
      user: 'root',
      password: '12345',
      database: 'power'
  });
  
  function handleDisconnect() { // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    db.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }else{
          console.log('mysql connected')
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    db.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
  handleDisconnect();

let powerAll, powerBm1, powerBm2, powerWeb1, powerWeb2, powerWeb4, powerUv1, powerUv2, powerFolding1, powerFolding2, powerFolding3, powerFolding4, powerFolding5, powerFolding6, powerFolding7, powerFolding8, powerSb1, powerSb2, powerPb1, powerPb2, powerAutosewing1, powerSpeedMaster3, powerSpeedMaster4, powerPolarCutter, powerThreeKnife, powerShrinkPacking, powerCt, powerMsq30b, powerMsqb, powerMsq40, powerMsq30s;

//create database
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE power';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Database created...');
    });
});

//create branch table
app.get('/branchtable', (req, res) => {
    let sql = 'CREATE TABLE branch(id int AUTO_INCREMENT, name VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('braanch created...');
    });
})

//create plant table
app.get('/planttable', (req, res) => {
    let sql = 'CREATE TABLE plant(id int AUTO_INCREMENT, name VARCHAR(255), sectionId VARCHAR(255), PRIMARY KEY(id), FOREIGN KEY(id) REFERENCES section(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Plant created...');
    });
})

//create machine table
app.get('/machinetable', (req, res) => {
    let sql = 'CREATE TABLE machine(id int AUTO_INCREMENT, topic VARCHAR(255), name VARCHAR(255), plantId VARCHAR(255), sectionId VARCHAR(255), PRIMARY KEY(id), FOREIGN KEY(id) REFERENCES plant(id), FOREIGN KEY(id) REFERENCES section(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive machine records by id
app.get('/machine/:id', (req, res) => {
    let sql = `SELECT name FROM machine WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section table
app.get('/sectiontable', (req, res) => {
    let sql = 'CREATE TABLE section(id int AUTO_INCREMENT, mqtt_variable, VARCHAR(255), name VARCHAR(255), main_reading VARCHAR(255), gen_reading VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section records
app.get('/section', (request, response) => {
    let query = db.query(`SELECT * FROM section`, (error, result) => {
        if (error) throw error; 
        console.log(result)
        response.send(result);
    });
});

//create daily_energy table
app.get('/daily', (req, res) => {
    let sql = 'CREATE TABLE daily_energy (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive daily records by id
app.get('/daily/:id', (req, res) => {
    let sql = `SELECT main_reading1, main_reading2, day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM daily_energy WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create monthly_energy table
app.get('/monthly', (req, res) => {
    let sql = 'CREATE TABLE monthly_energy (id int AUTO_INCREMENT, time TIMESTAMP, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive monthly records by id
app.get('/monthly/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM monthly_energy WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create department table
app.get('/department', (req, res) => {
    let sql = 'CREATE TABLE department(id int AUTO_INCREMENT, topic VARCHAR(255), name VARCHAR(255), sectionId VARCHAR(255), PRIMARY KEY(id), FOREIGN KEY(id) REFERENCES section(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive department records by id
app.get('/department/:id', (req, res) => {
    let sql = `SELECT name FROM department WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section1 table
app.get('/section1', (req, res) => {
    let sql = 'CREATE TABLE section1 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section1 records by id
app.get('/section1/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section1 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section2 table
app.get('/section2', (req, res) => {
    let sql = 'CREATE TABLE section2 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section2 records by id
app.get('/section2/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section2 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section3 table
app.get('/section3', (req, res) => {
    let sql = 'CREATE TABLE section3 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section3 records by id
app.get('/section3/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section3 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section4 table
app.get('/section4', (req, res) => {
    let sql = 'CREATE TABLE section4 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section4 records by id
app.get('/section4/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section4 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section5 table
app.get('/section5', (req, res) => {
    let sql = 'CREATE TABLE section5 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section5 records by id
app.get('/section5/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section5 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section6 table
app.get('/section6', (req, res) => {
    let sql = 'CREATE TABLE section6 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section6 records by id
app.get('/section6/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section6 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section7 table
app.get('/section7', (req, res) => {
    let sql = 'CREATE TABLE section7 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section7 records by id
app.get('/section7/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section7 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section8 table
app.get('/section8', (req, res) => {
    let sql = 'CREATE TABLE section8 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section8 records by id
app.get('/section8/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section8 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section9 table
app.get('/section9', (req, res) => {
    let sql = 'CREATE TABLE section9 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section9 records by id
app.get('/section9/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section9 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section10 table
app.get('/section10', (req, res) => {
    let sql = 'CREATE TABLE section10 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section10 records by id
app.get('/section10/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section10 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section11 table
app.get('/section11', (req, res) => {
    let sql = 'CREATE TABLE section11 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section11 records by id
app.get('/section11/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section11 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section12 table
app.get('/section12', (req, res) => {
    let sql = 'CREATE TABLE section12 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section12 records by id
app.get('/section12/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section12 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section13 table
app.get('/section13', (req, res) => {
    let sql = 'CREATE TABLE section13 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section13 records by id
app.get('/section13/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section13 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section14 table
app.get('/section14', (req, res) => {
    let sql = 'CREATE TABLE section14 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section14 records by id
app.get('/section14/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section14 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section15 table
app.get('/section15', (req, res) => {
    let sql = 'CREATE TABLE section15 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section15 records by id
app.get('/section15/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section15 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section16 table
app.get('/section16', (req, res) => {
    let sql = 'CREATE TABLE section16 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section16 records by id
app.get('/section16/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section16 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create section17 table
app.get('/section17', (req, res) => {
    let sql = 'CREATE TABLE section17 (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive section17 records by id
app.get('/section17/:id', (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM section17 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create BM1 machine table
app.get('/BM1', (req, res) => {
    let sql = 'CREATE TABLE BM1 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive bm1 machine records by id
app.get('/bm1/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM bm1 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create BM2 machine table
app.get('/BM2', (req, res) => {
    let sql = 'CREATE TABLE BM2 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive bm2 machine records by id
app.get('/bm2/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM bm2 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create WEB1 machine table
app.get('/WEB1', (req, res) => {
    let sql = 'CREATE TABLE WEB1 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive web1 machine records by id
app.get('/web1/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM web1 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create WEB2 machine table
app.get('/WEB2', (req, res) => {
    let sql = 'CREATE TABLE WEB2 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive web2 machine records by id
app.get('/web2/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM web2 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create WEB3 machine table
app.get('/WEB3', (req, res) => {
    let sql = 'CREATE TABLE WEB3 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive web3 machine records by id
app.get('/web3/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM web3 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create WEB4 machine table
app.get('/WEB4', (req, res) => {
    let sql = 'CREATE TABLE WEB4 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive web4 machine records by id
app.get('/web4/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM web4 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create UV1 machine table
app.get('/UV1', (req, res) => {
    let sql = 'CREATE TABLE UV1 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive uv1 machine records by id
app.get('/uv1/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM uv1 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create UV2 machine table
app.get('/UV2', (req, res) => {
    let sql = 'CREATE TABLE UV2 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive uv2 machine records by id
app.get('/uv2/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM uv2 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Folding1 machine table
app.get('/folding1', (req, res) => {
    let sql = 'CREATE TABLE Folding1 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive Folding1 machine records by id
app.get('/folding1/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM folding1 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Folding2 machine table
app.get('/folding2', (req, res) => {
    let sql = 'CREATE TABLE Folding2 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive Folding2 machine records by id
app.get('/folding2/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM folding2 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Folding3 machine table
app.get('/folding3', (req, res) => {
    let sql = 'CREATE TABLE Folding3 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive Folding3 machine records by id
app.get('/folding3/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM folding3 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Folding4 machine table
app.get('/folding4', (req, res) => {
    let sql = 'CREATE TABLE Folding4 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive Folding14achine records by id
app.get('/folding4/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM folding4 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Folding5 machine table
app.get('/folding5', (req, res) => {
    let sql = 'CREATE TABLE Folding5 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive Folding5 machine records by id
app.get('/folding5/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM folding5 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Folding6 machine table
app.get('/folding6', (req, res) => {
    let sql = 'CREATE TABLE Folding6 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive Folding6 machine records by id
app.get('/folding6/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM folding6 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Folding7 machine table
app.get('/folding7', (req, res) => {
    let sql = 'CREATE TABLE Folding7 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive Folding7 machine records by id
app.get('/folding7/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM folding7 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Folding8 machine table
app.get('/folding8', (req, res) => {
    let sql = 'CREATE TABLE Folding8 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive Folding8 machine records by id
app.get('/folding8/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM folding8 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create SB1 machine table
app.get('/SB1', (req, res) => {
    let sql = 'CREATE TABLE SB1 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive sb1 machine records by id
app.get('/sb1/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM sb1 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create SB2 machine table
app.get('/SB2', (req, res) => {
    let sql = 'CREATE TABLE SB2 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive sb2 machine records by id
app.get('/sb2/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM sb2 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create PB1 machine table
app.get('/PB1', (req, res) => {
    let sql = 'CREATE TABLE PB1 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive pb1 machine records by id
app.get('/pb1/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM pb1 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create PB2 machine table
app.get('/PB2', (req, res) => {
    let sql = 'CREATE TABLE PB2 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive pb2 machine records by id
app.get('/pb2/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM pb2 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Auto Sawing1 machine table
app.get('/autoSawing1', (req, res) => {
    let sql = 'CREATE TABLE Auto_Sawing1 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive auto sewing1 machine records by id
app.get('/autoSawing1/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM auto_sewing1 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Speed Master3 machine table
app.get('/speedMaster3', (req, res) => {
    let sql = 'CREATE TABLE Speed_Master3 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive speed master3 machine records by id
app.get('/speedMaster3/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM speed_master3 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Speed Master4 machine table
app.get('/speedMaster4', (req, res) => {
    let sql = 'CREATE TABLE Speed_Master4 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive speed master4 machine records by id
app.get('/speedMaster4/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM speed_master4 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Polar Cutter machine table
app.get('/polarCutter', (req, res) => {
    let sql = 'CREATE TABLE Polar_Cutter (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive polar cutter machine records by id
app.get('/polarCutter/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM polar_cutter WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Three Knife machine table
app.get('/threeKnife', (req, res) => {
    let sql = 'CREATE TABLE Three_Knife (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive three knife machine records by id
app.get('/threeKnife/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM three_knife WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create Shrink Packing machine table
app.get('/shrinkPacking', (req, res) => {
    let sql = 'CREATE TABLE Shrink_Packing (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive shrink packing knife machine records by id
app.get('/shrinkPacking/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM shrink_packing WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create CT machine table
app.get('/CT', (req, res) => {
    let sql = 'CREATE TABLE CT (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive ct knife machine records by id
app.get('/ct/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM ct WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create MSQ-30B machine table
app.get('/MSQ-30B', (req, res) => {
    let sql = 'CREATE TABLE MSQ_30B (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive msq-30b machine records by id
app.get('/msq-30b/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM msq_30b WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create MSQ-B machine table
app.get('/MSQ-B', (req, res) => {
    let sql = 'CREATE TABLE MSQ_B (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive msq-b machine records by id
app.get('/msq-b/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM msq_b WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create MSQ-40 machine table
app.get('/MSQ-40', (req, res) => {
    let sql = 'CREATE TABLE MSQ_40 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive msq-40 machine records by id
app.get('/msq-40/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM msq_40 WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//create MSQ-30S machine table
app.get('/MSQ-30S', (req, res) => {
    let sql = 'CREATE TABLE MSQ_30S (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
            console.log(result);
            res.send('Machine created..');
    });
})

//retrive msq-30s machine records by id
app.get('/msq-30s/:id', (req, res) => {
    let sql = `SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM msq_30s WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
        if(err) throw err;
            console.log(results);
            res.send(results);
    });
})

//node schedule example
schedule.scheduleJob('00 14 12 28 12 *', () => {
        let sql = 'INSERT INTO energy_monthly(name, tariff1gen, tariff2gen, tariff3gen, tariff1main, tariff2main,  tariff3main) SELECT name, tariff1gen, tariff2gen, tariff3gen, tariff1main, tariff2main,  tariff3main  from energy_daily';
        let query = db.query(sql, (err, result) => {
            if(err) throw err;
                console.log(result);
        })
})

//mqtt connection
var client = mqtt.connect('ws://192.168.8.110:8083/mqtt');

client.on('connect', function() {
    client.subscribe("data/power/powerdash/9999");
    client.subscribe("data/web4/web4power/0404");
    console.log("Client has subscribed")
});

client.on('message', function(topic, message){
    powerAll = JSON.parse(message.toString());
    // console.log(message);

    //update daily_energy table
    schedule.scheduleJob('00/10 * * * * *', () => {
            db.connect(function(err) {
                if (err) {throw err}else{

                //   let sql1 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading1}", gen_reading1 = "${powerAll.powerReading1}" WHERE id = '1'`;
                //   let sql2 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading2}", gen_reading1 = "${powerAll.powerReading2}" WHERE id = '2'`;
                  let sql3 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading3}", gen_reading1 = "${powerAll.powerReading3}" WHERE id = '3'`;
                  let sql4 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading4}", gen_reading1 = "${powerAll.powerReading4}" WHERE id = '4'`;
                  let sql5 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading5}", gen_reading1 = "${powerAll.powerReading5}" WHERE id = '5'`;
                //   let sql6 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading6}", gen_reading1 = "${powerAll.powerReading6}" WHERE id = '6'`;
                  let sql7 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading7}", gen_reading1 = "${powerAll.powerReading7}" WHERE id = '7'`;
                  let sql8 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading8}", gen_reading1 = "${powerAll.powerReading8}" WHERE id = '8'`;
                  let sql9 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading9}", gen_reading1 = "${powerAll.powerReading9}" WHERE id = '9'`;
                  let sql10 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading10}", gen_reading1 = "${powerAll.powerReading10}" WHERE id = '10'`;
                  let sql11 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading11}", gen_reading1 = "${powerAll.powerReading11}" WHERE id = '11'`;
                  let sql12 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading12}", gen_reading1 = "${powerAll.powerReading12}" WHERE id = '12'`;
                  let sql13 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading13}", gen_reading1 = "${powerAll.powerReading13}" WHERE id = '13'`;
                  let sql14 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading14}", gen_reading1 = "${powerAll.powerReading14}" WHERE id = '14'`;
                  let sql15 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading15}", gen_reading1 = "${powerAll.powerReading15}" WHERE id = '15'`;
                  let sql16 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading16}", gen_reading1 = "${powerAll.powerReading16}" WHERE id = '16'`;
                  let sql17 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading17}", gen_reading1 = "${powerAll.powerReading17}" WHERE id = '17'`;
                  let sql18 = `UPDATE daily_energy SET main_reading1 = "${powerAll.mainPowerReading}", gen_reading1 = "${powerAll.genPowerReading}" WHERE id = '18'`;

                // db.query(sql1, function (err, result) {
                //     if (err) throw err;
                //     console.log(result.affectedRows + " record(s) updated");
                //   }                
                // );
                // db.query(sql2, function (err, result) {
                //   if (err) throw err;
                //   console.log(result.affectedRows + " record(s) updated");
                // }                
                // );
                // db.query(sql3, function (err, result) {
                //     if (err) throw err;
                //     console.log(result.affectedRows + " record(s) updated");
                //   }                
                // );
                db.query(sql4, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                  
                );
                db.query(sql5, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                // db.query(sql6, function (err, result) {
                //     if (err) throw err;
                //     console.log(result.affectedRows + " record(s) updated");
                //   }                
                //   );
                db.query(sql7, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql8, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql9, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql10, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql11, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql12, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql13, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql14, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql15, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql16, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql17, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql18, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
        }});
    })

    //update daily_energy table
    schedule.scheduleJob('5/10 * * * * *', () => {
            db.connect(function(err) {
                if (err) {throw err}else{

                //   let sql1 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading1}", gen_reading2 = "${powerAll.powerReading1}" WHERE id = '1'`;
                //   let sql2 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading2}", gen_reading2 = "${powerAll.powerReading2}" WHERE id = '2'`;
                  let sql3 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading3}", gen_reading2 = "${powerAll.powerReading3}" WHERE id = '3'`;
                  let sql4 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading4}", gen_reading2 = "${powerAll.powerReading4}" WHERE id = '4'`;
                  let sql5 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading5}", gen_reading2 = "${powerAll.powerReading5}" WHERE id = '5'`;
                //   let sql6 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading6}", gen_reading2 = "${powerAll.powerReading6}" WHERE id = '6'`;
                  let sql7 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading7}", gen_reading2 = "${powerAll.powerReading7}" WHERE id = '7'`;
                  let sql8 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading8}", gen_reading2 = "${powerAll.powerReading8}" WHERE id = '8'`;
                  let sql9 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading9}", gen_reading2 = "${powerAll.powerReading9}" WHERE id = '9'`;
                  let sql10 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading10}", gen_reading2 = "${powerAll.powerReading10}" WHERE id = '10'`;
                  let sql11 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading11}", gen_reading2 = "${powerAll.powerReading11}" WHERE id = '11'`;
                  let sql12 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading12}", gen_reading2 = "${powerAll.powerReading12}" WHERE id = '12'`;
                  let sql13 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading13}", gen_reading2 = "${powerAll.powerReading13}" WHERE id = '13'`;
                  let sql14 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading14}", gen_reading2 = "${powerAll.powerReading14}" WHERE id = '14'`;
                  let sql15 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading15}", gen_reading2 = "${powerAll.powerReading15}" WHERE id = '15'`;
                  let sql16 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading16}", gen_reading2 = "${powerAll.powerReading16}" WHERE id = '16'`;
                  let sql17 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading17}", gen_reading2 = "${powerAll.powerReading17}" WHERE id = '17'`;
                  let sql18 = `UPDATE daily_energy SET main_reading2 = "${powerAll.mainPowerReading}", gen_reading2 = "${powerAll.powerReading1}" WHERE id = '18'`;

                // db.query(sql1, function (err, result) {
                //     if (err) throw err;
                //     console.log(result.affectedRows + " record(s) updated");
                //   }                
                // );
                // db.query(sql2, function (err, result) {
                //   if (err) throw err;
                //   console.log(result.affectedRows + " record(s) updated");
                // }                
                // );
                // db.query(sql3, function (err, result) {
                //     if (err) throw err;
                //     console.log(result.affectedRows + " record(s) updated");
                //   }                
                // );
                db.query(sql4, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                  
                );
                db.query(sql5, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                // db.query(sql6, function (err, result) {
                //     if (err) throw err;
                //     console.log(result.affectedRows + " record(s) updated");
                //   }                
                //   );
                db.query(sql7, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql8, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql9, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql10, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql11, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql12, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql13, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql14, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql15, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql16, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql17, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql18, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
        }});
    })

    //update off peak reading
    schedule.scheduleJob('59 00 13 * * *', () => {
        db.connect(function(err) {
            if (err) throw err;
            let sql1 = `UPDATE daily_energy SET offPeak_main = main_reading2`;
            let sql2 = `UPDATE daily_energy SET offPeak_gen = gen_reading2`;
            db.query(sql1, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });
            db.query(sql2, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });
        });
    })

    //update day reading
    schedule.scheduleJob('59 59 17 * * *', () => {
        db.connect(function(err) {
            if (err) throw err;
            let sql1 = `UPDATE daily_energy SET offPeak_main = main_reading2`;
            let sql2 = `UPDATE daily_energy SET offPeak_gen = gen_reading2`;
            db.query(sql1, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });
            db.query(sql2, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });
          });
    })

    //update peak reading
    schedule.scheduleJob('59 29 22 * * *', () => {
        db.connect(function(err) {
            if (err) throw err;
            let sql1 = `UPDATE daily_energy SET offPeak_main = main_reading2`;
            let sql2 = `UPDATE daily_energy SET offPeak_gen = gen_reading2`;
            db.query(sql1, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });
            db.query(sql2, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });
        });
    })

    schedule.scheduleJob('59 59 23 * * *', () => {
        db.connect(function(err) {
            if (err) throw err;
                let sql1 = "INSERT INTO section1 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='1';";
                let sql2 = "INSERT INTO section2 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='2';";
                let sql3 = "INSERT INTO section3 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='3';";
                let sql4 = "INSERT INTO section4 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='4';";
                let sql5 = "INSERT INTO section5 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='5';";
                let sql6 = "INSERT INTO section6 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='6';";
                let sql7 = "INSERT INTO section7 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='7';";
                let sql8 = "INSERT INTO section8 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='8';";
                let sql9 = "INSERT INTO section9 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='9';";
                let sql10 = "INSERT INTO section10 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='10';";
                let sql11 = "INSERT INTO section11 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='11';";
                let sql12 = "INSERT INTO section12 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='12';";
                let sql13 = "INSERT INTO section13 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='13';";
                let sql14 = "INSERT INTO section14 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='14';";
                let sql15 = "INSERT INTO section15 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='15';";
                let sql16 = "INSERT INTO section16 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='16';";
                let sql17 = "INSERT INTO section1 (offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen) SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy WHERE id='17';";
               
                db.query(sql1, function (err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql2, function (err, result) {
                  if (err) throw err;
                  console.log(result.affectedRows + " record(s) updated");
                }                
                );
                db.query(sql3, function (err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql4, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                  
                );
                db.query(sql5, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql6, function (err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                  }                
                  );
                db.query(sql7, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql8, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql9, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql10, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql11, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql12, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql13, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql14, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql15, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql16, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql17, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
                db.query(sql18, function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                  }                
                );
        });
    })
})

//update end of the january power reading
schedule.scheduleJob('59 59 23 31 1 *', () => {
    db.connect(function(err) {
        if (err) throw err;
        let sql = `UPDATE power_all SET peak_main = ${powerAll.mainPowerReading} WHERE id = '1'`;
        sql = `UPDATE web4 SET peak_main = ${powerAll.mainPowerReading} WHERE id = '1'`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
        });
    });
})

//update end of the february power reading
schedule.scheduleJob('59 32 12 * * *', () => {
    let post = {
        peak_main: '143'
    };
    let sql = 'UPDATE power_all SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the march power reading
schedule.scheduleJob('59 59 23 31 03 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the april power reading
schedule.scheduleJob('59 59 23 30 04 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the may power reading
schedule.scheduleJob('59 59 23 31 05 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the june power reading
schedule.scheduleJob('59 59 23 30 06 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the july power reading
schedule.scheduleJob('59 59 23 31 07 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the august power reading
schedule.scheduleJob('59 59 23 31 08 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the september power reading
schedule.scheduleJob('59 59 23 30 09 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the october power reading
schedule.scheduleJob('59 59 23 31 10 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the november power reading
schedule.scheduleJob('59 59 23 30 11 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//update end of the december power reading
schedule.scheduleJob('59 59 23 31 12 *', () => {
    let post = {
        tariff2gen: power.mainPowerReading,
        tariff2main: '222'
    };
    let sql = 'UPDATE energy_daily SET ? WHERE id=1';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
            console.log(result);
            // res.send('Entry updated...');
    })
})

//assigns port 5002 for node server
const port =  process.env.PORT || 5002;

app.listen(port, () => {
    console.log(`server running port ${port}`);
})

module.exports = db;