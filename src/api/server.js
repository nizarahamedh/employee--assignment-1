const express = require('express')
const employeeRouter = require('./router')  

const app = express();
const port = process.env.PORT || 3500;
app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
  });
app.use(employeeRouter)


app.listen(port, () => {
    console.log('Server is up on port  '+port+ '.')
})
