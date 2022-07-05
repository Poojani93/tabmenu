const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { response } = require("express");
const schedule = require("node-schedule");
const mqtt = require("mqtt");

const app = express();

app.use(cors());
app.use(bodyParser.json());

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "power",
});

function handleDisconnect() {
  // Recreate the connection, since
  // the old one cannot be reused.

  db.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } else {
      console.log("mysql connected");
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  db.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();

let powerAll;
let date = new Date()

//create database
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE power";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database created...");
  });
});

//create section table
app.get("/sectiontable", (req, res) => {
  let sql =
    "CREATE TABLE section(id int AUTO_INCREMENT, mqtt_variable, VARCHAR(255), name VARCHAR(255), main_reading VARCHAR(255), gen_reading VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Machine created..");
  });
});

//retrive section records
app.get("/section", (request, response) => {
  let query = db.query(`SELECT * FROM section`, (error, result) => {
    if (error) throw error;
    console.log(result);
    response.send(result);
  });
});

//create daily_energy table
app.get("/daily", (req, res) => {
  let sql =
    "CREATE TABLE daily_energy (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), main_reading1 VARCHAR(255), main_reading2 VARCHAR(255), gen_reading1 VARCHAR(255), gen_reading2 VARCHAR(255), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Machine created..");
  });
});

//retrive daily records by id
app.get("/daily/:id", (req, res) => {
  let sql = `SELECT main_reading1, main_reading2, day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM daily_energy WHERE id = ${req.params.id}`;
  console.log(req.params);
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

//create WEB4 machine table
app.get("/WEB4", (req, res) => {
  let sql =
    "CREATE TABLE WEB4 (id int AUTO_INCREMENT, day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Machine created..");
  });
});

//create January table
app.get("/january", (req, res) => {
    let sql =
      "CREATE TABLE january (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive january records by id
app.get("/january/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM january WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

  //create February table
app.get("/february", (req, res) => {
    let sql =
      "CREATE TABLE february (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive february records by id
app.get("/february/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM february WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });
  
    //create March table
app.get("/march", (req, res) => {
    let sql =
      "CREATE TABLE march (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive March records by id
app.get("/march/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM march WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

    //create April table
app.get("/april", (req, res) => {
    let sql =
      "CREATE TABLE april (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive April records by id
app.get("/april/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM april WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

    //create May table
app.get("/may", (req, res) => {
    let sql =
      "CREATE TABLE may (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive May records by id
app.get("/may/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM may WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

    //create June table
app.get("/june", (req, res) => {
    let sql =
      "CREATE TABLE june (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive June records by id
app.get("/june/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM june WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

    //create July table
app.get("/july", (req, res) => {
    let sql =
      "CREATE TABLE july (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive July records by id
app.get("/july/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM july WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

    //create August table
app.get("/august", (req, res) => {
    let sql =
      "CREATE TABLE august (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive August records by id
app.get("/august/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM august WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

    //create September table
app.get("/september", (req, res) => {
    let sql =
      "CREATE TABLE september (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive September records by id
app.get("/september/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM september WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

    //create October table
app.get("/october", (req, res) => {
    let sql =
      "CREATE TABLE october (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive October records by id
app.get("/october/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM october WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

    //create November table
app.get("/november", (req, res) => {
    let sql =
      "CREATE TABLE november (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive November records by id
app.get("/november/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM november WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

    //create December table
app.get("/december", (req, res) => {
    let sql =
      "CREATE TABLE december (id int AUTO_INCREMENT, section_id int, FOREIGN KEY(section_id) REFERENCES section(id), day_main VARCHAR(255), peak_main VARCHAR(255), offPeak_main VARCHAR(255), day_gen VARCHAR(255), peak_gen VARCHAR(255), offPeak_gen VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Machine created..");
    });
  });

  //retrive December records by id
app.get("/december/:id", (req, res) => {
    let sql = `SELECT day_main, offPeak_main, peak_main, day_gen, offPeak_gen, peak_gen FROM december WHERE id = ${req.params.id}`;
    console.log(req.params);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  });

//mqtt connection
var client = mqtt.connect("ws://10.50.8.2:8083/mqtt");

client.on("connect", function () {
  client.subscribe("data/power/powerdash/9999");
  client.subscribe("data/web4/web4power/0404");
  console.log("Client has subscribed");
});

client.on("message", function (topic, message) {
  powerAll = JSON.parse(message.toString());
  // console.log(message);

  //update daily_energy table
  schedule.scheduleJob("00/10 * * * * *", () => {
    db.connect(function (err) {
      if (err) {
        throw err;
      } else {
        let sql1 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading1}", gen_reading1 = "${powerAll.powerReading1}" WHERE id = '1'`;
        //   let sql2 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading2}", gen_reading1 = "${powerAll.powerReading2}" WHERE id = '2'`;
        let sql3 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading3}", gen_reading1 = "${powerAll.powerReading3}" WHERE id = '3'`;
        let sql4 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading4}", gen_reading1 = "${powerAll.powerReading4}" WHERE id = '4'`;
        let sql5 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading5}", gen_reading1 = "${powerAll.powerReading5}" WHERE id = '5'`;
        let sql6 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading6}", gen_reading1 = "${powerAll.powerReading6}" WHERE id = '6'`;
        let sql7 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading7}", gen_reading1 = "${powerAll.powerReading7}" WHERE id = '7'`;
        let sql8 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading8}", gen_reading1 = "${powerAll.powerReading8}" WHERE id = '8'`;
        //   let sql9 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading9}", gen_reading1 = "${powerAll.powerReading9}" WHERE id = '9'`;
        let sql10 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading10}", gen_reading1 = "${powerAll.powerReading10}" WHERE id = '10'`;
        let sql11 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading11}", gen_reading1 = "${powerAll.powerReading11}" WHERE id = '11'`;
        let sql12 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading12}", gen_reading1 = "${powerAll.powerReading12}" WHERE id = '12'`;
        let sql13 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading13}", gen_reading1 = "${powerAll.powerReading13}" WHERE id = '13'`;
        let sql14 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading14}", gen_reading1 = "${powerAll.powerReading14}" WHERE id = '14'`;
        let sql15 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading15}", gen_reading1 = "${powerAll.powerReading15}" WHERE id = '15'`;
        let sql16 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading16}", gen_reading1 = "${powerAll.powerReading16}" WHERE id = '16'`;
        let sql17 = `UPDATE daily_energy SET main_reading1 = "${powerAll.powerReading17}", gen_reading1 = "${powerAll.powerReading17}" WHERE id = '17'`;
        let sql18 = `UPDATE daily_energy SET main_reading1 = "${powerAll.mainPowerReading}", gen_reading1 = "${powerAll.genPowerReading}" WHERE id = '18'`;

        db.query(sql1, function (err, result) {
          if (err) throw err;
        //   console.log(result.affectedRows + " record(s) updated");
        });
        // db.query(sql2, function (err, result) {
        //   if (err) throw err;
        //   console.log(result.affectedRows + " record(s) updated");
        // }
        // );
        db.query(sql3, function (err, result) {
          if (err) throw err;
        //   console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql4, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql5, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql6, function (err, result) {
          if (err) throw err;
        //   console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql7, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql8, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        // db.query(sql9, function (err, result) {
        //     if (err) throw err;
        //     // console.log(result.affectedRows + " record(s) updated");
        //   }
        // );
        db.query(sql10, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql11, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql12, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql13, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql14, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql15, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql16, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql17, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql18, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
      }
    });
  });

  //update daily_energy table
  schedule.scheduleJob("5/10 * * * * *", () => {
    db.connect(function (err) {
      if (err) {
        throw err;
      } else {
        let sql1 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading1}", gen_reading2 = "${powerAll.powerReading1}" WHERE id = '1'`;
        //   let sql2 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading2}", gen_reading2 = "${powerAll.powerReading2}" WHERE id = '2'`;
        let sql3 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading3}", gen_reading2 = "${powerAll.powerReading3}" WHERE id = '3'`;
        let sql4 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading4}", gen_reading2 = "${powerAll.powerReading4}" WHERE id = '4'`;
        let sql5 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading5}", gen_reading2 = "${powerAll.powerReading5}" WHERE id = '5'`;
        let sql6 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading6}", gen_reading2 = "${powerAll.powerReading6}" WHERE id = '6'`;
        let sql7 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading7}", gen_reading2 = "${powerAll.powerReading7}" WHERE id = '7'`;
        let sql8 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading8}", gen_reading2 = "${powerAll.powerReading8}" WHERE id = '8'`;
        //   let sql9 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading9}", gen_reading2 = "${powerAll.powerReading9}" WHERE id = '9'`;
        let sql10 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading10}", gen_reading2 = "${powerAll.powerReading10}" WHERE id = '10'`;
        let sql11 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading11}", gen_reading2 = "${powerAll.powerReading11}" WHERE id = '11'`;
        let sql12 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading12}", gen_reading2 = "${powerAll.powerReading12}" WHERE id = '12'`;
        let sql13 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading13}", gen_reading2 = "${powerAll.powerReading13}" WHERE id = '13'`;
        let sql14 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading14}", gen_reading2 = "${powerAll.powerReading14}" WHERE id = '14'`;
        let sql15 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading15}", gen_reading2 = "${powerAll.powerReading15}" WHERE id = '15'`;
        let sql16 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading16}", gen_reading2 = "${powerAll.powerReading16}" WHERE id = '16'`;
        let sql17 = `UPDATE daily_energy SET main_reading2 = "${powerAll.powerReading17}", gen_reading2 = "${powerAll.powerReading17}" WHERE id = '17'`;
        let sql18 = `UPDATE daily_energy SET main_reading2 = "${powerAll.mainPowerReading}", gen_reading2 = "${powerAll.powerReading1}" WHERE id = '18'`;

        db.query(sql1, function (err, result) {
          if (err) throw err;
        //   console.log(result.affectedRows + " record(s) updated");
        });
        // db.query(sql2, function (err, result) {
        //   if (err) throw err;
        //   console.log(result.affectedRows + " record(s) updated");
        // }
        // );
        db.query(sql3, function (err, result) {
          if (err) throw err;
        //   console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql4, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql5, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql6, function (err, result) {
          if (err) throw err;
        //   console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql7, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql8, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        // db.query(sql9, function (err, result) {
        //     if (err) throw err;
        //     // console.log(result.affectedRows + " record(s) updated");
        //   }
        // );
        db.query(sql10, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql11, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql12, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql13, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql14, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql15, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql16, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql17, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
        db.query(sql18, function (err, result) {
          if (err) throw err;
          // console.log(result.affectedRows + " record(s) updated");
        });
      }
    });
  });

  //update off peak reading
  schedule.scheduleJob("59 00 13 * * *", () => {
    db.connect(function (err) {
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
  });

  //update day reading
  schedule.scheduleJob("59 59 17 * * *", () => {
    db.connect(function (err) {
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
  });

  //update peak reading
  schedule.scheduleJob("59 29 22 * * *", () => {
    db.connect(function (err) {
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
  });

});

//update January reading
if(date.getMonth() == 0){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE january AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"

          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
            console.log(result)
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the february power reading
if(date.getMonth() == 1){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE february AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"

          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the march power reading
if(date.getMonth() == 2){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE march AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the april power reading
if(date.getMonth() == 3){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE april AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the may power reading
if(date.getMonth() == 4){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE may AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the june power reading
if(date.getMonth() == 5){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE june AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the july power reading
if(date.getMonth() == 6){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE july AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
            console.log(result)
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the august power reading
if(date.getMonth() == 7){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE august AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the september power reading
if(date.getMonth() == 8){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE september AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the october power reading
if(date.getMonth() == 9){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE october AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the november power reading
if(date.getMonth() == 10){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE november AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}

//update end of the december power reading
if(date.getMonth() == 11){
    schedule.scheduleJob("59 59 23 * * *", () => {
        db.connect(function (err) {
          if (err) throw err;
          let sql1 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=1"
          let sql2 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=2"
          let sql3 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=3"
          let sql4 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=4"
          let sql5 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=5"
          let sql6 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=6"
          let sql7 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=7"
          let sql8 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=8"
          let sql9 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=9"
          let sql10 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=10"
          let sql11 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=11"
          let sql12 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=12"
          let sql13 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=13"
          let sql14 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=14"
          let sql15 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=15"
          let sql16 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=16"
          let sql17 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=17"
          let sql18 = "UPDATE december AS t, (SELECT offPeak_main, day_main, peak_main, offPeak_gen, day_gen, peak_gen FROM daily_energy) AS t1 SET t.offPeak_main = t1.offPeak_main AND t.day_main = t1.day_main AND t.peak_main=t1.peak_main AND t.offPeak_gen=t1.offPeak_gen AND t.day_gen=t1.day_gen AND t.peak_gen=t1.peak_gen WHERE t.id=18"
      
          db.query(sql1, function (err, result) {
            if (err) throw err;
          });
          db.query(sql2, function (err, result) {
            if (err) throw err;
          });
          db.query(sql3, function (err, result) {
            if (err) throw err;
          });
          db.query(sql4, function (err, result) {
            if (err) throw err;
          });
          db.query(sql5, function (err, result) {
            if (err) throw err;
          });
          db.query(sql6, function (err, result) {
            if (err) throw err;
          });
          db.query(sql7, function (err, result) {
            if (err) throw err;
          });
          db.query(sql8, function (err, result) {
            if (err) throw err;
          });
          db.query(sql9, function (err, result) {
            if (err) throw err;
          });
          db.query(sql10, function (err, result) {
            if (err) throw err;
          });
          db.query(sql11, function (err, result) {
            if (err) throw err;
          });
          db.query(sql12, function (err, result) {
            if (err) throw err;
          });
          db.query(sql13, function (err, result) {
            if (err) throw err;
          });
          db.query(sql14, function (err, result) {
            if (err) throw err;
          });
          db.query(sql15, function (err, result) {
            if (err) throw err;
          });
          db.query(sql16, function (err, result) {
            if (err) throw err;
          });
          db.query(sql17, function (err, result) {
            if (err) throw err;
          });
          db.query(sql18, function (err, result) {
            if (err) throw err;
          });
        });
      });
}
//assigns port 5002 for node server
const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`server running port ${port}`);
});

module.exports = db;
