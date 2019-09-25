import React, { Component } from "react";
import { connect } from "react-redux";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Pagination from "react-bootstrap/Pagination";

import GRD from "./components/GeneralRecordDetails.js";

import "./App.css";

import page_structure from "./components/page_structure.js";
let pages = page_structure.pages;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handlePage() {
        switch(this.props.page) {
            case 0: return "Hello";
            case 1: return <GRD/>;
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
            <Card>
                {this.handlePage()}
                <Card.Footer>
                </Card.Footer>
            </Card>
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
