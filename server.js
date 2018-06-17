const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
//// NOTE: pass in key value pair
app.set('view engine', 'hbs');


// NOTE: next you tell middleware when you're done.  If you don't call next, your app won't continue
// NOTE: keeps track of how the app is running
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append to server.log.')
    }
  });
  next();
});


// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// NOTE: takes middleware function that we want to use
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the Express website!',
  });
});


app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

//create a route at /bad to similate what happens when it fails.  send back json with an errormessage property.  make sure json data shows up.

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request.'
  });
});

//binds app to port on local machine
app.listen(3000, () => {
  console.log('Server is up on port 3000.')
});
