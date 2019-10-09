import React, { Component } from 'react';
import { connect } from "react-redux";
import jszip from "jszip";

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
        let zip = new jszip();

        //Genereate ASIGroupModel
        let asiGroupModel = this.genASIGroupModel();
        zip.file("ASIGroupModel.xml", asiGroupModel);
        console.log(asiGroupModel);

        //Genereate ASIGroupModel
        let smartChoice = this.genSmartChoice();
        zip.file("SmartChoiceGroupModel.xml", smartChoice);
        console.log(smartChoice);


        //Create XML files and then package those into a jszip
        //Create a placeholder link element to download the zip and then
        // force the application to click this link
        zip.generateAsync({type: "blob"}).then(content => {
            console.log(content);
            const element = document.createElement("a");
            element.href = URL.createObjectURL(content);
            element.download = "sCube_"+this.props.data.id+".zip";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
        })
    }

    genTopBlurb() {
        let text = "";
        let today = new Date();

        //Add some static header stuff
        text += '<?xml version="1.0" encoding="UTF-8" standalone="true"?>\n';
        text += '<list  version="9.0.0" minorVersion="26" exportUser="ADMIN" exportDateTime="';
        //Fill in date here
        let month = (1 + today.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        let day = today.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        let year = today.getFullYear();
        let hours = today.getHours();
        let min = today.getMinutes();
        min = min.length > 1 ? min : '0' + min;

        text += month + '/' + day + '/' + year + " ";
        text += (hours > 12) ? hours-12 : hours;
        text += ":" + min + " ";
        text += (hours > 12) ? "PM" : "AM";
        text += '" description="null">\n';

        return text;
    }

    genASIGroupModel() {
        let text = "";

        text += this.genTopBlurb();

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
                if(field.required === true)
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
                if(field.aca_disp === true)
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

    genSmartChoice() {
        let text = "";
        text += this.genTopBlurb();

        text += '<smartChoiceGroup refId="1@SmartChoiceGroupModel">';



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
