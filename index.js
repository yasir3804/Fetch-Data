const express = require("express");
const axios = require("axios");

const app = express();
const generateHeadersMiddleware = require('./header');
// Replace with your actual API details
const API_URL = "https://sandbox.areeba.com/nyurtech/topup/local_bill_payment/getBill";
const headers = {
  base_url: "https://sandbox.areeba.com",
//   Authorization: "Bearer 123",
  Signature:
    'Signature keyId="5f16a8be5670f70e5a990313fe0992dcbb1d409890aa113c23500fc1", algorithm="hmac-sha256", headers="(request-target) x-aux-date", signature="fd3Z3KxSc56IDRXIh4O4l5oE7kdNeknoizvIklGJB%2Fg%3D"',
  "X-Aux-Date": "Wed, 15 May 2024 02:53:24 GMT",                                                                                                                                                            
  "Content-Type": "application/json",
};
const postData = async (req, res) => {
  try {
    const data = req.body;
    const response = await axios.post(API_URL, data, { headers });
    res.json({data:response.data,headers:headers});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching data");
  }
};

app.post("/api/post", express.json(), postData);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
