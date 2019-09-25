import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class FIN extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.genASIGroupModel = this.genASIGroupModel.bind(this);
    }

    bigRedButton() {
        console.log("Starting Generation");

        //Genereate ASIGroupModel
        let asiGroupModel = this.genASIGroupModel();

        console.log(asiGroupModel);
    }

    genASIGroupModel() {
        let text = "";

        //Add some static header stuff
        text += '<?xml version="1.0" encoding="UTF-8" standalone="true"?>\n';
        text += '<list  version="9.0.0" minorVersion="26" exportUser="ADMIN" exportDateTime="';
        //Fill in date here
        text += '08/16/2019 11:56 AM';
        text += '" description="null">\n';
        text += '<asiGroup>';
        text += '<appSpecInfoGroupCode>';
        text += this.props.data.CF.group_code;
        text += '</appSpecInfoGroupCode>';
        text += '<r1CheckboxGroup>APPLICATION</r1CheckboxGroup>';
        text += '<servProvCode>';
        text += this.props.data.GRD.svp;
        text += '</servProvCode>';
        text += '<asiModels>';

        for (let i in this.props.data.CF.subgroups) {
            let sg = this.props.data.CF.subgroups[i].subgroup;
            for (let f in this.props.data.CF.subgroups[i].fields) {
                let field = this.props.data.CF.subgroups[i].fields[f];
                text += '<asiModel>';
                text += '<r1CheckboxCode>';
                text += sg;
                text += '</r1CheckboxCode>';
                text += '<r1CheckboxDesc>';
                text += field.label;
                text += '</r1CheckboxDesc>';
                text += '<r1CheckboxGroup>APPLICATION</r1CheckboxGroup>';
                text += '<r1CheckboxType>';
                text += field.type;
                text += '</r1CheckboxType>';
                text += '<servProvCode>';
                text += this.props.data.GRD.svp;
                text += '</servProvCode>';
                //YOU LEFT OFF HERE NICK!

                text += '<asiModel>';
            }
        }

        text += '</asiModels>';

        return text;
    }

    render() {
        return (
            <React.Fragment>
                <Card.Header>
                    <strong>{this.props.title}</strong>
                </Card.Header>
                <Card.Body>
                    <Button onClick={() => this.bigRedButton()}>Generate & Download</Button>
                </Card.Body>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    data: state
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(FIN);
