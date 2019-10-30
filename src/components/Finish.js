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
        let zip = new jszip();

        //Genereate ASIGroupModel
        let asiGroupModel = this.genASIGroupModel();
        zip.file("ASIGroupModel.xml", asiGroupModel);

        //Genereate ASIGroupModel
        let smartChoice = this.genSmartChoice();
        zip.file("SmartChoiceGroupModel.xml", smartChoice);

        //Genereate StatusGroupModel
        let statusGroup = this.genStatusModel();
        zip.file("ApplicationStatusGroupModel.xml", statusGroup);

        //Gen Fee Schedule XML
        let feeSchedule = this.genFeeSchedule();
        zip.file("RefFeeScheduleModel.xml", feeSchedule);

        //Gen SDD lists
        let sharedDropDownList = this.genSharedDropdwnLists();
        zip.file("SharedDropDownListModel.xml", sharedDropDownList);

        //Gen CapTypeModel
        let capTypeModel = this.genCapType();
        zip.file("CapTypeModel.xml", capTypeModel);

        //Create XML files and then package those into a jszip
        //Create a placeholder link element to download the zip and then
        // force the application to click this link
        zip.generateAsync({type: "blob"}).then(content => {
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
        //$$$ZACH$$$
        //Handled 10-10-2019
        let text = "";
        let today = new Date();
        text += '<auditModel><auditDate>';
        text += today.toISOString();
        text += '</auditDate><auditID>ADMIN</auditID><auditStatus>A</auditStatus></auditModel>';
        return text
    }
    makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

    genServProvCode()
    {
        let text ="";
        text += '<serviceProviderCode>';
        text += this.props.data.GRD.svp;
        text += '</serviceProviderCode>';
        return text;
    }
    debugObject(object) {
        var output = '';
        for (let property in object) {
            output += property + ': ' + object[property];
        }
        console.log(output);
    }

    //Generate the cap type model
    genCapType() {
        let text = "";
        let counter = 1;

        text += this.genTopBlurb();
        text += '<capType refId="'+counter+'@CapTypeModel">';
        counter++;
        text += "<serviceProviderCode>"+this.props.data.GRD.svp+"</serviceProviderCode>";
        text += "<group>"+this.props.data.GRD.module+"</group>";
        text += "<type>"+this.props.data.GRD.type+"</type>";
        text += "<subType>"+this.props.data.GRD.sub_type+"</subType>";
        text += "<category>"+this.props.data.GRD.category+"</category>";
        text += "<alias>"+this.props.data.GRD.alias+"</alias>";
        //Moved link to status' later
        text += "<asChildOnly>N</asChildOnly>";
        text += this.genAuditModel();

        //These are some lines about ACA, GIS, and Asset models
        text += "<capTypeACAModel>";
        text += "<feeCalcFactor>H</feeCalcFactor>";
        text += "<isIssue>N</isIssue>";
        text += "<isRenewal>N</isRenewal>";
        text += "<searchableInACA>Y</searchableInACA>";
        text += "</capTypeACAModel>";
        text += "<capTypeAssetModel>";
        text += "<estProdUnits>0.0</estProdUnits>";
        text += "<valueRequired>N</valueRequired>";
        text += "</capTypeAssetModel>";
        text += "<capTypeGISModel>";
        text += "<copyAllAssociatedAPO>N</copyAllAssociatedAPO>";
        text += "</capTypeGISModel>";

        //CapType Mask Model (UPDATE ONCE MASK IS ADDED!)
        text += "<capTypeMaskModel>";
        text += "<capMaskName>"+
                this.props.data.GRD.module +"/"+
                (this.props.data.GRD.type === "NA" ? "*" : this.props.data.GRD.type) +"/"+
                (this.props.data.GRD.sub_type === "NA" ? "*" : this.props.data.GRD.sub_type) +"/"+
                (this.props.data.GRD.category === "NA" ? "*" : this.props.data.GRD.category) +"</capMaskName>";
        text += "<capkeyMaskName>Default</capkeyMaskName>";
        text += "<partialAltIdMask>Default</partialAltIdMask>";
        text += "<temporaryAltIdMask>Default</temporaryAltIdMask>";
        text += "</capTypeMaskModel>";

        //Some more Static text?
        text += "<expirationCode>NONE</expirationCode>";
        text += "<feeScheduleName>NONE</feeScheduleName>";
        text += "<isRenewalOverride>N</isRenewalOverride>";
        text += "<isSearchable>Y</isSearchable>";

        text += "<moduleName>"+this.props.data.GRD.module+"</moduleName>"

        text += "<resId>59952</resId>";
        text += "<udCode3>APNANANA</udCode3>";
        text += "<capTypeI18NModels/>";
        text += "<capTypeRelationList/>";

        text += "<capTypeRelationModel>";
        text += "<capTypeRelations/>";
        text += "<category>"+this.props.data.GRD.category+"</category>";
        text += "<group>"+this.props.data.GRD.module+"</group>";
        text += "<serviceProviderCode>"+this.props.data.GRD.svp+"</serviceProviderCode>";
        text += "<subType>"+this.props.data.GRD.sub_type+"</subType>";
        text += "<type>"+this.props.data.GRD.type+"</type>";
        text += "</capTypeRelationModel>";

        text += "<capTypeSecurityModel>";
        text += "<capTypeSecurityPolicyModels/>";
        text += "<capTypeSecurityStatusPolicyModels/>";
        text += "<category>"+this.props.data.GRD.category+"</category>";
        text += "<group>"+this.props.data.GRD.module+"</group>";
        text += "<serviceProviderCode>"+this.props.data.GRD.svp+"</serviceProviderCode>";
        text += "<subType>"+this.props.data.GRD.sub_type+"</subType>";
        text += "<type>"+this.props.data.GRD.type+"</type>";
        text += "</capTypeSecurityModel>";

        //Trying to omit this tag buy using an empty attribute
        text += "<captypeStandardComment/>";
        // <captypeStandardComment>
        //     <auditModel>
        //         <auditDate>2019-05-31T12:49:20-04:00</auditDate>
        //         <auditID>ADMIN</auditID>
        //         <auditStatus>A</auditStatus>
        //     </auditModel>
        //     <category>NA</category>
        //     <entityData4CapType>Buildingu266BExemption Requestu266BNAu266BNA</entityData4CapType>
        //     <group>Building</group>
        //     <serviceProviderCode>PARTNER</serviceProviderCode>
        //     <subType>NA</subType>
        //     <type>Exemption Request</type>
        //     <xcommentGroupEntitys/>
        // </captypeStandardComment>

        text += '<citizenAccessModel refId="'+counter+'@CapTypeCitizenAccessModel">';
        counter++;
        text += "<category>"+this.props.data.GRD.category+"</category>";
        text += "<group>"+this.props.data.GRD.module+"</group>";
        text += "<refXEntityPermissionModels/>";
        text += "<serviceProviderCode>"+this.props.data.GRD.svp+"</serviceProviderCode>";
        text += "<subType>"+this.props.data.GRD.sub_type+"</subType>";
        text += "<type>"+this.props.data.GRD.type+"</type>";
        text += "</citizenAccessModel>";

        text += "<isCheckedLiscenedVerification>Y</isCheckedLiscenedVerification>";
        text += "<isCloneOptionSelected>Y</isCloneOptionSelected>";
        text += "<refLookupTables/>";

        text += "<postSubmission4ACAModels/>";
        text += "<recordTypeString>"+this.props.data.GRD.module+"/"+this.props.data.GRD.type+"/"+this.props.data.GRD.sub_type+"/"+this.props.data.GRD.category+"</recordTypeString>";
        text += "<refAuditFrequencyModels/>";
        text += "<referenceLicenseVerificationModels/>";
        text += "<stdConditionCapTypes/>";

        if (this.props.data.STAT.group_code) {
            text += "<appStatusGroupCode>"+this.props.data.STAT.group_code+"</appStatusGroupCode>";
        }
        if (this.props.data.IF.group_code) {
            text += "<smartChoiceCode>"+this.props.data.IF.group_code+"</smartChoiceCode>";
        }
        if (this.props.data.CF.group_code) {
            text += "<specInfoCode>"+this.props.data.CF.group_code+"</specInfoCode>";
        }
        if (this.props.data.CF.group_code) {
            text += "<specInfoCode>"+this.props.data.CF.group_code+"</specInfoCode>";
        }
        if (this.props.data.FEE.code) {
            text += "<feeScheduleName>"+this.props.data.FEE.code+"</feeScheduleName>";
        }
        
        //Process Code?  This is the name of something (I assume workflow)
        //This is workflow, set to NONE, MUST BE DONE IN ACCELA
        text += "<processCode>NONE</processCode>";
        text += "<inspectionGroupCode>NONE</inspectionGroupCode>";

        text += "</capType>";
        text += "</list>";

        return text;
    }

    //Generate the shared Dropdown Lists
    genSharedDropdwnLists() {
        let text = "";
        let counter = 12746;

        text += this.genTopBlurb();
        for (let s in this.props.data.SDL) {
            let list = this.props.data.SDL[s];
            text += "<sharedDropDownListModel>";
            text += "<name>";
            text += list.name;
            text += "</name>";
            text += this.genServProvCode();
            text += this.genAuditModel();
            text += "<description></description>";
            text += "<sharedDropDownList>";
            let order = 0;
            for (let i in list.items) {
                let item = list.items[i];
                text += "<sharedDropDownValue>";
                text += "<bdvSeqNbr>"+counter+"</bdvSeqNbr>";
                counter++;
                text += this.genServProvCode();
                text += this.genAuditModel();
                text += "<bizdomain>"+ list.name +"</bizdomain>";
                text += "<bizdomainValue>"+item+"</bizdomainValue>";
                text += "<sortOrder>"+order+"</sortOrder>";
                order += 10;
                text += "<standardChoiceValueI18NModels/>";
                text += "<valueDesc></valueDesc>";
                text += "</sharedDropDownValue>";
            }
            text += "</sharedDropDownList>";
            text += "<type>ShareDropDown</type>";
            text += "</sharedDropDownListModel>";
        }
        text += "</list>";
        return text;
    }

    //Generate the fee schedule xml
    genFeeSchedule() {
        let text = "";
        let counter = 1;
        let PAYMENT_DONE_FLAG = 0;

        text += this.genTopBlurb();
        text += '<refFeeSchedule refId="';
        text += counter + "@";
        counter++;
        text += 'RefFeeScheduleModel">';
        text += this.genServProvCode();
        text += "<feeScheduleName>" + this.props.data.FEE.code + "</feeScheduleName>";
        text += "<feeScheduleVersion>" + this.props.data.FEE.version + "</feeScheduleVersion>";
        text += this.genAuditModel();
        let ed = this.props.data.FEE.effective ? new Date(this.props.data.FEE.effective): new Date();
        text += "<effDate>" + ed.toISOString() + "</effDate>";
        text += "<refFeeItemModels>";
        for (let f in this.props.data.FEE.fees) {
            let fee = this.props.data.FEE.fees[f];
            text += '<refFeeItem refId="';
            text += counter + "@";
            counter++;
            text += 'RefFeeItemModel">';
            text += this.genServProvCode();
            text += "<feeScheduleName>" + this.props.data.FEE.code + "</feeScheduleName>";
            text += "<feeScheduleVersion>" + this.props.data.FEE.version + "</feeScheduleVersion>";

            text += "<feeCod>" + fee.code + "</feeCod>";
            text += "<paymentPeriod>FINAL</paymentPeriod>";
            text += "<acaRequiredFlag>N</acaRequiredFlag>";
            text += this.genAuditModel();
            text += "<autoAssessFlag>" + (fee.aa ? 'Y': 'N') + "</autoAssessFlag>";
            text += "<autoInvoicedFlag>" + (fee.ai ? 'Y': 'N') + "</autoInvoicedFlag>";
            text += "<calProc>CONSTANT</calProc>";
            text += "<comments></comments>";
            //NOT SURE WHAT THIS IS
            text += "<crDr>D</crDr>";

            //This the ACA flag
            text += "<defaultFlag>" + fee.aca + "</defaultFlag>";

            text += "<display>"+ fee.order +"</display>";
            text += "<displayOrder>"+ fee.order +"</displayOrder>";
            text += "<feeACAParticalPayment>N</feeACAParticalPayment>";
            text += "<feeAllocationType>NONE</feeAllocationType>";
            text += "<feeDecisionModel/>";
            text += "<feeDes></feeDes>";
            text += "<refFeeItemI18NModels/>";
            text += "<formula>"+fee.amount+"</formula>";
            text += "<negativeFeeFlag>N</negativeFeeFlag>";
            text += "<netFeeFlag>N</netFeeFlag>";
            text += "<refFeeCalcModels/>";
            if (!PAYMENT_DONE_FLAG) {
                PAYMENT_DONE_FLAG = counter;
                text += '<refPaymentPeriodModel refId="';
                text += counter + "@";
                counter++;
                text += 'RefPaymentPeriodModel">';
                text += "<gfFeePeriod>FINAL</gfFeePeriod>";
                text += this.genServProvCode();
                text += this.genAuditModel();
                text += "<displayOrder>"+ fee.order +"</displayOrder>";
                //Not sure if these next two lines are necessary
                text += "<refPaymentPeriodI18NModels/>";
                text += "<resId>136</resId>";

                text += "</refPaymentPeriodModel>";
            } else {
                text += '<refPaymentPeriodModel refFlag="Y" refId="'+PAYMENT_DONE_FLAG+'@RefPaymentPeriodModel"/>';
            }
            text += "<roundFeeFlag>N</roundFeeFlag>";
            text += "<roundFeeType>UP</roundFeeType>";
            text += "<udes>Each</udes>";
            text += "</refFeeItem>";
        }
        text += "</refFeeItemModels>";
        //The next 4 lines are filler
        text += "<feeScheduleAlias></feeScheduleAlias>";
        text += "<feeScheduleComment></feeScheduleComment>";
        text += "<refFeeScheduleI18NModels/>";
        text += "<feeScheduleModuleModels/>";
        //This is just taken form a sample XML file
        text += "<pageStatusModels>";
        text += "<pageStatus>";
        text += "<importSubItemDisableFlag>false</importSubItemDisableFlag>";
        text += "<modelProperty>class</modelProperty>";
        text += "<propertyName>feeScheduleName</propertyName>";
        text += "<selectFlag>true</selectFlag>";
        text += "<skipFlag>false</skipFlag>";
        text += "</pageStatus>";
        text += "</pageStatusModels>";
        text += "<refFeeItemgroups/>";

        //This closes the remainingtags from up top
        text += "</refFeeSchedule>";
        text += "</list>";

        return text;
    }

    //this function will fill out the Status Model
    genStatusModel()
    {
        let text = "";
        text += this.genTopBlurb();
        text += '<applicationStatusGroup>';
        text += '<appStatusGroupCode>';
        text += this.props.data.STAT.group_code;
        text += '</appStatusGroupCode>';
        text += this.genServProvCode();
        text += '<appStatusGroupModels>';
        //start our WOOPY DOOPYING
        //i'll come back to this $$Zachary$$
        //I FIXED YAY
        let counter = 0;
        for  (let i in this.props.data.STAT.statuses)
        {
            let sg = this.props.data.STAT.statuses[i].subgroup;
            counter ++;
            let field = this.props.data.STAT.statuses[i];
            this.debugObject(this.props.data.STAT);
            text += '<appStatusGroupModel refId="';
            text += counter + "@";
            text += 'AppStatusGroupModel">';
            text += this.genServProvCode();
            text += '<appStatusGroupCode>';
            text += this.props.data.STAT.group_code;
            text += '</appStatusGroupCode>';
            text += '<status>';
            text += field.status;
            text += '</status>';
            text += '<appStatusGroupI18Ns/>';
            text += this.genAuditModel();
            text += '<statusType>';
            text += field.backendStatus;
            text += '</statusType>';
            text += '</appStatusGroupModel>';
        }
        text += '</appStatusGroupModels>';
        text += '<pageStatusModels><pageStatus><importSubItemDisableFlag>false</importSubItemDisableFlag><modelProperty>class</modelProperty> <propertyName>appStatusGroupCode</propertyName><selectFlag>true</selectFlag><skipFlag>false</skipFlag></pageStatus></pageStatusModels>';
        text += '</applicationStatusGroup>';
        text += '</list>';

        return text
    }
    genASIGroupModel() {
        let text = "";

        text += this.genTopBlurb();
        let counterOopsy = 0;
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
                //ZPM put this in cause if user's didn't fill that field out we'd get mad errors:
                counterOopsy ++;
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
                text += (field.required === true) ? "Y" : "N";
                text += '</r1AttributeValueReqFlag>';
                text += '<r1CheckboxInd>'
                text += field.type;
                text += '</r1CheckboxInd>';
                //Display Order
                text += '<r1DisplayOrder>';
                text += (field.disp_order) ? field.disp_order : counterOopsy;
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

        //Now add shared Dropdowns
        let lists = [];
        for (let s in this.props.data.SDL) {
            let list = this.props.data.SDL[s];
            if (list.link) lists.push(s);
        }
        if (lists.length > 0) {
            let counter = 1;
            text += "<sharedDropDownModels>";
            for (let l in lists) {
                let list = this.props.data.SDL[lists[l]];
                let cf_group = "";
                let cf_field = "";
                for (let g in this.props.data.CF.subgroups) {
                    let group = this.props.data.CF.subgroups[g];
                    for (let f in group.fields) {
                        if (f === list.link) {
                            cf_group = group;
                            cf_field = group.fields[f];
                        }
                    }
                }

                console.log(list)
                console.log(cf_group);
                console.log(cf_field);

                text += '<sharedDropDownModel refId="';
                text += counter;
                counter++;
                text += '@SharedDropDownModel">';
                text += "<sequenceNbr>255</sequenceNbr>";
                text += this.genServProvCode();
                text += this.genAuditModel();
                text += "<level1>"+this.props.data.CF.group_code+"</level1>";
                text += "<level2>"+cf_group.subgroup+"</level2>";
                text += "<level3>APPLICATION</level3>";
                text += "<level4>"+cf_field.label+"</level4>";
                text += "<relationType>APPLICATION_SPECIFIC_INFO</relationType>";
                text += "<standardChoiceName>"+list.name+"</standardChoiceName>";
                text += "</sharedDropDownModel>";
            }
            text += "</sharedDropDownModels>";
        }

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
            //$$$ZACH$$$

            text += '<smartChoiceOptionModels/>';
            text += '</smartChoice>';
        }

        text += '</smartChoiceModels>';
        text += '<structureTypeModels/></smartChoiceGroup>';
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
