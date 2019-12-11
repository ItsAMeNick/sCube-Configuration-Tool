import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";


class DOC extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeItem = this.handleChangeItem.bind(this);
    }

    handleChange(event) {
        if (event.target.value.length > 12) return null;
        this.props.updateDocument(event.target.value)
    }

    handleChangeItem(event, id) {
        let newDoc = _.cloneDeep(this.props.page_data.docs[id])
        if (["title", "download", "upload", "delete"].includes(event.target.id)) {
            newDoc[event.target.id] = event.target.checked;
        } else {
            newDoc[event.target.id] = event.target.value;
        }
        this.props.updateDocumentItem(id, newDoc);
    }

    genRows() {
        let rows = [];
        for (let s in this.props.page_data.docs) {
            rows.push(<tr key={s}>
                <td>
                    <Form.Control id={"type"} value={this.props.page_data.docs[s].type} type="text" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"title"} checked={this.props.page_data.docs[s].title} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"download"} checked={this.props.page_data.docs[s].download} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"upload"} checked={this.props.page_data.docs[s].upload} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td>
                    <Form.Control id={"delete"} checked={this.props.page_data.docs[s].delete} type="checkbox" onChange={e => this.handleChangeItem(e, s)}/>
                </td>
                <td><Button id={"delete"} variant="light" onClick={() => this.props.delete(s)}>Delete</Button></td>
            </tr>);
        }
        return rows;
    }

    render() {
        return (
            <React.Fragment>
                    <div style={{"width":"70%","float":"left"}}>
                        <Card.Body>
                            <Row>
                                <Col>Document Type Group</Col>
                                <Col><Form.Control id="group" value={this.props.page_data.group} type="text" onChange={this.handleChange}/></Col>
                            </Row>
                        </Card.Body>
                    </div>
                <div><Card.Body>
                <Table striped bordered responsive>
                    <thead>
                        <tr>
                            <th>Document Type</th>
                            <th>Title Viewable</th>
                            <th>Downloadable</th>
                            <th>Uploadable</th>
                            <th>Deletable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.genRows()}
                    </tbody>
                </Table>
                </Card.Body></div>
                <Card.Footer>
                    <Button style={{"width":"30%","float":"right"}} onClick={this.props.add}>Add Document Type</Button>
                </Card.Footer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.DOCS
});

const mapDispatchToProps = dispatch => ({
    add: () => dispatch({
        type: "add_doc",
        payload: null,
    }),
    delete: (id) => dispatch({
        type: "delete_doc",
        payload: id,
    }),
    updateDocument: (value) => dispatch({
        type: "update_document_group",
        payload: value,
    }),
    updateDocumentItem: (id, value) => dispatch({
        type: "update_document_item",
        payload: {
            id: id,
            value: value,
        },
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(DOC);
