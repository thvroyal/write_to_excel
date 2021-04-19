"use strict";
const Excel = require("exceljs");
const axios = require("axios");

//login admin
const accountAdmin = {
  email: "admin@gmail.com",
  password: "admin",
};
let token = null;
axios
  .post("http://202.191.56.104:5521/api/public/login", accountAdmin)
  .then((res) => {
    token = res.data.data;
    console.log("Logged in ");
  })
  .catch((err) => {
    console.log("Login Failed");
  });

function recordData(data) {
  let workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet("Debug Detector");
  worksheet.columns = [
    { header: "ID", key: "id" },
    { header: "Packet Number", key: "packetNumber" },
    { header: "ID Node", key: "idNode" },
    { header: "Battery Level", key: "batteryLevel" },
    { header: "Node Address", key: "nodeAddress" },
    { header: "State", key: "state" },
    { header: "Communication Level", key: "communicationLevel" },
    { header: "Time", key: "time" },
    { header: "Location", key: "location" },
  ];
  //format width of column
  worksheet.columns.forEach((column) => {
    column.width = column.header.length < 12 ? 12 : column.header.length;
  });
  //bold header
  worksheet.getRow(1).font = { bold: true };
  //record data
  if (data)
    data.forEach((e, index) => {
      const rowIndex = index + 2;
      worksheet.addRow({
        ...e,
      });
    });
  workbook.xlsx.writeFile("debug.xlsx");
  console.log("Saved file");
}

//header

//fetching data
setInterval(async function getData() {
  try {
    console.log("Getting data ...");
    const response = await axios({
      methods: "GET",
      url: "http://202.191.56.104:5521/api/ad/package/find_all",
      headers: {
        token: token,
      },
    });
    if (response.data.message === "success") {
      const timeNow = Date.now();
      const timeString = new Date(timeNow);
      console.log(timeString.toUTCString(), ": Received data");
      recordData(response.data.data);
    }
  } catch (error) {
    console.log("Get data failed", error);
  }
}, 10000);
