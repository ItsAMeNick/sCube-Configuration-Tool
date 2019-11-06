import React, { Component } from "react";
import { connect } from "react-redux";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";

import STRT from "./components/Start.js";
import GRD from "./components/GeneralRecordDetails.js";
import CF from "./components/CustomFields.js";
import FEE from "./components/Fees.js";
import NOTE from "./components/NotificationTemplates.js";
import INTK from "./components/IntakeForm.js";
import INSP from "./components/Inspections.js";
import CHCK from "./components/Checklists.js";
import STAT from "./components/Status.js";
import DOC from "./components/DocumentTypes.js";
import DDL from "./components/SharedDropdownLists.js";
import COND from "./components/Conditions.js";
import FIN from "./components/Finish.js";

import Notes from "./components/Notes.js";

import TestDump from "./components/TEST_DUMP.js";

import "./App.css";

import page_structure from "./components/page_structure.js";
let page_map = Object.keys(page_structure.pages).map(k => {
    return page_structure.pages[k];
}).sort((a, b) => {
    if (a.order > b.order) {
        return true;
    } else {
        return a.title > b.title;
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handlePageBody() {
        switch(page_map[this.props.page].id) {
            case "STRT": return <STRT title={page_map[this.props.page].title}/>;
            case "GRD": return <GRD title={page_map[this.props.page].title}/>;
            case "CF": return <CF title={page_map[this.props.page].title}/>;
            case "FEE": return <FEE title={page_map[this.props.page].title}/>;
            case "NOTE": return <NOTE title={page_map[this.props.page].title}/>;
            case "INTK": return <INTK title={page_map[this.props.page].title}/>;
            case "INSP": return <INSP title={page_map[this.props.page].title}/>;
            case "CHCK": return <CHCK title={page_map[this.props.page].title}/>;
            case "STAT": return <STAT title={page_map[this.props.page].title}/>;
            case "DOC": return <DOC title={page_map[this.props.page].title}/>;
            case "DDL": return <DDL title={page_map[this.props.page].title}/>;
            case "COND": return <COND title={page_map[this.props.page].title}/>;
            case "FIN": return <FIN title={page_map[this.props.page].title}/>;
            default: return null;
        }
    }

    handlePageFooter() {
        let pages = [];

        if (this.props.page >= 2) {
            pages.push(<Pagination.Item key={"first"}>{"<<<"}</Pagination.Item>);
        }
        if (this.props.page >= 1) {
            pages.push(<Pagination.Item key={"prev_button"}>{"<"}</Pagination.Item>);
        }
        if (this.props.page >= 2) {
            pages.push(<Pagination.Item disabled key={"prev_ellipsis"}>{"..."}</Pagination.Item>);
        }
        if (this.props.page >= 1) {
            pages.push(<Pagination.Item key={"prev"}>{page_map[this.props.page-1].title}</Pagination.Item>);
        }

        pages.push(<Pagination.Item active={true} key={"active"}>{page_map[this.props.page].title}</Pagination.Item>);

        if (this.props.page <= page_map.length-2) {
            pages.push(<Pagination.Item key={"next"}>{page_map[this.props.page+1].title}</Pagination.Item>);
        }
        if (this.props.page <= page_map.length-3) {
            pages.push(<Pagination.Item disabled key={"next_ellipsis"}>{"..."}</Pagination.Item>);
        }
        if (this.props.page <= page_map.length-2) {
            pages.push(<Pagination.Item key={"next_button"}>{">"}</Pagination.Item>);
        }
        if (this.props.page <= page_map.length-3) {
            pages.push(<Pagination.Item key={"last"}>{">>>"}</Pagination.Item>);
        }

        return pages;
    }

    handlePagination(event) {
        if (event.target.tagName === "A") {
            //Clicked on a link
            switch(event.target.text) {
                case "<<<": {
                    this.props.updatePageNum(0);
                    break;
                }
                case ">>>": {
                    this.props.updatePageNum(page_map.length-1);
                    break;
                }
                case "<": {
                    this.props.updatePageNum(this.props.page-1);
                    break;
                }
                case ">": {
                    this.props.updatePageNum(this.props.page+1);
                    break;
                }
                default: {
                    let p = 0;
                    for (let i in page_map) {
                        if (page_map[i].title === event.target.text) {
                            p = i;
                            break;
                        }
                    }
                    this.props.updatePageNum(parseInt(p));
                    break;
                }
            }
        } else {
            //Clicked on the current page...
            //Probably do nothing
        }
    }

    handleSave(event) {
        //Check if minimum requirements to save are met
        //For now this is just a SVP
        if (!this.props.GRD.svp) {
            window.alert("You have not met the minimum requirements to save, please specify a 'Service Provider Code.'");
            return -1;
        }
        if (!this.props.GRD.alias) {
            window.alert("You have not met the minimum requirements to save, please specify a 'Record Type Alias'.");
            return -1;
        }
        //Iterate the version somehow - Using date/time instead
        // let today = new Date();
        let version = this.props.version//""+today.getFullYear()+(today.getMonth()+1)+today.getDate()+today.getHours()+today.getMinutes();
        let display = "SVP: " + this.props.GRD.svp + "\n" +
                      "Alias: " + this.props.GRD.alias + "\n" +
                      "Version: " + version + "\n" +
                      "Id: " + this.props.id + "\n"
        if (window.confirm("Create Save:\n" + display)) {
            let filename = this.props.GRD.svp + "_" +
                            this.props.GRD.alias + "_" +
                            version + "_" +
                            this.props.id;
            this.props.save(filename, version);
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
                {this.handlePageBody()}
                <Card.Footer>
                <div style={{"alignItems":"center", "display":"flex", "float":"center"}}>
                <Pagination onClick={(e) => this.handlePagination(e)} style={{"margin":"auto"}}>
                    {this.handlePageFooter()}
                </Pagination>
                    <Button style ={{"float":'right'}} variant="success" onClick={(e) => this.handleSave(e)}>
                        Save
                    </Button>
                </div>
                </Card.Footer>
            </Card>
            <br/>
            <Notes/>
            <br/>
            <TestDump/>
        </div>
        );
    }
}

const mapStateToProps = state => ({
    page: state.page,
    GRD: state.GRD,
    id: state.id,
    version: state.version
});

const mapDispatchToProps = dispatch => ({
    updatePageNum: p => dispatch({
        type: "update_page_number",
        payload: p
    }),
    save: (filename, version) => dispatch({
        type: "save_state",
        payload: {filename: filename, version: version}
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
