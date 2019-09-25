import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

class GRD extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.update(event.target.id, event.target.value);
    }

    render() {
        return (
            <React.Fragment>
                <Card.Header>
                    <strong>{this.props.title}</strong>
                </Card.Header>
                <Card.Body>
                <div style={{"width":"50%"}}>
                    <Row>
                        <Col><Form.Label>Record Type Alias</Form.Label></Col>
                        <Col><Form.Control id="alias" value={this.props.page_data.alias} type="text" onChange={this.handleChange}/></Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col><Form.Label>Module</Form.Label></Col>
                        <Col><Form.Control id="module" value={this.props.page_data.module} type="text" onChange={this.handleChange}/></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col><Form.Label>Type</Form.Label></Col>
                        <Col><Form.Control id="type" value={this.props.page_data.type} type="text" onChange={this.handleChange}/></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col><Form.Label>Sub-Type</Form.Label></Col>
                        <Col><Form.Control id="sub_type" value={this.props.page_data.sub_type} type="text" onChange={this.handleChange}/></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col><Form.Label>Category</Form.Label></Col>
                        <Col><Form.Control id="category" value={this.props.page_data.category} type="text" onChange={this.handleChange}/></Col>
                    </Row>
                </div>
                </Card.Body>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    page_data: state.GRD
});

const mapDispatchToProps = dispatch => ({
    update: (f, p) => dispatch({
        type: "update_page_data",
        payload: {
            page: "GRD",
            field: f,
            value: p
        }
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(GRD);
