import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

class FEE extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeItem = this.handleChangeItem.bind(this);
    }

    handleChange(event) {
        this.props.updateSchedule(event.target.id, event.target.value)
    }

    handleChangeItem(event, id) {
        let newFee = _.cloneDeep(this.props.page_data.fees[id])
        if (["aa", "ai"].includes(event.target.id)) {
            newFee[event.target.id] = event.target.checked;
        } else {
            newFee[event.target.id] = event.target.value;
        }
        this.props.update(id, newFee);
    }

    genRows() {
        let rows = [];
        for (let s in this.props.page_data.fees) {
            rows.push(<tr key={s}>
                <td>
                    <Form.Control id={"code"} value={this.props.page_data.fees[s].code} type="text" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"amount"} value={this.props.page_data.fees[s].amount} type="number" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"ai"} checked={this.props.page_data.fees[s].ai} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"aa"} checked={this.props.page_data.fees[s].aa} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"order"} value={this.props.page_data.fees[s].order} type="number" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"aca"} value={this.props.page_data.fees[s].aca} as="select" onChange={e => this.handleChangeItem(e, s)}>
                        <option/>
                        <option label="Yes" value="Y"/>
                        <option label="No" value="N"/>
                        <option label="Read-Only" value="R"/>
                    </Form.Control>
                </td>
                <td><Button id={"delete"} variant="light" onClick={() => this.props.delete(s)}>Delete</Button></td>
            </tr>);
        }
        return rows;
    }

    render() {
        return (
            <React.Fragment>
                <Card.Body>
                    No purto docendi fuisset vix, cu cum legere molestiae, his te omnesque oporteat. Quo te solum oblique, tale saepe vel eu, mundi sonet aperiam pri ut. Vix et quando eligendi intellegebat, ne mel probatus adipisci delicata. Ut dicit nonumes delicatissimi nec, vis at vivendo civibus fastidii. Ei omittantur definitionem vel, ei veniam labores referrentur has. Per ad fierent constituto disputationi, eam iuvaret vocibus expetenda eu, duo ad primis discere.
                </Card.Body>
                    <div style={{"width":"70%","float":"left"}}>
                        <Card.Body>
                            <Row>
                                <Col>Fee Schedule</Col>
                                <Col><Form.Control id="code" value={this.props.page_data.code} type="text" onChange={this.handleChange}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>Version</Col>
                                <Col><Form.Control id="version" value={this.props.page_data.version} type="text" onChange={this.handleChange}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>Effective Date</Col>
                                <Col><Form.Control id="effective" value={this.props.page_data.effective} type="date" onChange={this.handleChange}/></Col>
                            </Row>
                        </Card.Body>
                    </div>
                <div><Card.Body>
                <Table striped bordered responsive>
                    <thead>
                        <tr>
                            <th>Fee Code</th>
                            <th>Amount</th>
                            <th>Auto-Invoice</th>
                            <th>Auto-Assess</th>
                            <th>Display Order</th>
                            <th>Display ACA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.genRows()}
                    </tbody>
                </Table>
                </Card.Body></div>
                <Card.Footer>
                    <Button style={{"width":"25%","float":"right"}} onClick={this.props.add}>Add Fee</Button>
                </Card.Footer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.FEE
});

const mapDispatchToProps = dispatch => ({
    add: () => dispatch({
        type: "add_Fee",
        payload: null,
    }),
    delete: (id) => dispatch({
        type: "delete_Fee",
        payload: id,
    }),
    update: (id, value) => dispatch({
        type: "update_Fee",
        payload: {
            id: id,
            value: value,
        },
    }),
    updateSchedule: (id, value) => dispatch({
        type: "update_Fee_schedule",
        payload: {
            id: id,
            value: value,
        },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FEE);
