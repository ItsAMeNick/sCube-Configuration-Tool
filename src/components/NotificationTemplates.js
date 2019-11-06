import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

class CONT extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(event, id) {
        console.log(event.target.value);
        this.props.updateNote(id, event.target.id, event.target.value)
    }

    genNotificationCards() {
        let cards = [];
        for (let n in this.props.page_data) {
            console.log(n);
            let note = this.props.page_data[n];
            cards.push(
                <div style={{"padding":"0px 10px 10px 10px","width":"100%","float":"left"}} key={note.id}>
                <Card>
                    <Card.Header>
                        <strong>Notification Template</strong>
                        <Button id={note.id} variant="danger" style={{"float":"right"}} onClick={() => this.props.deleteNote(note.id)}>Delete</Button>
                    </Card.Header>
                    <div>
                    <div style={{"width":"50%"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Template Name: </Form.Label></Col>
                            <Col><Form.Control id="name" value={note.name} type="text" onChange={e => this.handleChange(e, note.id)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"50%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Title: </Form.Label></Col>
                            <Col><Form.Control id="title" value={note.title} type="text" onChange={e => this.handleChange(e, note.id)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"50%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>From: </Form.Label></Col>
                            <Col><Form.Control id="from" value={note.from} type="text" onChange={e => this.handleChange(e, note.id)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"50%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Importance: </Form.Label></Col>
                            <Col><Form.Control id="importance" value={note.importance} as="select" onChange={e => this.handleChange(e, note.id)}>
                                <option label="--Select--" value=""/>
                                <option label="Low" value="Low"/>
                                <option label="Normal" value="Normal"/>
                                <option label="High" value="High"/>
                            </Form.Control></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"50%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Description: </Form.Label></Col>
                            <Col><Form.Control id="description" value={note.description} type="text" onChange={e => this.handleChange(e, note.id)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Content: </Form.Label></Col>
                        </Row>
                        <Row>
                            <Col><Form.Control id="content" value={note.content} as="textarea" rows="5" onChange={e => this.handleChange(e, note.id)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"50%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Document Group: </Form.Label></Col>
                            <Col><Form.Control id="doc_group" value={note.doc_group} type="text" onChange={e => this.handleChange(e, note.id)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"50%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>Document Category: </Form.Label></Col>
                            <Col><Form.Control id="doc_cat" value={note.doc_cat} type="text" onChange={e => this.handleChange(e, note.id)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    <div style={{"width":"50%","float":"left"}}>
                    <Card.Body>
                        <Row>
                            <Col><Form.Label>EDMS Name: </Form.Label></Col>
                            <Col><Form.Control id="doc_name" value={note.doc_name} type="text" onChange={e => this.handleChange(e, note.id)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                    </div>
                </Card>
                </div>
            );
        }
        return cards;
    }

    render() {
        return (
            <React.Fragment>
                <Card.Header>
                    <strong>{this.props.title}</strong>
                </Card.Header>
                <div>
                <div style={{"width":"20%","float":"right"}}>
                    <Card.Body>
                    <Row><Col>
                        <Button onClick={this.props.addNote}>Add Template</Button>
                    </Col></Row>
                    </Card.Body>
                </div>
                {this.genNotificationCards()}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.NOTE
});

const mapDispatchToProps = dispatch => ({
    updateNote: (note, field, value) => dispatch({
        type: "update_notification",
        payload: {
            note: note,
            field: field,
            value: value,
        },
    }),
    addNote: () => dispatch({
        type: "add_notification",
        payload: null
    }),
    deleteNote: (id) => dispatch({
        type: "delete_notification",
        payload: id
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CONT);
