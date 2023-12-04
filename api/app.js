const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const path = require("path");
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

require('./conn');

// Define MongoDB models for each collection
const PersonalDetails = new Schema({
  name: String,
  age: Number,
});
const PersonalDetailsModel = model('personalDetail', PersonalDetails);

const AadhaarCards = new Schema({
  name: String,
  age: Number,
  aadhaarCardNumber: String,
  livestockValue: Number,
});
const AadhaarCardModel = model('aadhaarcard', AadhaarCards);

const PanCard = new Schema({
  name: String,
  age: Number,
  panCardNumber: String,
  annualIncome: Number,
  annualExpenditure: Number,
  netCashFlow: Number,
  taxPaymentsDue: Number,
  lateTaxPayments: Number,
  taxPaymentViolations: Number,
  investments: Number,
});
const PanCardModel = model('pancard', PanCard);

const Collateral = new Schema({
  name: String,
  age: Number,
  landValue: Number,
  equipValue: Number,
  propertyValue: Number,
  inventoryValue: Number,
});
const CollateralModel = model('collateral', Collateral);

app.post('/', async (req, res) => {
  try {
    const {
      name,
      age,
      panCardNumber,
      aadhaarCardNumber,
      propertyValue,
      equipValue,
      inventoryValue,
      landValue,
    } = req.body;

    // Create a PersonalDetails entry
    const personalDetailsEntry = await PersonalDetailsModel.create({
      name,
      age,
    });

    // Create a Collateral entry
    const collateralEntry = await CollateralModel.create({
      name,
      age,
      landValue,
      equipValue,
      propertyValue,
      inventoryValue,
    });

    // You can modify the response data based on your requirements
    res.status(200).json({
      message: 'Form data submitted successfully.',
      personalDetails: personalDetailsEntry,
      collateral: collateralEntry,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/get-aadhaar-data/:aadhaarCardNumber', async (req, res) => {
  try {
    const { aadhaarCardNumber } = req.params;

    // Fetch Aadhaar Card data based on the aadhaarCardNumber parameter
    const aadhaarData = await AadhaarCardModel.findOne({
      aadhaarCardNumber,
    });

    if (!aadhaarData) {
      return res.status(404).json({ message: 'Aadhaar Card data not found' });
    }

    // Send the data back in the response
    res.status(200).json(aadhaarData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/get-pan-data/:panCardNumber', async (req, res) => {
  try {
    const { panCardNumber } = req.params;

    // Fetch Pan Card data based on the panCardNumber parameter
    const panData = await PanCardModel.findOne({
      panCardNumber,
    });

    if (!panData) {
      return res.status(404).json({ message: 'Pan Card data not found' });
    }

    // Send the data back in the response
    res.status(200).json(panData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static("./client/build"));
app.get("*",(req,res) => {
  res.sendFile(path.resolve(__dirname, "client","build", "index.html"))
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
