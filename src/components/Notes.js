import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//The labels can be about 15 characters
const options = [
    <option value="" label="" key="0"/> //DO NOT REMOVE
    , <option value="Automation" label="Automation" key="1"/>
    , <option value="BizRule" label="Business Rule" key="2"/>
    , <option value="Reminder" label="Reminder" key="3"/>
];

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    addNote() {
        this.props.addNote(this.props.page);
    }

    deleteNote(event) {
        this.props.deleteNote(event.target.id);
    }

    handleChange(event) {
        let id = event.target.id.split("|");
        this.props.updateNote(id[1], id[0], event.target.value)
    }

    genRows() {
        let rows = [];
        let notes = Object.keys(this.props.notes).filter(item => {
            return this.props.notes[item].page === this.props.page;
        })
        for (let n in notes) {
            rows.push(
                <tr key={this.props.notes[notes[n]].id}>
                    <td><Form.Control id={"value|"+this.props.notes[notes[n]].id} as="select" value={this.props.notes[notes[n]].value} onChange={e => this.handleChange(e)}>{options}</Form.Control></td>
                    <td><Form.Control id={"comment|"+this.props.notes[notes[n]].id} as="textarea" rows="5" value={this.props.notes[notes[n]].comment} onChange={e => this.handleChange(e)}/></td>
                    <td><Button id={this.props.notes[notes[n]].id} variant="dark" onClick={(e) => this.deleteNote(e)}>Delete</Button></td>
                </tr>
            )
        }
        return rows;
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    <strong>Notes</strong>
                    <Button id={1} variant="warning" style={{"float":"right"}} onClick={(e) => this.addNote(e)}>Add Note</Button>
                </Card.Header>
                <Card.Body>
                    <Table bordered striped>
                        <thead>
                            <tr>
                                <th style={{"width":"185px"}}>Type</th>
                                <th>Comment</th>
                                <td style={{"width":"100px"}}/>
                            </tr>
                        </thead>
                        <tbody>
                            {this.genRows()}
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer>
                    <Button id={1} variant="warning" style={{"float":"right"}} onClick={(e) => this.addNote(e)}>Add Note</Button>
                </Card.Footer>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    page: state.page,
    notes: state.notes
});

const mapDispatchToProps = dispatch => ({
    updateNote: (note, field, value) => dispatch({
        type: "update_note",
        payload: {
            note: note,
            field: field,
            value: value,
        },
    }),
    addNote: (page) => dispatch({
        type: "add_note",
        payload: page
    }),
    deleteNote: (id) => dispatch({
        type: "delete_note",
        payload: id
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
