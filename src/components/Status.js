import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

class STAT extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
    }


    handleChange(event) {
        this.props.updateID(event.target.value)
    }

    handleChangeStatus(event, id) {
        let newStatus = _.cloneDeep(this.props.page_data.statuses[id])
        newStatus[event.target.id] = event.target.value;
     //   console.log("Event: "+  event + " Id: " + id  + " value: " + event.target.value + " ||");
        this.props.updateStatus(id, newStatus);

    }

    genRows() {
        let rows = [];
        for (let s in this.props.page_data.statuses) {
            rows.push(<tr key={s}>
                <td>
                    <Form.Control id={"status"} value={this.props.page_data.statuses[s].status} type="text" onChange={e => this.handleChangeStatus(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"backendStatus"} value={this.props.page_data.statuses[s].backendStatus} as="select" onChange={e => this.handleChangeStatus(e, s)}>
                        <option/>
                        <option label="APPROVED" value="APPROVED"/>
                        <option label="CLOSED" value="CLOSED"/>
                        <option label="COMPLETE" value="COMPLETE"/>
                        <option label="DENIED" value="DENIED"/>
                        <option label="INCOMPLETE" value="INCOMPLETE"/>
                        <option label="PENDING" value="PENDING"/>
                        <option label="UNASSIGNED" value="UNASSIGNED"/>
                        <option label="VOID" value="VOID"/>
                    </Form.Control>
                </td>
            </tr>);
        }
        return rows;
    }

    render() {
        return (

            <React.Fragment>

                <Card.Header>
                    <strong>{this.props.title}</strong>
                </Card.Header>
                <Card.Body>
                    Statuses are public facing entities that give a clear and concise answer as to where in the lifecycle a particular Accela Record stands.
                    Status Groups allow us to assign a list of pre-defined statuses to a record.
                    Below: 'Status' related to the actual public-facing verbiage
                    'Back-End Status' is what the database sees for a particular status; try to match your status to whichever back-end status that makes sense.
                </Card.Body>
                <div>
                    <div style={{"width":"70%","float":"left"}}>
                        <Card.Body>
                            <Row>
                            <strong><Col>Status Group Name</Col></strong>
                                <Col><Form.Control id="group_code" value={this.props.page_data.group_code} type="text" onChange={this.handleChange}/></Col>
                            </Row>
                        </Card.Body>
                    </div>
                </div>
                <div><Card.Body>
                <Table striped bordered responsive>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Back-End Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.genRows()}
                    </tbody>
                </Table>
                <div>
                    <div style={{"width":"25%","float":"right"}}>
                        <Card.Body>
                        <Row> <Col>
                            <Button onClick={this.props.addStatus}>Add Status</Button>
                        </Col> </Row>
                        </Card.Body>
                    </div>
                </div>
                </Card.Body></div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.STAT
});

const mapDispatchToProps = dispatch => ({
    addStatus: () => dispatch({
        type: "add_Status",
        payload: null,
    }),
    updateStatus: (id, value) => dispatch({
        type: "update_status",
        payload: {
            id: id,
            value: value,
        },
    }),

    updateID: (code) => dispatch({
        type: "update_Status_Group",
        payload: code,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(STAT);
