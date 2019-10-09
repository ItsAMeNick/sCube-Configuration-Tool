import _ from "lodash";
import uuidv1 from "uuid/v1";

const initialState = {
    id: uuidv1(),
    page: 0,
    GRD: {
        svp: "",
        alias: "",
        module: "",
        type: "",
        sub_type: "",
        category: "",
    },
    CF: {
        group_code: "",
        subgroups: {},
    }
};

const sCubeReducer = (state = initialState, action) => {
    switch (action.type) {
        case "dump_store": {
            console.log(state);
            return state;
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
            console.log(action.payload)
            delete newState.CF.subgroups[action.payload.subgroup].fields[action.payload.field];
            return newState;
        }

        default: return state;
    }
};

export default sCubeReducer;
