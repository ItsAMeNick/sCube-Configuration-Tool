import _ from "lodash";
import uuidv1 from "uuid/v1";

const initialState = {
    id: uuidv1(),
    version: "1-1",
    page: 0,
    notes: {},
    GRD: {
        svp: "",
        alias: "",
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
    SDL: {}
};

const sCubeReducer = (state = initialState, action) => {
    switch (action.type) {
        case "dump_store": {
            console.log(state);
            return state;
        }

        case "save_state": {
            let newState = _.cloneDeep(state);
            newState.GRD.version = action.payload.version;
            let element = document.createElement("a");
            let file = new Blob([JSON.stringify(newState)], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = action.payload.filename + ".sCube";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
            return newState;
        }

        case "load_state": {
            let newState = JSON.parse(action.payload)
            // Optional Page override, this line can be commented output
            // If commented out, loading a save will return a user to the page that
            // the app was saved on
            newState.page = 1;

            // Generate a new ID for the version
            newState.id = uuidv1();

            //Update version
            let current = newState.version.split("-");
            newState.version = current[0] + "-" + (parseInt(current[1])+1);
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
