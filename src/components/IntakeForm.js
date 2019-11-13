import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

import intake_settings from "./intake_settings.js";
let settings = intake_settings.intake_settings;

class INTK extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeItem = this.handleChangeItem.bind(this);
    }

    handleChange(event) {
        this.props.updateID(event.target.value)
    }

    handleChangeItem(event, id) {
        let newSetting = _.cloneDeep(this.props.page_data.settings[id])
        switch (event.target.id) {
            case "label": {
                newSetting = {id: newSetting.id, label: event.target.value, ...settings[event.target.value]};
                newSetting.order = Object.keys(this.props.page_data.settings).length;
                if (Object.keys(newSetting).includes("display")) newSetting.display = true;
                break;
            }

            case "display": {
                newSetting.display = event.target.checked;
                break;
            }
            case "required": {
                newSetting.required = event.target.checked;
                break;
            }
            case "validate": {
                newSetting.validate = event.target.checked;
                break;
            }
            case "lp": {
                newSetting.lp = event.target.checked;
                break;
            }
            case "owner": {
                newSetting.owner = event.target.checked;
                break;
            }

            case "order": {
                newSetting.order = event.target.value;
                break;
            }
            case "type": {
                newSetting.type = event.target.value;
                break;
            }

            default: break;
        }
        this.props.update(id, newSetting);
    }

    genRows() {
        let rows = [];
        let choices = Object.keys(settings);
        let used = [];
        for (let s in this.props.page_data.settings) {
            let fields = Object.keys(this.props.page_data.settings[s]);
            rows.push(<tr key={s}>
                <td><Form.Control id={"label"} value={this.props.page_data.settings[s].label} as="select" onChange={e => this.handleChangeItem(e, s)}>
                    {[""].concat(choices.filter(item => {return !used.includes(item)})).map(item => {
                        return <option key={item} label={item} value={item}/>;
                    })}
                </Form.Control></td>
                <td>
                    {fields.includes("display") ?
                        <Form.Control id={"display"} checked={this.props.page_data.settings[s].display} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                    : null}
                </td>
                <td>
                    {fields.includes("required") ?
                        <Form.Control id={"required"} checked={this.props.page_data.settings[s].required} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                    : null}
                </td>
                <td>
                    {fields.includes("validate") ?
                        <Form.Control id={"validate"} checked={this.props.page_data.settings[s].validate} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                    : null}
                </td>
                <td>
                    {fields.includes("type") ?
                        <Form.Control id={"type"} value={this.props.page_data.settings[s].type} type="text" onChange={e => this.handleChangeItem(e, s)}/>
                    : null}
                </td>
                <td>
                    {fields.includes("owner") ?
                        <Form.Control id={"owner"} checked={this.props.page_data.settings[s].owner} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                    : null}
                </td>
                <td>
                    {fields.includes("lp") ?
                        <Form.Control id={"lp"} checked={this.props.page_data.settings[s].lp} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                    : null}
                </td>
                <td>
                    {fields.includes("order") ?
                        <Form.Control id={"order"} value={this.props.page_data.settings[s].order} type="number" onChange={e => this.handleChangeItem(e, s)}/>
                    : null}
                </td>
            </tr>);
            used.push(this.props.page_data.settings[s].label);
            //Check if/how contacts are being Handled
            if (used.includes("Multiple Contacts")) {
                used.push("Applicant")
                used.push("Contact 1");
                used.push("Contact 2");
                used.push("Contact 3");
            } else if (used.includes("Applicant") || used.includes("Contact 1") || used.includes("Contact 2") || used.includes("Contact 3")) {
                used.push("Multiple Contacts")
            }
        }
        return rows;
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <div style={{"width":"70%","float":"left"}}>
                        <Card.Body>
                            <Row>
                                <Col>Intake Form Configuration Group Code</Col>
                                <Col><Form.Control id="group_code" value={this.props.page_data.group_code} type="text" onChange={this.handleChange}/></Col>
                            </Row>
                        </Card.Body>
                    </div>
                </div>
                <div><Card.Body>
                <Table striped bordered responsive>
                    <thead>
                        <tr>
                            <th>Smart Choice</th>
                            <th>Display</th>
                            <th>Required</th>
                            <th>Validate</th>
                            <th>Type</th>
                            <th>As Owner</th>
                            <th>As Lic. Prof.</th>
                            <th>Display Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.genRows()}
                    </tbody>
                </Table>
                <div>

                </div>
                </Card.Body></div>
                <Card.Footer>
                    <Button style={{"width":"30%","float":"right"}} onClick={this.props.add}>Add Smart Choice</Button>
                </Card.Footer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.IF
});

const mapDispatchToProps = dispatch => ({
    add: () => dispatch({
        type: "add_IF_setting",
        payload: null,
    }),
    update: (id, value) => dispatch({
        type: "update_IF_setting",
        payload: {
            id: id,
            value: value,
        },
    }),
    updateID: (code) => dispatch({
        type: "update_IF_code",
        payload: code,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(INTK);
