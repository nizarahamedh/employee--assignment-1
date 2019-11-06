import React, { Component } from 'react'; 
import { Button, Form, FormGroup,FormFeedback, Label, Input } from 'reactstrap';
import '../index.css';
import axios from '../axios-dynamo';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

class EmployeeUpdate extends Component {

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
        formErrors: { firstName: '', surName: '', email: '', gender: '' ,dateOfBirth:''},
        employeeIdError:   '',
        employeeIdValid: false,   
        firstNameValid: true,
        surNameValid: true,
        emailValid: true,
        genderValid: true,
        dateOfBirthValid:true,
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
            this.setState( { formResult: ' Please retrieve Employee Details before updating' } );
            return;
        }   
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
    
        axios.patch( '/employees/'+ employeeId , employeeData )
            .then( response => {
                this.setState( { loading: false } );
                //console.log("response",response)  
                this.setState( { frValid: true } );
                this.setState( { formResult: 'Employee Id ' +employeeId + ' Succesfully Updated'} );
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

  

    handleInput(e) {
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

    handleUserInput(e) {
        const name = e.target.name;
        const value = e.target.value.trim();
        this.setState( { frValid: false } );
        this.setState( { formResult: '' } );
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
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
                fieldValidationErrors.email = emailValid ? '' : ' Email   Id is invalid';
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

    validateNonCheckedFields = () => {
        this.validateField('gender', this.state.gender)
        this.validateField('dateOfBirth', this.state.dateOfBirth)
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
        <p className="var3"> Update Existing Employee</p>
        <hr className="new2"></hr>
        <Form className='form-outer' onSubmit={this.formHandler}>
            <FormGroup>
                <Label for="employeeId" className='label2'>Employee ID</Label>
                <Input type="text" name="employeeId" id="employeeId" placeholder="Employee Id"
                onChange ={(event) => this.handleInput(event)} 
                invalid={!this.state.employeeIdValid} />
                <FormFeedback  className="feedback" valid={this.state.employeeIdValid}  >{this.state.employeeIdError}   </FormFeedback>
            </FormGroup>
            <FormGroup >
                <Label></Label>
                <Button className="button button2">Read</Button>
            </FormGroup>
        </Form>
        <Form className='form-wrapper' onSubmit={this.submitHandler}>
            <FormGroup>
            <Label for="firstName">First Name</Label>
            <Input type="text" name="firstName" id="firstName" placeholder="First Name"  value={this.state.firstName} 
             maxLength={40} onChange ={(event) => this.handleUserInput(event)} />   
            <FormFeedback  className="feedback" valid={this.state.firstNameValid}  >{this.state.formErrors.firstName}   </FormFeedback>     
            </FormGroup>
            <FormGroup>
            <Label for="surName">Sur Name</Label>
            <Input type="text" name="surName" id="surName" placeholder="Sur Name" value={this.state.surName} 
             maxLength={40} onChange ={(event) => this.handleUserInput(event)}/>
            <FormFeedback  className="feedback" valid={this.state.surNameValid}  >{this.state.formErrors.surName}   </FormFeedback>
            </FormGroup>
            <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" placeholder="email" value={this.state.email} 
             maxLength={100} onChange ={(event) => this.handleUserInput(event)}/>
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
            <FormFeedback  className="feedback" valid={this.state.genderValid}  >{this.state.formErrors.gender}   </FormFeedback>  
            </FormGroup >
            <FormFeedback  className="feedback" valid={this.state.frValid}  >{this.state.formResult}   </FormFeedback>
            <FormGroup>
            <Label ></Label>    
            <Button className="button button2">Update</Button>
            </FormGroup>
        </Form>
        </div>
        );
    }
}

export default EmployeeUpdate;