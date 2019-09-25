import React, { Component } from "react";
import { connect } from "react-redux";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handlePage() {
        switch(this.props.page) {
            case 0: return "Hello";
            default: return null;
        }
    }

    render() {
        return (
        <div className="App">
            <Row>
                <Col>
                    <h1>[s]Cube Configuration Tool</h1>
                    <hr/>
                </Col>
            </Row>
            <Row>
                {this.handlePage()}
            </Row>
        </div>
        );
    }
}

const mapStateToProps = state => ({
    page: state.page
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
