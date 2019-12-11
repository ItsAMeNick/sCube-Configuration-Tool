import _ from "lodash";
import uuidv1 from "uuid/v1";

import firestore from "./firestore.js";
import approved_users from "../components/approved_users.js"

const initialState = {
    id: uuidv1(),
    mode: false,
    loaded_file: "",
    version: "1-1",
    page: 0,
    notes: {},
    GRD: {
        svp: "",
        alias: "",
        agency: "",
        module: "",
        type: "",
        sub_type: "",
        category: "",
        pattern: "",
    },
    CF: {
        group_code: "",
        subgroups: {},
    },
    IF: {
        group_code: "",
        settings: {},
    },
    FEE: {
        code: "",
        version: "",
        effective: "",
        fees: {},
    },
    STAT: {
        group_code: "",
        statuses: {},
    },
    NOTE: {},
    INSP: {
        code: "",
        name: "",
        inspections: {},
        checklists: {},
        result_groups: {},
    },
    DOCS: {
        group: "",
        docs: {}
    },
    SDL: {}
};

const sCubeReducer = (state = initialState, action) => {
    switch (action.type) {
        case "dump_store": {
            console.log(state);
            return state;
        }

        case "update_mode": {
            let newState = _.cloneDeep(state);
            if (approved_users.emails.includes(action.payload)) {
                newState.mode = true;
            } else {
                newState.mode = false;
            }
            console.log(newState.mode);
            return newState;
        }

        case "save_state": {
            let newState = _.cloneDeep(state);
            newState.GRD.version = action.payload.version;
            //remove things not to be saved
            delete newState.mode;
            delete newState.loaded_file;

            // // Download things
            // let element = document.createElement("a");
            // let file = new Blob([JSON.stringify(newState)], {type: 'text/plain'});
            // element.href = URL.createObjectURL(file);
            // element.download = action.payload.filename + ".sCube";
            // document.body.appendChild(element); // Required for this to work in FireFox
            // element.click();

            // Firebase
            let doc = {
                Agency: newState.GRD.agency,
                Module: newState.GRD.module,
                Record_Alias: newState.GRD.alias,
                Record_ID: newState.GRD.alias,
                SVP: newState.GRD.svp,
                Version: newState.GRD.version,
                Version_ID: newState.id,
                data: JSON.stringify(newState),
                Time_Stamp: new Date().valueOf()
            }
            firestore.collection("sCube").add(doc)
            //console.log(doc);
            return newState;
        }

        case "load_state": {
            let newState = JSON.parse(action.payload)
            // Optional Page override, this line can be commented output
            // If commented out, loading a save will return a user to the page that
            // the app was saved on
            newState.page = 1;

            // Maintain the authentication status
            newState["mode"] = state.mode;

            // Generate a new ID for the version
            newState.id = uuidv1();

            //Update version
            let current = newState.version.split("-");
            newState.version = current[0] + "-" + (parseInt(current[1])+1);

            newState.loaded_file = "#" + newState.GRD.svp + "#" + newState.GRD.module + "#" + newState.GRD.alias + "#" + newState.id;
            window.location.hash = newState.loaded_file;

            return newState;
        }

        case "update_page_number": {
            let newState = _.cloneDeep(state);
            newState.page = action.payload;
            return newState;
        }

        case "update_page_data": {
            let newState = _.cloneDeep(state);
            newState[action.payload.page][action.payload.field] = action.payload.value;
            return newState;
        }

        case "update_CF_subgroup": {
            let newState = _.cloneDeep(state);
            newState.CF.subgroups[action.payload.subgroup].subgroup = action.payload.value;
            return newState;
        }

        case "update_CF_subgroup_field": {
            let newState = _.cloneDeep(state);
            newState.CF.subgroups[action.payload.subgroup].fields[action.payload.field][action.payload.label] = action.payload.value;
            return newState;
        }

        case "add_CF_subgroup": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.CF.subgroups[id] = {
                id: id,
                subgroup: "",
                fields: {}
            };
            return newState;
        }

        case "add_CF_subgroup_field": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.CF.subgroups[action.payload].fields[id] = {
                id: id,
                label: "",
                type: "",
                disp_order: "",
                required: "",
                aca_disp: "",
            };
            return newState;
        }

        case "del_CF_subgroup": {
            let newState = _.cloneDeep(state);
            delete newState.CF.subgroups[action.payload]
            return newState;
        }

        case "del_CF_subgroup_field": {
            let newState = _.cloneDeep(state);
            delete newState.CF.subgroups[action.payload.subgroup].fields[action.payload.field];
            return newState;
        }

        case "add_IF_setting": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.IF.settings[id] = {
                id: id,
                label: "",
            };
            return newState;
        }
        case "delete_IF_setting": {
            let newState = _.cloneDeep(state);
            delete newState.IF.settings[action.payload];
            return newState;
        }
        case "update_IF_code": {
            let newState = _.cloneDeep(state);
            newState.IF.group_code = action.payload;
            return newState;
        }
        case "update_IF_setting": {
            let newState = _.cloneDeep(state);
            newState.IF.settings[action.payload.id] = action.payload.value;
            return newState;
        }

        case "add_Fee": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.FEE.fees[id] = {
                id: id,
                code: "",
                amount: "",
                ai: true,
                aa: true,
                order: "",
                aca: "",
            };
            return newState;
        }
        case "update_Fee_schedule": {
            let newState = _.cloneDeep(state);
            newState.FEE[action.payload.id] = action.payload.value;
            return newState;
        }
        case "update_Fee": {
            let newState = _.cloneDeep(state);
            newState.FEE.fees[action.payload.id] = action.payload.value;
            return newState;
        }
        case "delete_Fee": {
            let newState = _.cloneDeep(state);
            delete newState.FEE.fees[action.payload];
            return newState;
        }

        case "add_doc": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.DOCS.docs[id] = {
                id: id,
                type: "",
                title: true,
                download: true,
                upload: true,
                delete: true,
            };
            return newState;
        }
        case "update_document_group": {
            let newState = _.cloneDeep(state);
            newState.DOCS.group = action.payload.toUpperCase();
            return newState;
        }
        case "update_document_item": {
            let newState = _.cloneDeep(state);
            newState.DOCS.docs[action.payload.id] = action.payload.value;
            return newState;
        }
        case "delete_doc": {
            let newState = _.cloneDeep(state);
            delete newState.DOCS.docs[action.payload];
            return newState;
        }

        case "add_Status": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.STAT.statuses[id] = {
                id: id,
                status: "",
                backendStatus: "",
            };
            return newState;
        }
        case "delete_status": {
            let newState = _.cloneDeep(state);
            delete newState.STAT.statuses[action.payload];
            return newState;
        }
        case "update_Status_Group": {
            let newState = _.cloneDeep(state);
            newState.STAT.group_code = action.payload;
            return newState;
        }
        case "update_status": {
            let newState = _.cloneDeep(state);
            newState.STAT.statuses[action.payload.id] = action.payload.value;
            return newState;
        }

        case "add_shared_ddl": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            let field_name;
            if (action.payload.link && action.payload.parent) {
                field_name = newState.CF.subgroups[action.payload.parent].fields[action.payload.link].label;
            } else {
                field_name = action.payload.name ? action.payload.name : "";
            }
            newState.SDL[id] = {
                name: field_name,
                link: (action.payload.link ? action.payload.link : ""),
                items: {}
            }
            newState.SDL[id].items[uuidv1()] = "";
            return newState;
        }

        case "add_ddl_item": {
            let newState = _.cloneDeep(state);
            newState.SDL[action.payload].items[uuidv1()] = "";
            return newState;
        }
        case "delete_ddl_item": {
            let newState = _.cloneDeep(state);
            delete newState.SDL[action.payload.list].items[action.payload.item];
            return newState;
        }
        case "update_ddl_item": {
            let newState = _.cloneDeep(state);
            newState.SDL[action.payload.list].items[action.payload.item] = action.payload.value;
            return newState;
        }
        case "update_DDL_name": {
            let newState = _.cloneDeep(state);
            let list_to_update = "";
            for (let i in newState.SDL) {
                if (newState.SDL[i].link === action.payload.link) {
                    list_to_update = i;
                    newState.SDL[list_to_update].name = action.payload.name;
                    break;
                }
            }
            return newState;
        }
        case "add_notification": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.NOTE[id] = {
                id: id,
                name: "",
                description: "",
                from: "",
                cc: "",
                title: "",
                importance: "Normal", //Low, Normal, High
                content: "",
            };
            return newState;
        }
        case "update_notification": {
            let newState = _.cloneDeep(state);
            newState.NOTE[action.payload.note][action.payload.field] = action.payload.value;
            return newState;
        }
        case "delete_notification": {
            let newState = _.cloneDeep(state);
            delete newState.NOTE[action.payload];
            return newState;
        }

        case "add_result_group": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.INSP.result_groups[id] = {
                id: id,
                name: "",
                items: {}
            };
            return newState;
        }
        case "add_result_group_item": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.INSP.result_groups[action.payload].items[id] = {
                id: id,
                result: "",
                type: "APPROVED",
                order: (Object.keys(newState.INSP.result_groups[action.payload].items) ? Object.keys(newState.INSP.result_groups[action.payload].items).length * 10 : 0),
                min_score: "",
                max_score: "",
                min_vio: "",
                max_vio: ""
            };
            return newState;
        }
        case "update_result_group": {
            let newState = _.cloneDeep(state);
            if (action.payload.field === "name") {
                newState.INSP.result_groups[action.payload.id]["name"] = action.payload.value;
            } else {
                newState.INSP.result_groups[action.payload.id.split("|")[0]].items[action.payload.id.split("|")[1]][action.payload.field] = action.payload.value;
            }
            return newState;
        }
        case "delete_result_group": {
            let newState = _.cloneDeep(state);
            delete newState.INSP.result_groups[action.payload];
            return newState;
        }
        case "delete_result_group_item": {
            let newState = _.cloneDeep(state);
            delete newState.INSP.result_groups[action.payload.split("|")[0]].items[action.payload.split("|")[1]];
            return newState;
        }

        case "add_checklist": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.INSP.checklists[id] = {
                id: id,
                name: "",
                group: "",
                items: {}
            };
            return newState;
        }
        case "add_checklist_item": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.INSP.checklists[action.payload].items[id] = {
                id: id,
                type: "",
                comment: "",
                order: (Object.keys(newState.INSP.checklists[action.payload].items) ? Object.keys(newState.INSP.checklists[action.payload].items).length * 10 : 0),
            };
            return newState;
        }
        case "update_checklist": {
            let newState = _.cloneDeep(state);
            if (action.payload.field === "name") {
                newState.INSP.checklists[action.payload.id]["name"] = action.payload.value;
            } else if (action.payload.field === "group") {
                newState.INSP.checklists[action.payload.id]["group"] = action.payload.value;
            } else {
                newState.INSP.checklists[action.payload.id.split("|")[0]].items[action.payload.id.split("|")[1]][action.payload.field] = action.payload.value;
            }
            return newState;
        }
        case "delete_checklist": {
            let newState = _.cloneDeep(state);
            delete newState.INSP.checklists[action.payload];
            return newState;
        }
        case "delete_checklist_item": {
            let newState = _.cloneDeep(state);
            delete newState.INSP.checklists[action.payload.split("|")[0]].items[action.payload.split("|")[1]];
            return newState;
        }

        case "add_inspection": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.INSP.inspections[id] = {
                id: id,
                type: "",
                checklist: "",
                result_group: "",
                required: "N",
                aca: "Y",
                order: (Object.keys(newState.INSP.inspections) ? Object.keys(newState.INSP.inspections).length * 10 : 0),
            };
            return newState;
        }
        case "update_inspection": {
            let newState = _.cloneDeep(state);
            if (action.payload.id === 0) {
                newState.INSP[action.payload.field] = action.payload.value;
            } else {
                newState.INSP.inspections[action.payload.id][action.payload.field] = action.payload.value;
            }
            return newState;
        }
        case "delete_inspection": {
            let newState = _.cloneDeep(state);
            delete newState.INSP.inspections[action.payload];
            return newState;
        }

        case "add_note": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.notes[id] = {
                id: id,
                page: action.payload,
                value: "",
                comment: ""
            };
            return newState;
        }
        case "update_note": {
            let newState = _.cloneDeep(state);
            newState.notes[action.payload.note][action.payload.field] = action.payload.value;
            return newState;
        }
        case "delete_note": {
            let newState = _.cloneDeep(state);
            delete newState.notes[action.payload];
            return newState;
        }

        default: return state;
    }
};

export default sCubeReducer;
