# EmployeeAssignment
EmployeeAssignment

# Steps to run 
  - Amazon DynamoDB Local Should be up and running
  - Update DynamoDB Endpoints and region in the awsconfig.js under the config folder of src folder
  - In Command prompt - run following command 
    ```
    npm install
    node src\api\tblscripts.js
    npm start
    ```
 - You can see following in the terminal
     ```cd
     > employee-assignment@0.1.0 start E:\vsc-ws\reactws\employee-assignment
     > react-scripts start | node src/api/server.js
     Server is up on port  3500.
     ```
- In browser, go to http://localhost:3500 (port no from above output)