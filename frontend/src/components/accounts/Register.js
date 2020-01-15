import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/auth";
import axios from "axios";

export class Register extends Component {
    state = {
        username: "", 
        email: "",
        password: "",
        justRegister: false,
        groups: []
    };

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };

    componentDidMount() {
      this.setState({justRegister: false});
      this.getGroupList();
    };

    getGroupList() {
      axios
        .get('http://127.0.0.1:8000/groups/')
        .then( res => {
          this.setState({ groups: res.data.results });
        })
        .catch(err => console.log(err));
    };

    renderGroupOptions() {
      console.log(this.state.groups)
      return this.state.groups.map(group => (
        <option value={`${group.id}`}>{group.name}</option>
      ))
    };

    handleChange = e => {
      let { name, value } = e.target;
      const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };

    onSubmit = e => {
        e.preventDefault();
        const { username, email, password } = this.state;
        const newUser = {
            username,
            password,
            email
        };
        this.props.register(newUser);
        this.setState({justRegister: true});
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        if(this.props.isAuthenticated) {
          return <Redirect to="/"/>;
        }
        if(this.state.justRegister) {
          return <Redirect to="/login"/>;
        }
        const { username, email, password } = this.state;
        return (
            <div className="col-md-6 m-auto">
              <div className="card card-body mt-5">
                <h2 className="text-center">Register</h2>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      onChange={this.onChange}
                      value={username}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={this.onChange}
                      value={email}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      onChange={this.onChange}
                      value={password}
                    />
                  </div>
                  <div className="form-group">
                    <label>Group</label>
                    <select
                      className="form-control"
                      name="groups"
                      value={this.state.groups}
                      onChange={this.handleChange}>
                        {this.renderGroupOptions()}
                    </select> 
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary">Register</button>
                  </div>
                  <p>
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </form>
              </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register })(Register);