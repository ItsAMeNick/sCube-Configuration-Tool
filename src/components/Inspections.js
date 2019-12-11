import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class INSP extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    genInspections() {
        let cards = [];
        if (!this.props.page_data) return null;
        let first = true;
        let style={"padding":"10px 10px 10px 10px","width":"100%","float":"left"};
        cards = Object.values(this.props.page_data).map(insp => {
            if (!first) {
                style={"padding":"0px 10px 10px 10px","width":"100%","float":"left"}
            } else {
                first = false;
            }
            return (
                <div style={style} key={insp.id}>
                <Card>
                    <Card.Header>
                        <strong>Inspection</strong>
                        <Button id={insp.id} variant="danger" style={{"float":"right"}} onClick={(e) => this.props.deleteInspection(e.target.id)}>Delete</Button>
                    </Card.Header>
                    <div>
                    <Card.Body style={{"padding":"auto auto -10px auto"}}>
                        <Row style={{"width":"50%","padding":"0px 0px 10px 0px"}}>
                            <Col><Form.Label>Inspection Name</Form.Label></Col>
                            <Col><Form.Control id="type" value={this.props.page_data[insp.id].type} type="text" onChange={e => this.props.update(insp.id, e.target.id, e.target.value)}/></Col>
                        </Row>
                        <Row style={{"width":"100%","padding":"10px 0px 10px 0px"}}>
                            <Col><Form.Label>Checklist Group</Form.Label></Col>
                            <Col><Form.Control id="checklist" value={this.props.page_data[insp.id].checklist} as="select" onChange={e => this.props.update(insp.id, e.target.id, e.target.value)}>
                                {this.genChecklistOptions()}
                            </Form.Control></Col>
                            <Col><Form.Label>Result Group</Form.Label></Col>
                            <Col><Form.Control id="result_group" value={this.props.page_data[insp.id].result_group} as="select" onChange={e => this.props.update(insp.id, e.target.id, e.target.value)}>
                                {this.genResultOptions()}
                            </Form.Control></Col>
                        </Row>
                        <hr/>
                        <Row style={{"width":"100%","padding":"10px 0px 10px 0px"}}>
                            <Col><Form.Label>Optional/Required</Form.Label></Col>
                            <Col><Form.Control id="required" value={this.props.page_data[insp.id].required} as="select" onChange={e => this.props.update(insp.id, e.target.id, e.target.value)}>
                                <option label="Optional" value="N"/>
                                <option label="Required" value="Y"/>
                            </Form.Control></Col>
                            <Col><Form.Label>ACA Displayable</Form.Label></Col>
                            <Col><Form.Control id="aca" value={this.props.page_data[insp.id].aca} as="select" onChange={e => this.props.update(insp.id, e.target.id, e.target.value)}>
                                <option label="Yes" value="Y"/>
                                <option label="No" value="N"/>
                            </Form.Control></Col>
                            <Col><Form.Label>Display Order</Form.Label></Col>
                            <Col><Form.Control id="order" value={this.props.page_data[insp.id].order} type="number" onChange={e => this.props.update(insp.id, e.target.id, e.target.value)}/></Col>
                        </Row>
                    </Card.Body>
                    </div>
                </Card>
                </div>
            );
        });
        return cards;
    }

    genResultOptions() {
        let options = [<option label="--Select--" value="" key="0"/>];
        for (let rg in this.props.result_groups) {
            options.push(
                <option key={rg} label={this.props.result_groups[rg].name} value={this.props.result_groups[rg].name}/>
            )
        }
        return options;
    }

    genChecklistOptions() {
        let options = [<option label="--Select--" value="" key="0"/>];
        let used = [];
        for (let chck in this.props.checklists) {
            if (!used.includes(this.props.checklists[chck].group)) {
                used.push(this.props.checklists[chck].group);
                options.push(
                    <option key={chck} label={this.props.checklists[chck].group} value={this.props.checklists[chck].group}/>
                )
            }
        }
        return options;
    }

    render() {
        return (
            <React.Fragment>
                <Card.Body>
                    Ad usu simul consul ridens. Sed in inimicus iudicabit maiestatis. Feugiat delicata neglegentur ius at, at his integre moderatius. Ullum dicta menandri his ex, cu per viderer deleniti lucilius. Labore nostro adipisci eu usu.
                </Card.Body>
                <div>
                <Card.Body>
                    <Row style={{"width":"100%"}}>
                        <Col><Form.Label>Inspection Group Code</Form.Label></Col>
                        <Col><Form.Control id="code" value={this.props.INSP_code} type="text" maxLength="12" onChange={e => this.props.update(0, e.target.id, e.target.value)}/></Col>
                        <Col><Form.Label>Inspection Group Name</Form.Label></Col>
                        <Col><Form.Control id="name" value={this.props.INSP_name} type="text" maxLength="12" onChange={e => this.props.update(0, e.target.id, e.target.value)}/></Col>
                    </Row>
                </Card.Body>
                    {this.genInspections()}
                </div>
                <Card.Footer>
                    <Button style={{"width":"25%","float":"right"}} onClick={this.props.addInspection}>Add Inspection</Button>
                </Card.Footer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    INSP_code: state.INSP.code,
    INSP_name: state.INSP.name,
    page_data: state.INSP.inspections,
    result_groups: state.INSP.result_groups,
    checklists: state.INSP.checklists
});

const mapDispatchToProps = dispatch => ({
    addInspection: () => dispatch({
        type: "add_inspection",
        payload: null,
    }),
    update: (id, field, value) => dispatch({
        type: "update_inspection",
        payload: {
            id: id,
            field: field,
            value: value
        },
    }),
    deleteInspection: (id) => dispatch({
        type: "delete_inspection",
        payload: id,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(INSP);
