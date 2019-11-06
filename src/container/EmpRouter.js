import React, { Component } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import {  Button } from 'reactstrap';
import './EmpRouter.css';
import EmployeeCreate from './EmployeeCreate';
import EmployeeRead from './EmployeeRead';
import EmployeeUpdate from './EmployeeUpdate';
import EmployeeDelete from './EmployeeDelete';


class EmpRouter extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            bgColor:{create:'#6922db',read:'#6922db',update:'#6922db',delete:'#6922db'},
            color:{create:'#fefefe',read:'#fefefe',update:'#fefefe',delete:'#fefefe'},
        }
    }

    handleUserInput(e) {
        //console.log(this.state);
        let button = e.target.name
        //console.log(e.target.name);
        let bgColorSt =  this.defBgColors();
        bgColorSt[button] = 'white';
        let colorSt =  this.defColors();
        colorSt[button] = 'blue';
        //console.log(  bgColorSt["create"]);
        this.setState({bgColor:bgColorSt,color:colorSt})
    }

    defBgColors()
    {
        return ({bgColor:{create:'#6922db',read:'#6922db',update:'#6922db',delete:'#6922db'}})
    }

    defColors()
    {
        return ({color:{create:'#fefefe',read:'#fefefe',update:'#fefefe',delete:'#fefefe'}})
    }


    render () {
        const styleC = {
            backgroundColor:this.state.bgColor.create,
            color:this.state.color.create
        }
        const styleR = {
            backgroundColor:this.state.bgColor.read,
            color:this.state.color.read
        }
        const styleU = {
            backgroundColor:this.state.bgColor.update,
            color:this.state.color.update
        }
        const styleD = {
            backgroundColor:this.state.bgColor.delete,
            color:this.state.color.delete
        }
        return (
            <div className="EmpRouter">
                <header>
                    <p className="var1">Employee Management</p>
                    <p className="var2">Open Book Assignment Submitted by Nizar Ahamed</p>
                  
                    <nav>
                        <ul>
                            <li><NavLink
                                to="/emp/create/">
                                    <Button  name="create" onClick ={(event) => this.handleUserInput(event)}    className="button"
                                    style={styleC}>Create</Button>
                                </NavLink></li>
                            <li><NavLink to={{
                                pathname: '/emp/read'}}>
                                    <Button name="read" onClick ={(event) => this.handleUserInput(event)}  className="button"
                                   style={styleR}>Read</Button>
                                </NavLink></li>
                            <li><NavLink to={{
                                pathname: '/emp/update'}}>
                                    <Button name="update" className="button" onClick ={(event) => this.handleUserInput(event)} style={styleU}>Update</Button></NavLink></li>
                             <li><NavLink to={{
                                pathname: '/emp/delete'}}>
                                    <Button name="delete" className="button" onClick ={(event) => this.handleUserInput(event)} style={styleD}>Delete</Button></NavLink></li>
                        </ul>
                        
                    </nav>
                    <hr  className="new1" ></hr>
                </header>
                <Switch>
                    <Route path="/emp/create" component={EmployeeCreate} />
                    <Route path="/emp/read" component={EmployeeRead} />
                    <Route path="/emp/update" component={EmployeeUpdate} />
                    <Route path="/emp/delete" component={EmployeeDelete} />
                </Switch>
            </div>
        );
    }
}

export default EmpRouter;