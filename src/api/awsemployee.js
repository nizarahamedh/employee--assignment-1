var AWS = require("aws-sdk");
require('../config/awsconfig.js')
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "Employee";

const checkEmployee = () =>
{

    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : "Employee2"        
    }
    dynamodb.describeTable(params, function(err, data) {
        if (err) {
            console.error("Unable to find table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Found table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}


const addItem =   (body ) =>
{
     return new Promise((resolve, reject) => {
        addItemImpl(body).then( result =>{
            //console.log("result",result)
            resolve(result)
        }).catch( e =>{
            //console.log("e",e)
            reject({error:e.message} )
        })
    })
}

const  addItemImpl =   async (body ) =>
{
    const matchFound = await checkItem (body);
    console.log("matchFound"+matchFound)
    if(matchFound)
        throw( new Error("Employee found with same First Name, SurName, Email ID and DateOfBirth")); 
    const dataId =  await getIds();
    var id = 1;
    if(dataId)
    {
        id = dataId.MaxId+1;
    }
    await addItemId(id);
    body.EmployeeNumber=id
    const data = await addItemAws(body)
    const retData = {EmployeeNumber:id}
    return retData;
   
}


const addItemAws =   (body ) =>
{
     return new Promise((resolve, reject) => {        
        var params = {
            TableName:table,
            Item:{}          
        };
        params.Item = {...body}       
        //console.log("Adding a new item...", params.Item);    
        docClient.put(params,  function(err, data) {
            if(err)
                 reject(err); 
            resolve(data)
        });
    })
}

const addItemId=   (id ) =>
{
     return new Promise((resolve, reject) => {        
        var params = {
            TableName:'EmployeeId',
            Item:{}          
        };
        params.Item = {Id:1,MaxId:id}       
        //console.log("Adding a new itemId...", params.Item);    
        docClient.put(params,  function(err, data) {
            if(err)
                 reject(err); 
            resolve(data)
        });
    })
}

const getIds =  () =>
{
    return new Promise((resolve, reject) => {     
        var params = {
            TableName:'EmployeeId'   
        };
        //console.log("scanning Ids...");
        docClient.scan(params,  function(err, data) {
            //console.log("data from getIds",data);
            if(err)
                return reject(err)
            resolve(data.Items[0])

        });
     })
}

const checkItem = (body ) =>
{
    return new Promise((resolve, reject) => {     
        var params = {
            TableName:'Employee'   
        };
        //console.log("scanning employees...");
        docClient.scan(params,  function(err, data) {
            if(err)
            {
                //console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
                return reject(err)
            }
            else
            {
                var matchFound =  data.Items.some(function (employee) { 
                    return (employee.firstName === body.firstName && employee.surName === body.surName 
                        && employee.email === body.email
                        && employee.dateOfBirth === body.dateOfBirth)                        
                    });
                resolve(matchFound)
            }
        });
     })
}

const getItems = (body ) =>
{
    return new Promise((resolve, reject) => {           
        var params = {
            TableName:table   
        };
        //console.log("scanning item...");
        docClient.scan(params,  function(err, data) {
            if(err)
                return reject(err)
            resolve(data)
        });
    })
}

const getItem = (id ) =>
{
    return new Promise((resolve, reject) => {
        if(!isNumeric(id))           
            return reject('Numbers must be non-negative')
        var params = {
            TableName:table,
            Key: {
                "EmployeeNumber": parseInt(id, 10)
                }
        };
        docClient.get(params,  function(err, data) {
            if(err)
                return reject(err)
            resolve(data)

        }); 
    });
    
}

//look for item before updating  
const updateItem =   (id,body ) =>
{
     return new Promise((resolve, reject) => {
        updateItemImpl(id,body).then( result =>{
            //console.log("result",result)
            resolve(result)
        }).catch( e =>{
            reject({error:e.message} )
        })
    })
}


const  updateItemImpl =   async (id, body ) =>
{
    const itemData = await getItem (id);
    if(!itemData.Item)
        throw( new Error("Employee Details not found for update. Refresh Employee Details")); 
     await updateItemId(id,body);
}


const updateItemId = (id,body ) =>
{
    return new Promise((resolve, reject) => {
       
        if(!isNumeric(id))
           return  reject('Not a Valid Input For API');          
        if(body.firstName === undefined || body.surName === undefined|| body.dateOfBirth  === undefined 
            || body.email === undefined || body.gender === undefined)           
               return  reject('All Attributes need to be updated');         
        if(!body.FirstName && !body.SurName && !body.email && !body.dateOfBirth && !body.Gender)
             return  reject('No Data to Update');
        var params = {
            TableName:table,
            Key: {
                "EmployeeNumber": parseInt(id, 10)
                },
            AttributeUpdates: {  
                'firstName': {Value :body.firstName},
                'surName': {Value :body.surName},
                'dateOfBirth': {Value : body.dateOfBirth},
                'email': {Value : body.email},
                'gender': {Value :body.gender}
            }
        }

        params.Item = {...body}
        //console.log("Updating the item...");       
        docClient.update(params,  function(err, data) {
            if(err)
                return reject(err)
            resolve(data)
        });
    });
}



//look for item before deleting  
const deleteItem =   (id ) =>
{
     return new Promise((resolve, reject) => {
        deleteItemImpl(id).then( result =>{
            //console.log("result",result)
            resolve(result)
        }).catch( e =>{            
            reject({error:e.message} )
        })
    })
}


const  deleteItemImpl =   async (id, ) =>
{
    if(!isNumeric(id))
        throw( new Error("Not a Valid Input For API")); 
    const itemData = await getItem (id);
    //console.log("item"+itemData.Item)
    if(!itemData.Item)
        throw( new Error("Employee Details not found for Delete. Refresh Employee Details")); 
     await deleteItemId(id);
}

const deleteItemId = (id ) =>
{
    return new Promise((resolve, reject) => {
  
        var params = {
            TableName:table,
            Key: {
                "EmployeeNumber": parseInt(id, 10)
                }
        };
        //console.log("Deleting item...");      
        docClient.delete(params,  function(err, data) {
            if(err)
                return reject(err)
            resolve(data)
        });
    });
}


function isNumeric(n) 
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}


module.exports = {
    checkEmployee: checkEmployee,
    addItem: addItem,
    getItems: getItems,
    getItem:getItem,
    updateItem:updateItem,
    deleteItem
}

