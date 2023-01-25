
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
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

const UsersCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [maskPassword, setMaskPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);

    useEffect(() => {
        set_entity({})
    }, [props.show])
    const onSave = async () => {
        if (validate()) {
            console.log("User created successfully");
            let _data = {
                name: _entity.name,
                email: _entity.email,
                password: _entity.password,
                phone: _entity.phone,
                isAdmin: _entity.isAdmin,
            };

            setLoading(true);
            try {
                const result = await client.service("users").create(_data);
                props.onHide();
                props.alert({ type: "success", title: "Create", message: "Created successfully" });
                props.onCreateResult(result);
            } catch (error) {
                console.log("error", error);
                setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
                props.alert({ type: "error", title: "Create", message: "Failed to create" });
            }
            setLoading(false);
        }
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

    const validate = () => {
        let isValid = true;
        let re = /\S+@\S+\.\S+/;
        let rephone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        setEmailError("");
        setNameError("");
        setPasswordError("");
        setPhoneError("");
        if (!re.test(_entity.email)) {
            setEmailError("Please Enter a valid email");
            isValid = false;
        }
        if (!_entity.name.length) {
            setNameError("Name is required");
            isValid = false;
        }
        else if (_entity.name.length < 3) {
            setNameError("Must be at least 3 characters long");
            isValid = false;
        }
        if (!_entity.password.length) {
            setPasswordError("Password is required");
            isValid = false;
        }
        else if (_entity.password.length < 6) {
            setPasswordError("Must be at least 6 characters long and have at least one letter, digit, uppercase, lowercase and symbol");
            isValid = false;
        }
        if (!_entity.phone.length) {
            setPhoneError("Password is required");
            isValid = false;
        }
        else if (!rephone.test(_entity.phone)) {
            setPhoneError("Please Enter a valid phone number");
            isValid = false;
        }

        return isValid;
    };

    const renderPasswordPolicyErrors = () => {
        const { passwordPolicyErrors } = props;
        if (!(Array.isArray(passwordPolicyErrors) && passwordPolicyErrors.length)) return null;
        return passwordPolicyErrors.map((message, i) => {
            return (
                <p className="m-0" key={"pass-policy-" + i}>
                    <small className="p-error">{message}</small>
                </p>
            );
        });
    };
    return (
        <Dialog header="Create" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div>
                <div>
                    <p className="m-0" >Name:</p>
                    <small className="p-error">{nameError}</small>
                    <InputText type="text" className="w-full mb-3" placeholder="Enter Name" value={_entity?.name} onChange={(e) => setValByKey("name", e.target.value)} required />
                </div>
                <div>
                    <p className="m-0" >Email:</p>
                    <small className="p-error">{emailError}</small>
                    <InputText type="text" className="w-full mb-3" placeholder="Enter Email" value={_entity?.email} onChange={(e) => setValByKey("email", e.target.value)} required />
                </div>
                <div>
                    <p className="m-0" >Password:</p>
                    <small className="p-error">{passwordError}</small>
                    <InputText type={maskPassword ? "password" : "text"} placeholder="Enter Password" className="w-full mb-3" value={_entity?.password} onChange={(e) => setValByKey("password", e.target.value)} required />
                    <span className="p-input-icon-right"><i className={`pi ${maskPassword ? "pi-eye" : "pi-eye-slash"} cursor-pointer`} onClick={() => setMaskPassword(!maskPassword)} title={`${maskPassword ? "Show" : "Hide"} password`} /></span>
                    {renderPasswordPolicyErrors()}
                </div>
                <div>
                    <p className="m-0" >Phone Number:</p>
                    <small className="p-error">{phoneError}</small>
                    <InputText type="text" placeholder="Enter Phone Number" className="w-full mb-3" value={_entity?.phone} onChange={(e) => setValByKey("phone", e.target.value)} required />
                </div>
                <div>
                    <p className="m-0" >Admin</p>
                    <InputSwitch checked={_entity?.isAdmin} onChange={(e) => setValByKey("isAdmin", e.value)} />
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
    //
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(null, mapDispatch)(UsersCreateDialogComponent);
// createDialog_code.template
