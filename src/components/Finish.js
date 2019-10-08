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
        text += '<serviceProviderCode>';
        text += this.props.data.GRD.svp;
        text += '</serviceProviderCode>';
        text += '<asiModels>';

        for (let i in this.props.data.CF.subgroups) {
            let sg = this.props.data.CF.subgroups[i].subgroup;
            for (let f in this.props.data.CF.subgroups[i].fields) {
                //ZPM: I made some updates here; specifically with how checkboxCode is called again in the XML for individual ASI Models.
                //ZPM: I also adjusted to close out /asiModel.
                let field = this.props.data.CF.subgroups[i].fields[f];
                text += '<asiModel>';
                text += '<r1CheckboxCode>';
                text += this.props.data.CF.group_code;
                text += '</r1CheckboxCode>';
                text += '<r1CheckboxDesc>';
                text += field.label;
                text += '</r1CheckboxDesc>';
                text += '<r1CheckboxGroup>APPLICATION</r1CheckboxGroup>';
                text += '<r1CheckboxType>';
                text += sg;
                text += '</r1CheckboxType>';
                text += '<servProvCode>';
                text += this.props.data.GRD.svp;
                text += '</servProvCode>';
                //Drop downs; assume not handled in initial implementation.
                text += '<asiDropdownModels/>';
                //Display length; assume not hanlded in initial implementation.
                text += '<displayLength>0</displayLength>';
                //No clue what this does: 
                text += '<locationQueryFlag>N</locationQueryFlag>';
                //max length; assume not handled in iniital implementation
                text += '<maxLength>0</maxLength>';
                text += '<r1AttributeValueReqFlag>'; 
                if(field.required == true)
                {
                    text += 'Y';

                }
                else 
                {
                    text += 'N';
                }
                text += '</r1AttributeValueReqFlag>';
                text += '<r1CheckboxInd>'
                text += field.type;
                text += '</r1CheckboxInd>';
                //Display Order
                text += '<r1DisplayOrder>'; 
                text += field.disp_order;
                text += '</r1DisplayOrder>';
                //rest of this i don't think i care about for now.
                text +='<r1ReqFeeCalc>N</r1ReqFeeCalc>';
                text +='<r1SearchableFlag>N</r1SearchableFlag>';
                text +='<r1SearchableForAca>N</r1SearchableForAca>';
                text +='<r1SupervisorEditOnlyFlag>N</r1SupervisorEditOnlyFlag>';
                text +='<recDate>2019-10-07T09:52:29-04:00</recDate>';
                text +='<recFulNam>ADMIN</recFulNam>';
                text +='<recStatus>A</recStatus>';
                text +='<refAppSpecInfoFieldI18NModels/>';
                text +='<vchDispFlag>'
                if(field.aca_disp == true)
                {
                    text += 'Y';
                }
                else 
                {
                    text += 'N';
                }
                text += '</vchDispFlag>';
                text += '</asiModel>';

                //YOU LEFT OFF HERE NICK! jk i finished it up 
            }
        }
        text += '</asiModels>';
        text += '</asiGroup>';
        text += '</list>';
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
