import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

import firestore from "../modules/firestore.js";

class DatabaseLoad extends Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false, data: {}};
    }

    componentDidMount(){
        //Some kind of limiter could be added to a load only needs to be done once, or on demand

        //This will pull everything from the firebase
        firestore.collection("sCube").get()
            .then(querySnapshot => {
                //This gets all the raw data
                let rawData = {};
                for (let p in querySnapshot.docs) {
                    let doc = querySnapshot.docs[p];
                    rawData[doc.id] = {...doc.data(), id: doc.id}
                }
                //Format the data
                let data = {};
                for (let i in rawData) {
                    if (!data[rawData[i].SVP]) data[rawData[i].SVP] = {};
                    if (!data[rawData[i].SVP][rawData[i].Record_ID]) data[rawData[i].SVP][rawData[i].Record_ID] = {};
                    data[rawData[i].SVP][rawData[i].Record_ID][rawData[i].Version_ID] = i;
                }
                console.log(data)

                this.setState({data: data});

                this.setState({loaded: true})
                //this.props.load(data['YiU6OvaUjZXsw5zJTapu'].data);
            });
    }

    getAgency() {
        let agencies = Object.keys(this.state.data);
        let items = [];
        for (let a in agencies) {
            items.push(
                <ListGroup.Item action key={a}>
                    {agencies[a]}
                </ListGroup.Item>
            )
        }
        return items;
    }
    getRecord() {
        let agencies = Object.keys(this.state.data);
        let items = [];
        for (let a in agencies) {
            items.push(
                <ListGroup.Item action key={a}>
                    {agencies[a]}
                </ListGroup.Item>
            )
        }
        return items;
    }
    getVersion() {
        let agencies = Object.keys(this.state.data);
        let items = [];
        for (let a in agencies) {
            items.push(
                <ListGroup.Item action key={a}>
                    {agencies[a]}
                </ListGroup.Item>
            )
        }
        return items;
    }

    render() {
        return (
            <React.Fragment>
                <Card.Body>
                    <Row>
                    <Col sm={4}>
                        <ListGroup>
                            {this.getAgency()}
                        </ListGroup>
                    </Col>
                    <Col sm={4}>
                        <ListGroup>
                            {this.getRecord()}
                        </ListGroup>
                    </Col>
                    <Col sm={4}>
                        <ListGroup>
                            {this.getVersion()}
                        </ListGroup>
                    </Col>
                    </Row>
                </Card.Body>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    load: state => dispatch({
        type: "load_state",
        payload: state
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseLoad);
