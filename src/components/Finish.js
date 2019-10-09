import React, { Component } from 'react';
import { connect } from "react-redux";
import jszip from "jszip";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import intake_settings_raw from "./intake_settings.js";
let intake_settings = intake_settings_raw.intake_settings;

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

    //This function is used to fill in the audit model
    genAuditModel() {
        return '<auditModel><auditDate>2016-02-19T00:58:30-05:00</auditDate><auditID>ADMIN</auditID><auditStatus>A</auditStatus></auditModel>'
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
                text += (field.aca_disp === true) ? "Y" : "N";
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
        text += '<groupCode>'+this.props.data.IF.group_code.replace(/\W/g, '_')+'</groupCode>';
        text += '<serviceProviderCode>'+this.props.data.GRD.svp+'</serviceProviderCode>';
        text += '<smartChoiceModels>';

        let fields = Object.keys(intake_settings);
        let settings = this.props.data.IF.settings;
        let modified_fields = Object.keys(settings).map(s => {
            return settings[s].label;
        });
        for (let f in fields) {
            text += '<smartChoice>';
            text += '<functionName>';
            //Change the names to accela names :/
            switch (fields[f]) {
                case "Additional Information": {
                    text += "ADDITIONAL INFO";
                    break;
                }
                case "Address": {
                    text += "ADDRESS";
                    break;
                }
                case "Applicant": {
                    text += "APPLICANT";
                    break;
                }
                case "Custom Fields": {
                    text += "APPLICATION SPECIFIC INFO";
                    break;
                }
                case "Application Status": {
                    text += "APPLICATION STATUS";
                    break;
                }
                case "Asset": {
                    text += "ASSET";
                    break;
                }
                case "Associated GIS Features": {
                    text += "ASSOCIATED GIS FEATURES";
                    break;
                }
                case "Custom Lists": {
                    text += "ATTACHED TABLES";
                    break;
                }
                case "CAP Detail": {
                    text += "CAPDETAIL";
                    break;
                }
                case "Comments": {
                    text += "COMMENTS";
                    break;
                }
                case "Complainant Info": {
                    text += "COMPLAINANT INFO";
                    break;
                }
                case "Complaint Info": {
                    text += "COMPLAINT INFO";
                    break;
                }
                case "Contact 1": {
                    text += "CONTACT1";
                    break;
                }
                case "Contact 2": {
                    text += "CONTACT2";
                    break;
                }
                case "Contact 3": {
                    text += "CONTACT3";
                    break;
                }
                case "Continuing Education": {
                    text += "CONTINUINGEDUCATION";
                    break;
                }
                case "Documents": {
                    text += "DOCUMENT";
                    break;
                }
                case "Education": {
                    text += "EDUCATION";
                    break;
                }
                case "Establishment": {
                    text += "ESTABLISHMENT INFO";
                    break;
                }
                case "Event": {
                    text += "EVENT";
                    break;
                }
                case "Examination": {
                    text += "EXAMINATION";
                    break;
                }
                case "Licensed Professional": {
                    text += "LICENSED PROFESSIONAL";
                    break;
                }
                case "Multiple Contacts": {
                    text += "MULTIPLE_CONTACTS";
                    break;
                }
                case "Owner": {
                    text += "OWNER";
                    break;
                }
                case "Parcel": {
                    text += "PARCEL";
                    break;
                }
                case "Structure": {
                    text += "STRUCTURE INFO";
                    break;
                }
                default: break;
            }
            text += '</functionName>';
            text += '<groupName>'+this.props.data.IF.group_code.replace(/\W/g, '_')+'</groupName>';
            text += '<serviceProviderCode>'+this.props.data.GRD.svp+'</serviceProviderCode>';
            text += this.genAuditModel();

            let tags;
            if (modified_fields.includes(fields[f])) {
                //I am so sorry for anyone who has to try and real this line of Code...
                //Basically its cross referencing the two lists to find the tags
                tags = settings[Object.keys(settings).filter(item => {
                    return settings[item].label === fields[f];
                })[0]];
            } else {
                tags = intake_settings[fields[f]];
            }
            for (let t in tags) {
                console.log(t);
                switch (t) {
                    case "display": {
                        text += '<displayFlg>';
                        text += (tags[t] === true) ? "Y" : "N";
                        text += '</displayFlg>';
                        break;
                    }
                    case "required": {
                        text += '<requiredFlg>';
                        text += (tags[t] === true) ? "Y" : "N";
                        text += '</requiredFlg>';
                        break;
                    }
                    case "validate": {
                        text += '<validateFlg>';
                        text += (tags[t] === true) ? "Y" : "N";
                        text += '</validateFlg>';
                        break;
                    }
                    case "order": {
                        text += '<displayOrder>';
                        text += tags[t];
                        text += '</displayOrder>';
                        break;
                    }
                    case "type": {
                        text += '<defaultValue>';
                        text += tags[t];
                        text += '</defaultValue>';
                        break;
                    }
                    default: break;
                }
            }
            //handle display buttons!
            //if lp and owner: 11
            // if owner only: 10
            // if lp only: 01
            // if neither: 00
            // I think this is how this works,
            //I did not have enough example to know completly

            text += '<smartChoiceOptionModels/>';
            text += '</smartChoice>';
        }


        text += '<structureTypeModels/></smartChoiceGroup>';
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
