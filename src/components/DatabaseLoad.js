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
        this.state = {
            loaded: false,
            data: {},
            agency: "",
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
                    if (!data[rawData[i].SVP]) data[rawData[i].SVP] = {agency: rawData[i].Agency, records: {}};
                    if (!data[rawData[i].SVP].records[rawData[i].Record_ID]) data[rawData[i].SVP].records[rawData[i].Record_ID] = {name: rawData[i].Record_Alias, versions:{}};
                    data[rawData[i].SVP].records[rawData[i].Record_ID].versions[rawData[i].Version_ID] = {name: rawData[i].Version, data: rawData[i].data};
                }

                this.setState({data: data});

                //This should be done in the reducer to stop repetition
                this.setState({loaded: true})
            }).then(() => {
                if (window.location.href.split("#").length >= 4) {
                    this.setState({agency: window.location.href.split("#")[1], record: window.location.href.split("#")[2], version: window.location.href.split("#")[3]});
                    if (Object.keys(this.state.data).length) {
                        let struct = window.location.href.split("#");
                        this.props.load(this.state.data[struct[1]].records[struct[2]].versions[struct[3]].data);
                    }
                } else if (window.location.href.split("#").length >= 3) {
                    this.setState({agency: window.location.href.split("#")[1], record: window.location.href.split("#")[2]});
                }
            });
    }

    getAgency() {
        let agencies = Object.keys(this.state.data);
        let items = [];
        for (let a in agencies) {
            items.push(
                <ListGroup.Item active={this.state.agency === agencies[a]} href={"#"+agencies[a]} action key={agencies[a]} id={agencies[a]} onClick={(e) => this.setState({agency: e.target.href.split("#")[1]})}>
                    {this.state.data[agencies[a]].agency}
                </ListGroup.Item>
            )
        }
        return items;
    }

    getRecord() {
        if (!this.state.agency) return null;
        if (!this.state.data[this.state.agency]) return null;
        let records = Object.keys(this.state.data[this.state.agency].records);
        let items = [];
        for (let a in records) {
            items.push(
                <ListGroup.Item active={this.state.record === records[a]} href={"#"+this.state.agency+"#"+records[a]} action key={records[a]} id={records[a]} onClick={(e) => this.setState({record: e.target.href.split("#")[2]})}>
                    {this.state.data[this.state.agency].records[records[a]].name}
                </ListGroup.Item>
            )
        }
        return items;
    }

    getVersion() {
        if (!this.state.agency) return null;
        if (!this.state.data[this.state.agency]) return null;
        if (!this.state.record) return null;
        if (!this.state.data[this.state.agency].records[this.state.record]) return null;
        let versions = Object.keys(this.state.data[this.state.agency].records[this.state.record].versions);
        let items = [];
        for (let a in versions) {
            items.push(
                <ListGroup.Item active={this.state.version === versions[a]} href={"#"+this.state.agency+"#"+this.state.record+"#"+versions[a]} action key={versions[a]} id={versions[a]} onClick={(e) => {
                    this.helpLoad(e, e.target.href.split("#")[3]);
                }}>
                    {this.state.data[this.state.agency].records[this.state.record].versions[versions[a]].name}
                </ListGroup.Item>
            )
        }
        return items;
    }

    helpLoad(event, version) {
        let text = "The record below will be loaded:\n\n"
        text += "SVP: " + this.state.agency + "\n" +
                      "Alias: " + this.state.record + "\n" +
                      "Version: " + version + "\n";
          if (window.confirm(text)) {
              this.setState({version: version});
              this.props.load(this.state.data[this.state.agency].records[this.state.record].versions[version].data)
              window.location.hash = "";
          }
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
