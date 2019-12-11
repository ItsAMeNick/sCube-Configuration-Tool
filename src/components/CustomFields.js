import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

import DDL from "./CustomFields_DDL.js";

class CF extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
    }


    handleChange(event) {
        this.props.update(event.target.id, event.target.value);
    }

    handleChangeSubgroup(event, subgroup) {
        // $$Zachary$$ Here is how you stop a value from becoming too long
        if (event.target.value.length > 10) return -1;
        this.props.updateSubgroup(subgroup, event.target.value);
    }

    handleChangeField(event, subgroup, field) {
        //NOTE: The subgroup and field are switched by accident
        //Just the labels, not logically later on

        this.props.updateSubgroupField(subgroup, field, event.target.id, event.target.value);
        //DropdownList has a value of 5 (5th item)
        if (event.target.id === "type" && event.target.value === "5") {
            this.props.addDDL(subgroup, field);
        }

        if (event.target.id === "label") {
            this.props.updateDDLName(event.target.value, subgroup)
        }
    }
    handleChangeCHECKED(event, subgroup, field) {
        this.props.updateSubgroupField(subgroup, field, event.target.id, event.target.checked);
    };

    handleDelete(event) {
        this.props.deleteSubgroup(event.target.id);
    }

    addSubgroupFieldHelper(event) {
        this.props.addSubgroupField(event.target.id);
    }

    deleteSubgroupFieldHelper(event, subgroup) {
        this.props.deleteSubgroupField(subgroup, event.target.id);
    }

    generateSubgroupCards() {
        let cards = [];
        if (!this.props.page_data.subgroups) return null;
        cards = Object.values(this.props.page_data.subgroups).map(sg => {
            return (
                <div style={{"padding":"0px 10px 10px 10px","width":"100%","float":"left"}} key={sg.id}>
                <Card>
                    <Card.Header>
                        <strong>Custom Fields Subgroup</strong>
                        <Button id={sg.id} variant="danger" style={{"float":"right"}} onClick={(e) => this.handleDelete(e)}>Delete</Button>
                    </Card.Header>
                    <div>
                    <div style={{"width":"70%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Custom Fields Subgroup</Form.Label></Col>
                            <Col><Form.Control id="group_code" value={this.props.page_data.subgroups[sg.id].subgroup} type="text" onChange={e => this.handleChangeSubgroup(e, sg.id)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"20%","float":"right"}}>
                        <Card.Body>
                        <Row> <Col>
                        <Button id={sg.id} variant="secondary" onClick={(e) => this.addSubgroupFieldHelper(e)}>Add Field</Button>
                        </Col> </Row>
                        </Card.Body>
                    </div>
                    <div><Card.Body>
                    <Table striped bordered responsive>
                        <thead>
                            <tr>
                                <th>Field Label</th>
                                <th>Type</th>
                                <th>Display Order</th>
                                <th>Required</th>
                                <th>ACA Displayable</th>
                            </tr>
                            {this.genFields(sg.id)}
                        </thead>
                    </Table>
                    </Card.Body></div>
                    </div>
                </Card>
                </div>
            );
        });
        return cards;
    }

    //Yeah we have a weird glitch with checkboxes losing their "checked" property when you navigate off the page. The system recognizes the fact that the box was checked at one point, but there's no way to un-check.
    //Also looking into shared drop downs presently. looks to be a pain.
    genFields(id) {
        let fields = [];
        fields = Object.values(this.props.page_data.subgroups[id].fields).map(f => {
            let row = (
                <tr>
                    <td><Form.Control id={"label"} value={this.props.page_data.subgroups[id].fields[f.id].label} type="text" onChange={e => this.handleChangeField(e, f.id, id)}/></td>
                    <td><Form.Control id={"type"}  as ="select" value={this.props.page_data.subgroups[id].fields[f.id].type} onChange={e => this.handleChangeField(e, f.id, id)}>
                        <option label="--Select--" value = "0"/>
                        <option label="Text" value = "1"/>
                        <option label="Date" value = "2"/>
                        <option label="Yes/No" value = "3"/>
                        <option label="Number" value = "4"/>
                        <option label="DropdownList" value = "5"/>
                        <option label="TextArea" value = "6"/>
                        <option label="Time" value = "7"/>
                        <option label="Money" value = "8"/>
                        <option label="Checkbox" value = "9"/>
                    </Form.Control></td>
                    <td><Form.Control id={"disp_order"} required  value={this.props.page_data.subgroups[id].fields[f.id].disp_order} type="number" onChange={e => this.handleChangeField(e, f.id, id)}/></td>
                    <td><Form.Control id={"required"} checked={this.props.page_data.subgroups[id].fields[f.id].required} type="checkbox" onChange={e => this.handleChangeCHECKED(e, f.id, id)}/></td>
                    <td><Form.Control id={"aca_disp"} checked={this.props.page_data.subgroups[id].fields[f.id].aca_disp} type="checkbox" onChange={e => this.handleChangeCHECKED(e, f.id, id)}/></td>
                    <td><Button id={f.id} variant="light" onClick={(e) => this.deleteSubgroupFieldHelper(e, id)}>Delete</Button></td>
                </tr>
            );
            let link = "";
            if (f.type === "5") {
                for (let s in this.props.SDL) {
                    if (this.props.SDL[s].link === f.id) link = s;
                }
            }
            return <React.Fragment key={f.id}>{row}{(link ? <DDL link={link}/> : null)}</React.Fragment>;
        })
        return fields;
    }
    render() {
        return (
            <React.Fragment>
                <Card.Body>
                    Ei partem viderer per, pro ea veritus electram definitionem. Sea aliquid intellegat et. Pri dicunt saperet neglegentur ex, ancillae epicurei luptatum nec te. Vel cu erant dicunt appetere, in oratio pertinax argumentum sea.
                </Card.Body>
                <div>
                <div style={{"width":"70%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col>Custom Fields Group Code</Col>
                            <Col><Form.Control id="group_code" value={this.props.page_data.group_code} type="text" onChange={this.handleChange}/></Col>
                        </Row>
                    </Card.Body>
                </div>
                <div style={{"width":"25%","float":"right"}}>
                    <Card.Body>
                    <Row> <Col>
                        <Button onClick={this.props.addSubgroup}>Add Subgroup</Button>
                    </Col> </Row>
                    </Card.Body>
                </div>
                {this.generateSubgroupCards()}
                </div>
                <Card.Footer/>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.CF,
    SDL: state.SDL
});

const mapDispatchToProps = dispatch => ({
    update: (f, p) => dispatch({
        type: "update_page_data",
        payload: {
            page: "CF",
            field: f,
            value: p
        }
    }),
    addSubgroup: () => dispatch({
        type: "add_CF_subgroup",
        payload: null,
    }),
    addSubgroupField: (id) => dispatch({
        type: "add_CF_subgroup_field",
        payload: id,
    }),
    addDDL: (link, parent) => dispatch({
        type: "add_shared_ddl",
        payload: {link: link, parent: parent},
    }),
    deleteSubgroup: (id) => dispatch({
        type: "del_CF_subgroup",
        payload: id,
    }),
    updateSubgroup: (sg, v) => dispatch({
        type: "update_CF_subgroup",
        payload: {
            subgroup: sg,
            value: v,
        }
    }),
    updateSubgroupField: (f, sg, l, v) => dispatch({
        type: "update_CF_subgroup_field",
        payload: {
            subgroup: sg,
            field: f,
            label: l,
            value: v
        }
    }),
    updateDDLName: (name, link) => dispatch({
        type: "update_DDL_name",
        payload: {
            name: name,
            link: link,
        }
    }),
    deleteSubgroupField: (sg, f) => dispatch({
        type: "del_CF_subgroup_field",
        payload: {
            subgroup: sg,
            field: f
        }
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CF);
