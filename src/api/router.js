const express = require('express')
const router = new express.Router()
const employee = require('./awsemployee')  


router.post('/employees',  (req, res) =>
{
    employee.addItem(req.body ).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

router.get('/employees',  (req, res) =>
{
    employee.getItems(req.body ).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

router.get('/employees/:id',  (req, res) =>
{
    const _id = req.params.id;  
    employee.getItem(_id ).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

router.patch('/employees/:id',  (req, res) =>
{
    const _id = req.params.id;  
    employee.updateItem(_id,req.body ).then((data) => {
        res.send(data);
    }).catch((error) => {
        console.log("error ",error) 
        res.status(400).send(error);
    })
})


router.delete('/employees/:id',  (req, res) =>
{    
    const _id = req.params.id;  
    employee.deleteItem(_id ).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

module.exports = router 