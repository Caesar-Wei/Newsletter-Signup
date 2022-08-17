//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "",
  server: "us17",
});

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname));

app.get("/", function(req, res) {

  res.sendFile(__dirname + "/signup.html")
});


app.post("/", function(req, res) {

  const listId = "9111178e06";
  const subscribingUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };

  async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
              email_address: subscribingUser.email,
              status: "subscribed",
              merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
              }
            });

            console.log(
              `Successfully added contact as an audience member. The contact's id is ${response.id}.`
            );

            res.sendFile(__dirname + "/success.html");
        } catch (e) {
            res.sendFile(__dirname + "/failure.html");
        }
    }

    run();
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

//api key
//1f1131e12fa0c7b2ccd430b5ead22340-us17

//list id / audience id
//9111178e06
