import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

class RESG extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    genResultGroups() {
        let cards = [];
        if (!this.props.page_data) return null;
        let first = true;
        let style={"padding":"10px 10px 10px 10px","width":"100%","float":"left"};
        cards = Object.values(this.props.page_data).map(rg => {
            if (!first) {
                style={"padding":"0px 10px 10px 10px","width":"100%","float":"left"}
            } else {
                first = false;
            }
            return (
                <div style={style} key={rg.id}>
                <Card>
                    <Card.Header>
                        <strong>Result Group</strong>
                        <Button id={rg.id} variant="danger" style={{"float":"right"}} onClick={(e) => this.props.deleteGroup(e.target.id)}>Delete</Button>
                    </Card.Header>
                    <div>
                    <div style={{"width":"70%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Result Group Name</Form.Label></Col>
                            <Col><Form.Control id="name" value={this.props.page_data[rg.id].name} type="text" onChange={e => this.props.update(rg.id, e.target.id, e.target.value)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"25%","float":"right"}}>
                        <Card.Body>
                        <Row> <Col>
                        <Button id={rg.id} variant="secondary" onClick={(e) => this.props.addResult(e.target.id)}>Add Result</Button>
                        </Col> </Row>
                        </Card.Body>
                    </div>
                    <div><Card.Body>
                    <Table striped bordered responsive>
                        <thead>
                            <tr>
                                <th>Result Label</th>
                                <th>Result Type</th>
                                <th>Minimum Score</th>
                                <th>Maximum Score</th>
                                <th>Minimum Major Violations</th>
                                <th>Maximum Major Violations</th>
                                <th>Display Order</th>
                            </tr>
                            {this.genResults(rg.id)}
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

    genResults(id) {
        let results = []
        for (let i in this.props.page_data[id].items) {
            let item = this.props.page_data[id].items[i];
            results.push(
                <tr key={item.id}>
                    <td><Form.Control id={"result"} value={this.props.page_data[id].items[item.id].result} type="text" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}/></td>
                    <td><Form.Control id={"type"} value={this.props.page_data[id].items[item.id].type} as="select" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}>
                        <option value="APPROVED" label="APPROVED"/>
                        <option value="DENIED" label="DENIED"/>
                        <option value="PENDING" label="PENDING"/>
                    </Form.Control></td>
                    <td><Form.Control id={"min_score"} value={this.props.page_data[id].items[item.id].min_score} type="number" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}/></td>
                    <td><Form.Control id={"max_score"} value={this.props.page_data[id].items[item.id].max_score} type="number" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}/></td>
                    <td><Form.Control id={"min_vio"} value={this.props.page_data[id].items[item.id].min_vio} type="number" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}/></td>
                    <td><Form.Control id={"max_vio"} value={this.props.page_data[id].items[item.id].max_vio} type="number" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}/></td>
                    <td><Form.Control id={"order"} value={this.props.page_data[id].items[item.id].order} type="number" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}/></td>
                    <td><Button id={item.id} variant="light" onClick={() => this.props.deleteResult(id+"|"+item.id)}>Delete</Button></td>
                </tr>
            )
        }
        return results;
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    {!Object.keys(this.props.page_data).length ? <br/> : null}
                    {this.genResultGroups()}
                </div>
                <Card.Footer>
                    <Button style={{"width":"25%","float":"right"}} onClick={this.props.addGroup}>Add Result Group</Button>
                </Card.Footer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.INSP.result_groups,
});

const mapDispatchToProps = dispatch => ({
    addGroup: () => dispatch({
        type: "add_result_group",
        payload: null,
    }),
    addResult: (id) => dispatch({
        type: "add_result_group_item",
        payload: id,
    }),
    update: (id, field, value) => dispatch({
        type: "update_result_group",
        payload: {
            id: id,
            field: field,
            value: value,
        },
    }),
    deleteGroup: (id) => dispatch({
        type: "delete_result_group",
        payload: id,
    }),
    deleteResult: (id) => dispatch({
        type: "delete_result_group_item",
        payload: id,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RESG);
