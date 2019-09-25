import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

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
        this.props.updateSubgroup(subgroup, event.target.value);
    }

    handleChangeField(event, subgroup, field) {
        this.props.updateSubgroupField(subgroup, field, event.target.id, event.target.value);
    }

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
        if (!this.props.page_data.sub_groups) return null;
        cards = Object.values(this.props.page_data.sub_groups).map(sg => {
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
                            <Col><Form.Control id="group_code" value={this.props.page_data.sub_groups[sg.id].subgroup} type="text" onChange={e => this.handleChangeSubgroup(e, sg.id)}/></Col>
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
                                <th>Requried</th>
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

    genFields(id) {
        let fields = [];
        fields = Object.values(this.props.page_data.sub_groups[id].fields).map(f => {
            return (
                <tr key={f.id}>
                    <td><Form.Control id={"label"} value={this.props.page_data.sub_groups[id].fields[f.id].label} type="text" onChange={e => this.handleChangeField(e, f.id, id)}/></td>
                    <td><Form.Control id={"type"} value={this.props.page_data.sub_groups[id].fields[f.id].type} type="text" onChange={e => this.handleChangeField(e, f.id, id)}/></td>
                    <td><Form.Control id={"disp_order"} value={this.props.page_data.sub_groups[id].fields[f.id].disp_order} type="text" onChange={e => this.handleChangeField(e, f.id, id)}/></td>
                    <td><Form.Control id={"required"} value={this.props.page_data.sub_groups[id].fields[f.id].required} type="text" onChange={e => this.handleChangeField(e, f.id, id)}/></td>
                    <td><Form.Control id={"aca_disp"} value={this.props.page_data.sub_groups[id].fields[f.id].aca_disp} type="text" onChange={e => this.handleChangeField(e, f.id, id)}/></td>
                    <td><Button id={f.id} variant="light" onClick={(e) => this.deleteSubgroupFieldHelper(e, id)}>Delete</Button></td>
                </tr>
            );
        })
        return fields;
    }

    render() {
        return (
            <React.Fragment>
                <Card.Header>
                    <strong>{this.props.title}</strong>
                </Card.Header>
                <div>
                <div style={{"width":"70%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col>Custom Fields Group Code</Col>
                            <Col><Form.Control id="group_code" value={this.props.page_data.group_code} type="text" onChange={this.handleChange}/></Col>
                        </Row>
                    </Card.Body>
                </div>
                <div style={{"width":"20%","float":"right"}}>
                    <Card.Body>
                    <Row> <Col>
                    <Button onClick={this.props.addSubgroup}>Add Subgroup</Button>
                    </Col> </Row>
                    </Card.Body>
                </div>
                {this.generateSubgroupCards()}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.CF
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
    deleteSubgroupField: (sg, f) => dispatch({
        type: "del_CF_subgroup_field",
        payload: {
            subgroup: sg,
            field: f
        }
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CF);
