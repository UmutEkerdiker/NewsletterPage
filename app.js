//jshint esversion: 6
require("dotenv").config();
const express=require("express");
const request=require("request");
const https=require("https");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});


//obtain user data and save it in a const.

app.post("/", function(req, res) {

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };


//save keys into .env file
  const jsonData = JSON.stringify(data);
  const url = process.env.SECRET_URL;
  const options = {
    method: "POST",
    auth: process.env.SECRET_AUTH
    }
  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    };

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});


app.post("/failure", function(req, res) {
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
