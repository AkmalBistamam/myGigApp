
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { Dialog } from "primereact/dialog";
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import client from "../../services/restClient";


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = [];
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const CategorySelectItems = [
    { label: 'Security', value: 'security' },
    { label: 'Safety', value: 'safety' },
    { label: 'Education', value: 'education' },
    { label: 'Arts', value: 'arts' },
    { label: 'Financial', value: 'financial' }
];

const PlatformMultiSelect = [
    { name: 'ReactJS', code: 'reactjs' },
    { name: 'Angular 5', code: 'angular5' },
    { name: 'Vue JS', code: 'vuejs' },
    { name: 'JSP', code: 'jsp' },
    { name: 'Node Express', code: 'node' },
    { name: 'Laravel', code: 'laravel' },
    { name: 'Django', code: 'django' },
    { name: 'Spring Boot', code: 'springboot' },
    { name: 'PHP', code: 'php' },
    { name: 'Java', code: 'java' },
    { name: 'Python', code: 'python' },
    { name: 'C#', code: 'c#' },
    { name: 'C++', code: 'c++' },
    { name: 'JavaScript', code: 'javascript' }
];

let minDate = new Date();

const ProjectCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        set_entity({})
    }, [props.show])
    const onSave = async () => {
        let _data = {
            user_id: props.user?._id,
            project_name: _entity.project_name,
            project_description: _entity.project_description,
            project_category: _entity.project_category,
            project_price: _entity.project_price,
            project_duration: _entity.project_duration,
            project_terms: _entity.project_terms,
            project_platform: _entity.project_platform
        };
        setLoading(true);
        try {
            const result = await client.service("project").create(_data);
            props.onHide();
            props.alert({ type: "success", title: "Create", message: "Created successfully" });
            props.onCreateResult(result);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError("");
    };

    return (
        <Dialog header="Create" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div>
                <div>
                    <p className="m-0" >Project Name:</p>
                    <InputText className="w-full mb-3" value={_entity.project_name} onChange={(e) => setValByKey("project_name", e.target.value)} />
                </div>
                <div>
                    <p className="m-0" >Project Description:</p>
                    <InputTextarea className="w-full mb-3" rows={5} cols={30} value={_entity.project_description} onChange={(e) => setValByKey("project_description", e.target.value)} autoResize />
                </div>
                <div>
                    <p className="m-0" >Project Category:</p>
                    <Dropdown className="w-full mb-3" value={_entity.project_category} options={CategorySelectItems} onChange={(e) => setValByKey("project_category", e.target.value)} placeholder="Select Category" />
                </div>
                <div>
                    <p className="m-0" >Project Price:</p>
                    <InputNumber className="w-full mb-3" value={_entity.project_price} onValueChange={(e) => setValByKey("project_price", e.target.value)} mode="currency" currency="MYR" locale="MYR" />
                </div>
                <div>
                    <p className="m-0" >Project Duration:</p>
                    <Calendar className="w-full mb-3" dateFormat="yy/mm/dd" minDate={minDate} /*showTime*/ hourFormat="24" selectionMode="range" value={_entity?.project_duration} onChange={(e) => setValByKey("project_duration", e.target.value)}></Calendar>
                </div>
                <div>
                    <p className="m-0" >Project Terms:</p>
                    <InputTextarea className="w-full mb-3" rows={5} cols={30} value={_entity?.project_terms} onChange={(e) => setValByKey("project_terms", e.target.value)} autoResize />
                </div>
                <div>
                    <p className="m-0" >Project Platform:</p>
                    <MultiSelect className="w-full mb-3" display="chip" optionLabel="name" value={_entity?.project_platform} options={PlatformMultiSelect} onChange={(e) => setValByKey("project_platform", e.target.value)} />
                </div>
                <small className="p-error">
                    {Array.isArray(error)
                        ? error.map((e, i) => (
                            <p className="m-0" key={i}>
                                {e}
                            </p>
                        ))
                        : error}
                </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(ProjectCreateDialogComponent);
// createDialog_code.template
