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

        //Gen Mask Model
        let maskModel = this.genMaskModel();
        zip.file("ReferenceMaskModel.xml", maskModel);

        //Gen Sequence Model
        let sequenceModel = this.genSequenceModel();
        zip.file("SequenceModel.xml", sequenceModel);

        //Create XML files and then package those into a jszip
        //Create a placeholder link element to download the zip and then
        // force the application to click this link
        zip.generateAsync({type: "blob"}).then(content => {
            let element = document.createElement("a");
            element.href = URL.createObjectURL(content);
            element.download = "sCube_"+this.props.data.id+".zip";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
        })

        //Gen Record Summary
        let summary = this.genRecordSummary();
        let element = document.createElement("a");
        let file = new Blob([summary], {type: "text/plain"});
        element.href = URL.createObjectURL(file);
        element.download = this.props.data.GRD.alias + "_Summary.html";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();

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

    genMaskModel() {
        let text = "";
        text += this.genTopBlurb();
        //So I just discovered multi-line string and im kinda pressed...
        text += `<mask>
            <name>Default</name>
            <serviceProviderCode>PARTNER</serviceProviderCode>
            <type>Cap Key</type>
            <auditModel>
                <auditDate>2017-04-05T10:23:01-04:00</auditDate>
                <auditID>SYSTEM</auditID>
                <auditStatus>A</auditStatus>
            </auditModel>
            <description></description>
            <maxLength>17</maxLength>
            <minLength>17</minLength>
            <pattern>$$yy$$CAP-00000-$$SEQ05$$</pattern>
            <radixValue>36</radixValue>
            <seqName>Default</seqName>
        </mask>
        <mask>
            <name>Default</name>
            <serviceProviderCode>PARTNER</serviceProviderCode>
            <type>Partial CAP ID</type>
            <auditModel>
                <auditDate>2017-01-12T11:55:45-05:00</auditDate>
                <auditID>ADMIN</auditID>
                <auditStatus>A</auditStatus>
            </auditModel>
            <description>Mask Definition for Partial CAP ID</description>
            <maxLength>30</maxLength>
            <minLength>1</minLength>
            <pattern>$$yy$$EST-$$SEQ06$$</pattern>
            <radixValue>10</radixValue>
            <seqName>Default</seqName>
        </mask>
        <mask>
            <name>Default</name>
            <serviceProviderCode>PARTNER</serviceProviderCode>
            <type>Temporary CAP ID</type>
            <auditModel>
                <auditDate>2017-01-12T11:55:45-05:00</auditDate>
                <auditID>ADMIN</auditID>
                <auditStatus>A</auditStatus>
            </auditModel>
            <description>Mask Definition for Temporary CAP ID</description>
            <maxLength>30</maxLength>
            <minLength>1</minLength>
            <pattern>$$yy$$TMP-$$SEQ06$$</pattern>
            <radixValue>10</radixValue>
            <seqName>Default</seqName>
        </mask>`;

        text += "<mask>";
        text += "<name>"+
                this.props.data.GRD.module +"/"+
                (this.props.data.GRD.type === "NA" ? "*" : this.props.data.GRD.type) +"/"+
                (this.props.data.GRD.sub_type === "NA" ? "*" : this.props.data.GRD.sub_type) +"/"+
                (this.props.data.GRD.category === "NA" ? "*" : this.props.data.GRD.category) +"</name>";
        text += "<serviceProviderCode>"+this.props.data.GRD.svp+"</serviceProviderCode>";
        text += "<type>Cap ID</type>";
        text += this.genAuditModel();
        text += "<description></description>";
        text += "<maxLength>30</maxLength>";
        text += "<minLength>1</minLength>";
        text += "<pattern>"+this.props.data.GRD.pattern+"</pattern>";
        text += "<radixValue>10</radixValue>";
        text += "<seqName>"+
                this.props.data.GRD.module +"/"+
                (this.props.data.GRD.type === "NA" ? "*" : this.props.data.GRD.type) +"/"+
                (this.props.data.GRD.sub_type === "NA" ? "*" : this.props.data.GRD.sub_type) +"/"+
                (this.props.data.GRD.category === "NA" ? "*" : this.props.data.GRD.category) +"</seqName>";
        text += "</mask>";

        text += "</list>"
        return text;
    }

    genSequenceModel() {
        let text = "";

        text += this.genTopBlurb();
        text += '<sequence refId="1@SequenceModel">';
        text += "<name>"+
                this.props.data.GRD.module +"/"+
                (this.props.data.GRD.type === "NA" ? "*" : this.props.data.GRD.type) +"/"+
                (this.props.data.GRD.sub_type === "NA" ? "*" : this.props.data.GRD.sub_type) +"/"+
                (this.props.data.GRD.category === "NA" ? "*" : this.props.data.GRD.category) +"</name>";
        text += "<serviceProviderCode>"+this.props.data.GRD.svp+"</serviceProviderCode>";
        text += "<type>Cap ID</type>";
        text += this.genAuditModel();
        text += `<cacheSize>1</cacheSize>
                <description></description>
                <increaseValue>1</increaseValue>
                <intervalType>CY</intervalType>
                <minValue>1</minValue>
                <resetAction>E</resetAction>`;
        let pattern_size = parseInt((/\$\$SEQ(\d+)\$\$/g).exec(this.props.data.GRD.pattern)[1]);
        if (!pattern_size) pattern_size = 5;
        text += "<resetValue>"+"9".repeat(pattern_size)+"</resetValue>";

        text += "<sequenceIntervalModels>";
        text += "<sequenceInterval>";
        text += "<intervalName>"+
                this.props.data.GRD.module +"/"+
                (this.props.data.GRD.type === "NA" ? "*" : this.props.data.GRD.type) +"/"+
                (this.props.data.GRD.sub_type === "NA" ? "*" : this.props.data.GRD.sub_type) +"/"+
                (this.props.data.GRD.category === "NA" ? "*" : this.props.data.GRD.category) +"</intervalName>";
        text += "<sequenceName>"+
                this.props.data.GRD.module +"/"+
                (this.props.data.GRD.type === "NA" ? "*" : this.props.data.GRD.type) +"/"+
                (this.props.data.GRD.sub_type === "NA" ? "*" : this.props.data.GRD.sub_type) +"/"+
                (this.props.data.GRD.category === "NA" ? "*" : this.props.data.GRD.category) +"</sequenceName>";
        text += "<sequenceType>Cap ID</sequenceType>";
        text += "<serviceProviderCode>"+this.props.data.GRD.svp+"</serviceProviderCode>";
        text += this.genAuditModel();
        text += "<lastSequenceNbr>0</lastSequenceNbr>";
        text += "</sequenceInterval>";
        text += "</sequenceIntervalModels>";
        text += "</sequence>";
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
            //let sg = this.props.data.STAT.statuses[i].subgroup;
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

    genRecordSummary() {
        let text = "";
        text += "<html>";
        text += "<head>";
        text += "<title>";
        text += this.props.data.GRD.alias+" - Record Summary";
        text += "</title>";
        text += "</head>";
        text += '<body style="width:8in">';
        text += '<div>'
        text += '<img src="https://www.scubeenterprise.com/images/logo.png" alt="[s]Cube" style="vertical-align:middle;">';
        text += '<h1 style="vertical-align:middle; display:inline;">';
        text += '&nbsp;&nbsp;&nbsp;'+this.props.data.GRD.alias+' - Record Summary';
        text += '</h1>';
        text += '</div>';
        text += '<hr/>';
        text += '<div style="padding:0 0 10px 10px">';
        text += '<h2>General Record Information</h2>';
        text += '<table>';
        text += '<tr>';
        text += '<td>Record Alias: </td>';
        text += '<td>'+this.props.data.GRD.alias+'</td>';
        text += '</tr>';
        text += '<tr><td>&nbsp;</td></tr>';
        text += '<tr>';
        text += '<td>Module: </td>';
        text += '<td>'+this.props.data.GRD.module+'</td>';
        text += '</tr>';
        text += '<tr>';
        text += '<td>Type: </td>';
        text += '<td>'+this.props.data.GRD.type+'</td>';
        text += '</tr>';
        text += '<tr>';
        text += '<td>SubType: </td>';
        text += '<td>'+this.props.data.GRD.sub_type+'</td>';
        text += '</tr>';
        text += '<tr>';
        text += '<td>Category: </td>';
        text += '<td>'+this.props.data.GRD.category+'</td>';
        text += '</tr>';
        text += '<tr><td>&nbsp;</td></tr>';
        text += '<tr>';
        text += '<td>Record Structure:&nbsp;&nbsp;</td>';
        text += '<td>'+this.props.data.GRD.module+'/'+this.props.data.GRD.type+'/'+this.props.data.GRD.sub_type+'/'+this.props.data.GRD.category+'</td>';
        text += '</tr>';
        text += '<tr><td>&nbsp;</td></tr>';
        text += '<tr>';
        text += '<td>Mask: </td>';
        text += '<td>'+this.props.data.GRD.pattern+'</td>';
        text += '</tr>';
        text += '<tr>';
        text += '<td>Example Mask: </td>';
        let pattern_size = parseInt((/\$\$SEQ(\d+)\$\$/g).exec(this.props.data.GRD.pattern)[1]);
        if (!pattern_size) pattern_size = 5;
        text += '<td>'+this.props.data.GRD.pattern.replace(/\$\$SEQ(\d+)\$\$/, "0".repeat(pattern_size))+'</td>';
        text += '</tr>';
        text += '</table>';
        text += '</div>';
        //End of GRD

        //Custom Fields
        text += '<hr/>';
        text += '<div style="padding:0 0 10px 10px">';
        text += '<h2>Application Specific Information</h2>';
        text += '<p>This is the custom information that this record is able to track.</p>';
        for (let c in this.props.data.CF.subgroups) {
            text += '<h3>'+this.props.data.CF.group_code+' - '+this.props.data.CF.subgroups[c].subgroup+'</h3>';
            text += '<table style="width:100%">';
            text += '<tr>';
            text += '<td style="width:20%"><Strong>Field Name</Strong></td>';
            text += '<td style="width:20%"><Strong>Type</Strong></td>';
            text += '<td style="width:20%"><Strong>Required</Strong></td>';
            text += '<td style="width:20%"><Strong>ACA Mode</Strong></td>';
            text += '<td style="width:20%"><Strong>Display Order</Strong></td>';
            text += '</tr>';
            for (let f in this.props.data.CF.subgroups[c].fields) {
                let field = this.props.data.CF.subgroups[c].fields[f];
                let type = "";
                switch (field.type) {
                    case "1": {type = "Text"; break;}
                    case "2": {type = "Date"; break;}
                    case "3": {type = "Yes/No"; break;}
                    case "4": {type = "Number"; break;}
                    case "5": {type = "Dropdown List"; break;}
                    case "6": {type = "Text Area"; break;}
                    case "7": {type = "Time"; break;}
                    case "8": {type = "Money"; break;}
                    case "9": {type = "Checkbox"; break;}
                    default: break;
                }
                text += '<tr>';
                text += '<td>'+field.label+'</td>';
                text += '<td>'+type+'</td>';
                text += '<td>'+(field.requried ? "Y" : "N")+'</td>';
                text += '<td>'+(field.aca_disp ? "Y" : "N")+'</td>';
                text += '<td>'+field.disp_order+'</td>';
                text += '</tr>';
            }
            text += '</table>';
        }

        text += '</div>';
        text += '<hr/>';

        //Fees
        text += '<div style="padding:0 0 10px 10px">';
        text += '<h2>Fees</h2>';
        text += '<p>These are the fees that will be applicable from this record.</p>';
        text += '<h3 style="margin:0 0 10 0">'+this.props.data.FEE.code+'</h3>';
        text += '<h4 style="margin:0">Version: '+this.props.data.FEE.version+'</h4>';
        text += '<h4 style="margin:0 0 15 0">Effective: '+this.props.data.FEE.effective+'</h4>';
        text += '<table style="width:100%">';
        text += '<tr>';
        text += '<td style="width:16.66%"><Strong>Fee Code</Strong></td>';
        text += '<td style="width:16.66%"><Strong>Amount</Strong></td>';
        text += '<td style="width:16.66%"><Strong>Auto-Invoice</Strong></td>';
        text += '<td style="width:16.66%"><Strong>Auto-Assess</Strong></td>';
        text += '<td style="width:16.66%"><Strong>ACA Mode</Strong></td>';
        text += '<td style="width:16.66%"><Strong>Display Order</Strong></td>';
        text += '</tr>';
        for (let f in this.props.data.FEE.fees) {
            let fee = this.props.data.FEE.fees[f];
            text += '<tr>';
            text += '<td>'+fee.code+'</td>';
            text += '<td>'+fee.amount+'</td>';
            text += '<td>'+(fee.ai ? "Y" : "N")+'</td>';
            text += '<td>'+(fee.aa ? "Y" : "N")+'</td>';
            text += '<td>'+fee.aca+'</td>';
            text += '<td>'+fee.order+'</td>';
            text += '</tr>';
        }
        text += '</table>';
        text += '</div>';

        text += '<hr/>';

        //Statuses
        text += '<div style="padding:0 0 10px 10px">';
        text += '<h2>Statuses</h2>';
        text += "<p>Statuses are public facing entities that give a clear and concise answer as to where in the lifecycle a particular Accela Record stands. Status Groups allow us to assign a list of pre-defined statuses to a record. Below: 'Status' related to the actual public-facing verbiage 'Back-End Status' is what the database sees for a particular status; try to match your status to whichever back-end status that makes sense.</p>";
        text += '<h3 style="margin:0 0 10 0">'+this.props.data.STAT.group_code+'</h3>';
        text += '<table style="width:100%">';
        text += '<tr>';
        text += '<td style="width:16.66%"><Strong>Status</Strong></td>';
        text += '<td style="width:16.66%"><Strong>Back-End Status</Strong></td>';
        text += '</tr>';
        for (let s in this.props.data.STAT.statuses) {
            let status = this.props.data.STAT.statuses[s];
            text += '<tr>';
            text += '<td>'+status.status+'</td>';
            text += '<td>'+status.backendStatus+'</td>';
            text += '</tr>';
        }
        text += '</table>';
        text += '</div>';

        //Footer
        text += '<hr/>';
        text += '<table style="width:100%">';
        text += '<tr>';
        text += '<td>'+(new Date()).toUTCString()+'</td>';
        text += '<td>'+this.props.data.id+'</td>';
        text += '<td>Version: '+this.props.data.version+'</td>';
        text += '</tr>';
        text += '</table>';


        text += '</body>';
        text += '</html>';

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
