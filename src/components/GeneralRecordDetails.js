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
                <Card.Body>
                <div style={{"width":"50%","padding":"10px","float":"left"}}>
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
                <div style={{"width":"50%","padding":"10px","float":"left"}}>
                    <Row>
                        <Col><Form.Label>Agency Name</Form.Label></Col>
                        <Col><Form.Control id="agency" value={this.props.page_data.agency} type="text" onChange={this.handleChange}/></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col><Form.Label>Service Provider Code</Form.Label></Col>
                        <Col><Form.Control id="svp" value={this.props.page_data.svp} type="text" onChange={this.handleChange}/></Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col><Form.Label>Mask Pattern</Form.Label></Col>
                        <Col><Form.Control id="pattern" value={this.props.page_data.pattern} type="text" onChange={this.handleChange}/></Col>
                    </Row>
                    <Row>
                        <Col>
                            <p/>
                            <p>A mask pattern consists of a combination of Variable Substitutions and literal text. It has one sequence number variable that can be placed anywhere in the pattern. All variables can appear in any position of the mask pattern. All variables are enclosed in “$$” delimiters. For example, a sequence number variable would be written as $$SEQ05$$. Sequence Mask Patterns return results in all uppercase.</p>
                        </Col>
                    </Row>
                </div>
                </Card.Body>
                <Card.Footer/>
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
