import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

class CHCK extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    genChecklists() {
        let cards = [];
        if (!this.props.page_data) return null;
        let first = true;
        let style={"padding":"10px 10px 10px 10px","width":"100%","float":"left"};
        cards = Object.values(this.props.page_data).map(chck => {
            if (!first) {
                style={"padding":"0px 10px 10px 10px","width":"100%","float":"left"}
            } else {
                first = false;
            }
            return (
                <div style={style} key={chck.id}>
                <Card>
                    <Card.Header>
                        <strong>Checklist</strong>
                        <Button id={chck.id} variant="danger" style={{"float":"right"}} onClick={(e) => this.props.deleteChecklist(e.target.id)}>Delete</Button>
                    </Card.Header>
                    <div>
                    <div style={{"width":"70%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Checklist Name</Form.Label></Col>
                            <Col><Form.Control id="name" value={this.props.page_data[chck.id].name} type="text" onChange={e => this.props.update(chck.id, e.target.id, e.target.value)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"30%","float":"right"}}>
                        <Card.Body>
                        <Row> <Col>
                        <Button id={chck.id} variant="secondary" onClick={(e) => this.props.addItem(e.target.id)}>Add Checklist Item</Button>
                        </Col> </Row>
                        </Card.Body>
                    </div>
                    <div><Card.Body>
                    <Table striped bordered responsive>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Default Comment</th>
                                <th>Display Order</th>
                            </tr>
                            {this.genItems(chck.id)}
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

    genItems(id) {
        let results = []
        for (let i in this.props.page_data[id].items) {
            let item = this.props.page_data[id].items[i];
            results.push(
                <tr key={item.id}>
                    <td><Form.Control id={"type"} value={this.props.page_data[id].items[item.id].type} type="text" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}/></td>
                    <td><Form.Control id={"comment"} value={this.props.page_data[id].items[item.id].comment} as="textarea" rows="4" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}/></td>
                    <td><Form.Control id={"order"} value={this.props.page_data[id].items[item.id].order} type="number" onChange={e => this.props.update(id+"|"+item.id, e.target.id, e.target.value)}/></td>
                    <td><Button id={item.id} variant="light" onClick={() => this.props.deleteItem(id+"|"+item.id)}>Delete</Button></td>
                </tr>
            )
        }
        return results;
    }

    render() {
        return (
            <React.Fragment>
                <Card.Header>
                    <strong>{this.props.title}</strong>
                    <Button style={{"width":"25%","float":"right"}} onClick={this.props.addChecklist}>Add Checklist</Button>
                </Card.Header>
                <div>
                    {!Object.keys(this.props.page_data).length ? <br/> : null}
                    {this.genChecklists()}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.INSP.checklists,
});

const mapDispatchToProps = dispatch => ({
    addChecklist: () => dispatch({
        type: "add_checklist",
        payload: null,
    }),
    addItem: (id) => dispatch({
        type: "add_checklist_item",
        payload: id,
    }),
    update: (id, field, value) => dispatch({
        type: "update_checklist",
        payload: {
            id: id,
            field: field,
            value: value,
        },
    }),
    deleteChecklist: (id) => dispatch({
        type: "delete_checklist",
        payload: id,
    }),
    deleteItem: (id) => dispatch({
        type: "delete_checklist_item",
        payload: id,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CHCK);
