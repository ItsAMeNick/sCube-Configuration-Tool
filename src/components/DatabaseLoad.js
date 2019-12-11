import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

import firestore from "../modules/firestore.js";

class DatabaseLoad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            data: {},
            module: "",
            record: "",
            version: "",
        }
    }

    componentDidMount(){
        //Some kind of limiter could be added to a load only needs to be done once, or on demand
        if (window.location.href.split("#").length >= 2) {
            this.setState({agency: window.location.href.split("#")[1]})
        } else {
            return null;
        }
        //This will pull everything from the firebase
        firestore.collection("sCube").where("SVP","==",window.location.href.split("#")[1]).get()
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
                    if (!data[rawData[i].Module]) data[rawData[i].Module] = {agency: rawData[i].Agency, svp: rawData[i].SVP, records: {}};
                    if (!data[rawData[i].Module].records[rawData[i].Record_ID]) data[rawData[i].Module].records[rawData[i].Record_ID] = {name: rawData[i].Record_Alias, versions:{}};
                    data[rawData[i].Module].records[rawData[i].Record_ID].versions[rawData[i].Version_ID] = {name: rawData[i].Version, time: rawData[i].Time_Stamp, data: rawData[i].data};
                }
                this.setState({data: data});

                //This should be done in the reducer to stop repetition
                this.setState({loaded: true})

                return data;
            }).then((data) => {
                if (window.location.href.split("#").length >= 6 && window.location.href.split("#")[5] === "load") {
                    this.setState({module: window.location.href.split("#")[2], record: window.location.href.split("#")[3].replace(/(%20)/g, " "), version: window.location.href.split("#")[4]});
                    if (Object.keys(data).length) {
                        let struct = window.location.href.split("#");
                        console.log(struct);
                        this.props.load(data[struct[2]].records[struct[3].replace(/(%20)/g, " ")].versions[struct[4]].data);
                    }
                } else if (window.location.href.split("#").length >= 3) {
                    this.setState({module: window.location.href.split("#")[2], record: window.location.href.split("#")[3].replace(/(%20)/g, " ")});
                }
            });
    }

    getModule() {
        let modules = Object.keys(this.state.data);
        console.log(modules);
        let items = [<option key={"0"} />];
        for (let a in modules) {
            items.push(
                <option key={modules[a]} label={modules[a]} value={modules[a]}/>
            )
        }
        return items;
    }

    getRecord() {
        if (!this.state.module) return null;
        if (!this.state.data[this.state.module]) return null;
        let records = Object.keys(this.state.data[this.state.module].records);
        let items = [<option key={"0"} />];
        for (let a in records) {
            items.push(
                <option key={records[a]} label={this.state.data[this.state.module].records[records[a]].name} value={records[a]}/>
            )
        }
        return items;
    }

    getVersion() {
        if (!this.state.module) return null;
        if (!this.state.data[this.state.module]) return null;
        if (!this.state.record) return null;
        if (!this.state.data[this.state.module].records[this.state.record]) return null;
        let versions = Object.keys(this.state.data[this.state.module].records[this.state.record].versions);
        let items = [<option key={"0"} />];
        for (let a in versions) {
            console.log(versions[a])
            items.push(
                <option key={versions[a]} label={this.state.data[this.state.module].records[this.state.record].versions[versions[a]].name + " | " + (new Date(this.state.data[this.state.module].records[this.state.record].versions[versions[a]].time).toLocaleString())} value={versions[a]}/>
            )
        }
        return items;
    }

    helpLoad(event, version) {
        let text = "The record below will be loaded:\n\n"
        text += "SVP: " + this.state.module + "\n" +
                      "Alias: " + this.state.record + "\n" +
                      "Version: " + version + "\n";
          if (window.confirm(text)) {
              this.props.load(this.state.data[this.state.module].records[this.state.record].versions[version].data)
          }
    }

    render() {
        return (
            <React.Fragment>
                <Card.Body>
                    <Row>
                    <Col sm={4}>
                        <ListGroup>
                            Module:
                        </ListGroup>
                    </Col>
                    <Col sm={4}>
                        <ListGroup>
                            Record:
                        </ListGroup>
                    </Col>
                    <Col sm={4}>
                        <ListGroup>
                            Version:
                        </ListGroup>
                    </Col>
                    </Row>
                    <Row>
                    <Col sm={4}>
                        <ListGroup>
                            <Form.Control as="select" id={"module"} value={this.state.module} onChange={(e) => this.setState({module: e.target.value})}>
                                {this.getModule()}
                            </Form.Control>
                        </ListGroup>
                    </Col>
                    <Col sm={4}>
                        <ListGroup>
                            <Form.Control as="select" id={"record"} value={this.state.record} onChange={(e) => this.setState({record: e.target.value})}>
                                {this.getRecord()}
                            </Form.Control>
                        </ListGroup>
                    </Col>
                    <Col sm={4}>
                        <ListGroup>
                            <Form.Control as="select" id={"value"} value={this.state.version} onChange={(e) => {this.setState({version: e.target.value}); this.helpLoad(e, e.target.value)}}>
                                {this.getVersion()}
                            </Form.Control>
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
