require('console-stamp')(console, '[HH:MM:ss.l]');
const axios = require('axios');
const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
const app = express();
const util = require('util')
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

// Environment variables
const token = process.env.callbacktoken;
const urlLog = 'https://api.airtable.com/v0/app5gmesqR3Z5JppN/Logs';

// Configure and Launch the Express Server
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.static('public')); // load files from public directory
app.listen(process.env.PORT || 3000, function() {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});

app.get("/", function(req, res) {
  res.sendFile('public/index.html');
});

app.post("/vendor-decision", function(req, res) {
  console.log('/vendor-decision was hit');
  let xml_string = parseFormData(req.body);
  processDecision(xml_string).then(
    function(result) {
      res.set('Content-Type', 'text/xml');
      res.send(result);
    },
    function(error) { console.log(error); }
  );
});

app.post("/comment", function(req, res) {
  console.log('/comment was hit');
  let xml_string = parseFormData(req.body);
  processComment(xml_string).then(
    function(result) {
      res.set('Content-Type', 'text/xml');
      res.send(result);
    },
    function(error) { console.log(error); }
  );
});

app.post("/funding", function(req, res) {
  console.log('/funding was hit');
  let xml_string = parseFormData(req.body);
  processFunding(xml_string).then(
    function(result) {
      res.set('Content-Type', 'text/xml');
      res.send(result);
    },
    function(error) { console.log(error); }
  );
});

async function processDecision(receivedData) {
  let xmlrequest = receivedData;
  let ids = new Map();

  // use xml2js to convert xml to js to parse/handle data
  parser.parseString(xmlrequest, function(error, result) {
    if (error === null) {
      ids.set("cuna_lender_id", result.vendor_decision.cuna_lender_id);
      ids.set("allegro_dealer_id", result.vendor_decision.allegro_dealer_id);
      ids.set("source_app_id", result.vendor_decision.source_app_id);
      ids.set("allegro_app_id", result.vendor_decision.allegro_app_id);
      ids.set("allegro_lender_app_id", result.vendor_decision.allegro_lender_app_id);
    }
    else {
      // to avoid infinite re-queue, we must always return an <ack> with ids
      console.log(error);
      ids.set("cuna_lender_id", 0);
      ids.set("allegro_dealer_id", 0);
      ids.set("source_app_id", 0);
      ids.set("allegro_app_id", 0);
      ids.set("allegro_lender_app_id", 0);
    }
  });

  var obj = {
    "ack": {
      "cuna_lender_id": ids.get("cuna_lender_id"),
      "allegro_dealer_id": ids.get("allegro_dealer_id"),
      "source_app_id": ids.get("source_app_id"),
      "allegro_app_id": ids.get("allegro_app_id"),
      "allegro_lender_app_id": ids.get("allegro_lender_app_id")
    }
  };
  var builder = new xml2js.Builder();
  // var builder = new xml2js.Builder({ headless: true }); 
  var xmlresponse = builder.buildObject(obj);

  airtableLog('vendor-decision', xmlrequest, xmlresponse);
  return xmlresponse;
}

async function processComment(receivedData) {
  let xmlrequest = receivedData;
  let ids = new Map();

  // use xml2js to convert xml to js to parse/handle data
  parser.parseString(xmlrequest, function(error, result) {
    if (error === null) {
      ids.set("cuna_lender_id", result.comments.cuna_lender_id);
      ids.set("allegro_dealer_id", result.comments.allegro_dealer_id);
      ids.set("source_app_id", result.comments.source_app_id);
      ids.set("allegro_app_id", result.comments.allegro_app_id);
      ids.set("allegro_lender_app_id", result.comments.allegro_lender_app_id);
    }
    else {
      // to avoid infinite re-queue, we must always return an <ack> with ids
      console.log(error);
      ids.set("cuna_lender_id", 0);
      ids.set("allegro_dealer_id", 0);
      ids.set("source_app_id", 0);
      ids.set("allegro_app_id", 0);
      ids.set("allegro_lender_app_id", 0);
    }
  });

  var obj = {
    "ack": {
      "cuna_lender_id": ids.get("cuna_lender_id"),
      "allegro_dealer_id": ids.get("allegro_dealer_id"),
      "source_app_id": ids.get("source_app_id"),
      "allegro_app_id": ids.get("allegro_app_id"),
      "allegro_lender_app_id": ids.get("allegro_lender_app_id")
    }
  };
  var builder = new xml2js.Builder();
  // var builder = new xml2js.Builder({ headless: true }); 
  var xmlresponse = builder.buildObject(obj);

  airtableLog('comment', xmlrequest, xmlresponse);
  return xmlresponse;
}

async function processFunding(receivedData) {
  let xmlrequest = receivedData;
  let ids = new Map();

  // use xml2js to convert xml to js to parse/handle data
  parser.parseString(xmlrequest, function(error, result) {
    if (error === null) {
      ids.set("cuna_lender_id", result.funding.cuna_lender_id);
      ids.set("allegro_dealer_id", result.funding.allegro_dealer_id);
      ids.set("source_app_id", result.funding.source_app_id);
      ids.set("allegro_app_id", result.funding.allegro_app_id);
      ids.set("allegro_lender_app_id", result.funding.allegro_lender_app_id);
    }
    else {
      // to avoid infinite re-queue, we must always return an <ack> with ids
      console.log(error);
      ids.set("cuna_lender_id", 0);
      ids.set("allegro_dealer_id", 0);
      ids.set("source_app_id", 0);
      ids.set("allegro_app_id", 0);
      ids.set("allegro_lender_app_id", 0);
    }
  });

  var obj = {
    "ack": {
      "cuna_lender_id": ids.get("cuna_lender_id"),
      "allegro_dealer_id": ids.get("allegro_dealer_id"),
      "source_app_id": ids.get("source_app_id"),
      "allegro_app_id": ids.get("allegro_app_id"),
      "allegro_lender_app_id": ids.get("allegro_lender_app_id")
    }
  };
  var builder = new xml2js.Builder();
  // var builder = new xml2js.Builder({ headless: true }); 
  var xmlresponse = builder.buildObject(obj);

  airtableLog('funding', xmlrequest, xmlresponse);
  return xmlresponse;
}

function parseFormData(inboundData) {
  let xml_string;
  try {
    xml_string = inboundData.XML;
    let dss_username = inboundData.DSS_USERNAME;
    let dss_password = inboundData.DSS_PASSWORD;
    let source_hash = inboundData.SOURCE_HASH;
    let papi_version = inboundData.PAPI_VERSION;
    console.log('Source: ' + source_hash + ", v" + papi_version);
  } catch (e) {
    return xml_string;
  }
  return xml_string;
}

async function airtableLog(calltype, xmlrequest, xmlresponse) {
  try {
    let u = urlLog;
    let h = { "Content-Type": "application/json", "Authorization": "Bearer " + token }
    let b = {
      "records": [
        {
          "fields": {
            "RequestType": calltype,
            "RequestData": xmlrequest,
            "ResponseData": xmlresponse
          }
        }
      ]
    }
    let r = await axios.post(u, b, { headers: h });
  } catch (e) {
    return 0;
  }
  return 0;
}

async function airtableList() {
  let data;
  try {
    let config = {
      headers: { 'Authorization': 'Bearer ' + token },
      params: {
        maxRecords: 5,
        view: 'Grid view'
      },
    }
    await axios.get(u, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error)
      })

  } catch (e) {
    return;
  }
  return;
}