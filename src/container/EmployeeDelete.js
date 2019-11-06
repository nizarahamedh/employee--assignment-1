import React, { Component } from 'react'; 
import {  Button, Form, FormGroup,FormFeedback, Label, Input } from 'reactstrap';
import '../index.css';
import axios from '../axios-dynamo';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

class EmployeeDelete extends Component {

    constructor(props) {
        super(props);

        this.state = {
        isLoading: false,
        employeeId:'',
        hidEmployeeId:'',
        firstName:'',
        surName:'',
        email: "",
        gender: "",
        genderMaleChk:false,
        genderFemaleChk:false,
        dateOfBirth: null,
        employeeIdError:   '',
        employeeIdValid: false,   
        formValid: false,
        frValid: false,
        formResult:''
        };
    }

    formHandler = async ( event ) => {
      event.preventDefault();
      this.setState( { loading: true } );
      const employeeId = this.state.employeeId;
      if(!this.checkInput(this.state.employeeId))
      {
          this.defStateValues();
          return;
      }       
     
        axios.get( '/employees/'+ employeeId )
            .then( response => {
                this.setState( { loading: false } );
                //console.log("response",response)
                const item = response.data.Item;
            if(!item)
            {
                this.defStateValues();
                this.setState( { frValid: true } );
                this.setState( { formResult: 'EmployeeNumber is not valid' } );
                return;
            }
            this.setState({hidEmployeeId:employeeId, firstName:item.firstName,surName:item.surName,email:item.email,gender:item.gender,dateOfBirth:new Date(item.dateOfBirth)})
            if(item.gender === 'M')
            {
            this.setState({ genderMaleChk:true});
            }
            if(item.gender === 'F')
            {
            this.setState({ genderFemaleChk:true});         
            }
            this.setState( { frValid: false,formResult:'' } );
            
        } )
        .catch( error => {
            //console.log("error",error)
            this.setState( { loading: false } );
            this.defStateValues();
            this.setState( { frValid: true } );
            this.setState( { formResult: error.message } );
        } );
    }  

    defStateValues()
    {
        this.setState({hidEmployeeId:'', firstName:'',surName:'',email:'',gender:'',dateOfBirth:null,genderMaleChk:false,
        genderFemaleChk:false,formResult:''})
    }

    submitHandler = async ( event ) => {
        event.preventDefault();
        this.setState( { loading: true } );
        const employeeId = this.state.employeeId;
        if( !this.state.employeeId || (this.state.employeeId !== this.state.hidEmployeeId) )
        {
            this.setState( { frValid: true } );
            this.setState( { formResult: 'Please retrieve Employee Details before Deleting' } );
            return;
        }       
    
        axios.delete( '/employees/'+ employeeId )
            .then( response => {
                this.setState( { loading: false } );
                //console.log("response",response)                
                this.setState( { frValid: true } );
                this.setState( { formResult: 'Employee Id ' +employeeId + ' Succesfully Deleted'} );
        } )
        .catch( error => {
            console.log("error",error)
            let formResult = '';
            if(error.response)
            {
              formResult = error.response.data.error;
            }
            else
            {
              formResult = error.message;
            }
            this.setState( { loading: false } );
            this.setState( { frValid: true } );
            this.setState( { formResult: formResult} );
        } );
    } 

    handleUserInput(e) {
        this.defStateValues();
        const name = e.target.name;
        const value = e.target.value.trim();
        this.setState({ [name]: value });
        this.checkInput(value);  
    }

    checkInput(value)
    {
        let isValid  = true;   
        const pattern = /^\d+$/;
        isValid = pattern.test(value)  
        let msg = '';
        if(!isValid)
        {      
          msg =  'EmployeeNumber should be  numeric' 
          this.defStateValues();
        }      
        this.setState( { employeeIdValid: !isValid } );
        this.setState( { employeeIdError: msg } );
        return isValid;
    }


    render()   {
        return (
        <div>
        <br/><br/>
        <p  className="var3"> Delete Existing Employee</p>
        <hr className="new2"></hr>
        <Form className='form-outer' onSubmit={this.formHandler}>
            <FormGroup>
                <Label for="employeeId" className='label2'>Employee ID</Label>
                <Input type="text" name="employeeId" id="employeeId" placeholder="Employee Id"
                onChange ={(event) => this.handleUserInput(event)} 
                invalid={!this.state.employeeIdValid} />
                <FormFeedback  className="feedback" valid={this.state.employeeIdValid}  >{this.state.employeeIdError}   </FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label></Label>
                <Button className="button button2">Read</Button>
            </FormGroup>
        </Form>
        <Form className='form-wrapper' onSubmit={this.submitHandler}>
            <FormGroup>
            <Label for="firstName">First Name</Label>
            <Input type="text" name="firstName" id="firstName" placeholder="First Name"  value={this.state.firstName} readOnly={true}/>        
            </FormGroup>
            <FormGroup>
            <Label for="surName">Sur Name</Label>
            <Input type="text" name="surName" id="surName" placeholder="Sur Name" value={this.state.surName} readOnly={true}/>
            </FormGroup>
            <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" placeholder="email" value={this.state.email} readOnly={true}/>
            </FormGroup>
            <FormGroup>            
                <Label for="dateOfBirth">Date of Birth </Label>
                <DatePicker
                    selected={this.state.dateOfBirth}        
                    dateFormat="yyyy-MM-dd"
                    dropdownMode="select"
                    readOnly={true}
                />              
            </FormGroup>    
            <FormGroup>
            <Label>Gender</Label>
            <FormGroup tag="fieldset"   className='field-radio'>
                <Label className='label2'>
                <Input type="radio" name="gender"      className='field-radio' checked={this.state.genderMaleChk} readOnly={true}
                value="M"/>{''}
                Male
                </Label>
                <Label className='label2'>
                <Input type="radio" name="gender"    className='field-radio'  checked={this.state.genderFemaleChk} readOnly={true}
                value="F"/>{''}
                Female
                </Label>
            </FormGroup>     
            </FormGroup >
            <FormFeedback className="feedback"  valid={this.state.frValid}  >{this.state.formResult}   </FormFeedback>
            <FormGroup>
            <Label ></Label>    
                <Button className="button button2">Delete</Button>           
            </FormGroup>
        </Form>
        </div>
        );
    }
}

export default EmployeeDelete;