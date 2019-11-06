import React, { Component } from 'react'; 
import { Form, FormGroup,FormFeedback, Label, Input } from 'reactstrap';
import '../index.css';
import axios from '../axios-dynamo';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";




  class EmployeeCreate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstName:'',
      surName:'',
      email: "",
      gender: "",
      dateOfBirth: null,
      formErrors: { firstName: '', surName: '', email: '', gender: '' ,dateOfBirth:''},
      firstNameValid: false,
      surNameValid: false,
      emailValid: false,
      genderValid: false,
      dateOfBirthValid:false,
      formValid: false,
      frValid: false,
      formResult:''
  };
  }
  
  //method is asyc since the state formValid need to be updated before submitting
  submitHandler = async ( event ) => {
      event.preventDefault();
      this.setState( { loading: true } );
      this.validateField('firstName', this.state.firstName)
      this.validateField('surName', this.state.surName)
      this.validateField('email', this.state.email)
      await this.validateNonCheckedFields();
      if(!this.state.formValid)
      {
        this.setState( { frValid: true } );
        this.setState( { formResult: 'Please Fix the Data Entry Errors' } );
        return;
      }
      const employeeData = {
        firstName: this.state.firstName,
        surName: this.state.surName,
        email: this.state.email,
        gender: this.state.gender,
        dateOfBirth: this.state.dateOfBirth,
    };
     
    axios.post( '/employees', employeeData )
    .then( response => {
        this.setState( { loading: false } );
        //console.log("response",response)
        this.setState( { frValid: true } );
        this.setState( { formResult: 'Employee Succesfully Created with Id '+response.data.EmployeeNumber } );
    } )
    .catch( error => {
        //console.log("error.response",error.response)
        let formResult = '';
        if(error.response)
        {
          formResult = error.response.data.error;
        }
        else
        {
          formResult = error.message;
        }
        //console.log("error",error)
        this.setState( { loading: false } );
        this.setState( { frValid: true } );
        this.setState( { formResult: formResult } );
    } );
  }  
  
  //
  validateNonCheckedFields = () => {
       this.validateField('gender', this.state.gender)
       this.validateField('dateOfBirth', this.state.dateOfBirth)
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value.trim();
    this.setState({ [name]: value },
        () => { this.validateField(name, value) });
    this.setState( { frValid: false } );
    this.setState( { formResult: '' } );
  }

  validateField(fieldName, value) {
  let fieldValidationErrors = this.state.formErrors;
  let firstNameValid = this.state.firstNameValid;
  let surNameValid = this.state.surNameValid;
  let emailValid = this.state.emailValid;
  let genderValid = this.state.genderValid;
  let dateOfBirthValid = this.state.dateOfBirthValid;
  //console.log("validationfiled ", this.state)

  switch (fieldName) {
      case 'firstName':
          firstNameValid =  value.length >= 3;
          fieldValidationErrors.firstName = firstNameValid ? '' :
          value === 0 ? 'FirstName is Mandatory':
          'FirstName is too short';
          break;
      case 'surName':
        surNameValid = value.length >= 5;
        fieldValidationErrors.surName = surNameValid ? '' : 
        value === 0 ? 'SurName is Mandatory': 
        'SurName is too short';
        break;
      case 'email':
          emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
          if(emailValid !== null) 
            emailValid =true;
          else
           emailValid =false;
          fieldValidationErrors.email = emailValid ? '' : ' Email Id is invalid';
          break;
      case 'gender':
        genderValid = value.length >= 1;
        fieldValidationErrors.gender = genderValid ? '' : 'Gender is Mandatory';
        break;    
      case 'dateOfBirth':
        dateOfBirthValid =   value!== null ;
        fieldValidationErrors.dateOfBirth = dateOfBirthValid ? '' : 'Date Of Birth is Mandatory';
        break;    
     
      default:
          break;
      
  }
  //console.log("fieldValidationErrors ", fieldValidationErrors)
  this.setState({
      formErrors: fieldValidationErrors,
      firstNameValid: firstNameValid,
      surNameValid: surNameValid,
      emailValid: emailValid,
      genderValid: genderValid,
      dateOfBirthValid:dateOfBirthValid}, this.validateForm);
}

 validateForm() {
  this.setState({ formValid:  this.state.firstNameValid &&  this.state.surNameValid &&
     this.state.emailValid && this.state.genderValid  && this.state.dateOfBirthValid});
  }

 deduct_years(dt,n)  {
  return new Date(dt.setFullYear(dt.getFullYear() - n));      
 }

 handleDate =  dateOfBirth => {
  this.setState({dateOfBirth})
  this.setState({dateOfBirthValid:true},this.validateForm)
  let fieldValidationErrors = this.state.formErrors;
  fieldValidationErrors.dateOfBirth = '';
  this.setState({
    formErrors: fieldValidationErrors,
    dateOfBirth: dateOfBirth,
    dateOfBirthValid:true}, this.validateForm);
 }

  render()   {
    return (
      <div>
      <br/><br/>
      <p  className="var3"> Create New Employee</p>
      <hr className="new2" ></hr>
      <Form className='form-wrapper' onSubmit={this.submitHandler}>      
        <FormGroup>
          <Label for="firstName">First Name</Label>
          <Input type="text" name="firstName" id="firstName" placeholder="First Name"
           maxLength={40} onChange ={(event) => this.handleUserInput(event)} 
           invalid={!this.state.firstNameValid} />
          <FormFeedback  className="feedback" valid={this.state.firstNameValid}  >{this.state.formErrors.firstName}   </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="surName">Sur Name</Label>
          <Input type="text" name="surName" id="surName" placeholder="Sur Name" 
           maxLength={40} onChange={(event) => this.handleUserInput(event)} 
           invalid={!this.state.surNameValid} />
           <FormFeedback  className="feedback" valid={this.state.surNameValid}  >{this.state.formErrors.surName}   </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" placeholder="email" 
            maxLength={100} onChange={(event) => this.handleUserInput(event)} />
          <FormFeedback  className="feedback" valid={this.state.emailValid}  >{this.state.formErrors.email}   </FormFeedback>
        </FormGroup>
        <FormGroup>            
              <Label for="dateOfBirth">Date of Birth </Label>
              <DatePicker
                selected={this.state.dateOfBirth}
                onChange={this.handleDate}
                maxDate={this.deduct_years(new Date(),18)}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"               
              />
              <FormFeedback  className="feedback" valid={this.state.dateOfBirthValid}  >{this.state.formErrors.dateOfBirth}   </FormFeedback>             
        </FormGroup>    
        <FormGroup>
          <Label >Gender</Label>
        <FormGroup tag="fieldset">
            <Label className='label2'>
              <Input type="radio" name="gender"    onChange={(event) => this.handleUserInput(event)}  
              value="M"/>{''}
              Male
            </Label>
            <Label className='label2'>
              <Input type="radio" name="gender"   onChange={(event) => this.handleUserInput(event)}  
              value="F"/>{''}
              Female
            </Label>
            </FormGroup>
            <FormFeedback  className="feedback" valid={this.state.genderValid}  >{this.state.formErrors.gender}   </FormFeedback>
          </FormGroup>
          <FormGroup>
          <FormFeedback  className="feedback" valid={this.state.frValid}  >{this.state.formResult}   </FormFeedback>  
          </FormGroup>
          <FormGroup>
          <Label ></Label>     
            <button className="button button2">Create</button>
            </FormGroup> 
      </Form>
      </div>
    );
  }
}

export default EmployeeCreate;