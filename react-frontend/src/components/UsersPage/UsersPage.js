import _ from "lodash";
import { Button } from "primereact/button";
import { confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import client from "../../services/restClient";
import UsersCreateDialogComponent from "./UsersCreateDialogComponent";
import UsersDatatable from "./UsersDataTable";
import UsersEditDialogComponent from "./UsersEditDialogComponent";

const UsersPage = (props) => {
    const history = useHistory();
    const [data, setData] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [selectedEntityIndex, setSelectedEntityIndex] = useState();
    const toast = useRef(null);
    useEffect(() => {
        //on mount
        client
            .service("users")
            .find({ query: { $limit: 100 } })
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
            });
    }, []);

    const onEditRow = (rowData, rowIndex) => {
        setSelectedEntityIndex(rowIndex);
        setShowEditDialog(true);
    };

    const onCreateResult = (newEntity) => {
        setData([...data, newEntity]);
    };

    const onEditResult = (newEntity) => {
        let _newData = _.cloneDeep(data);
        _newData[selectedEntityIndex] = newEntity;
        setData(_newData);
    };

    const accept = (rowData, rowIndex) => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Record have been deleted', life: 3000 });
        onRowDelete(rowData, rowIndex);
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    };

    const onRowConfirmDelete = (event, rowData, rowIndex) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            accept: () => accept(rowData, rowIndex),
            reject
        });
    };

    const onRowDelete = async (rowData, rowIndex) => {
        setSelectedEntityIndex(null);
        try {
            await client.service("users").remove(data[rowIndex]?._id);
            let _newData = data.filter((_, i) => i !== rowIndex);
            setData(_newData);
        } catch (error) {
            console.log({ error });
            props.alert({ title: "Users", type: "error", message: error.message || "Failed delete record" });
        }
    };

    const onRowClick = (e) => {
        console.log("e", e);
    };

    return (
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <h3 className="mb-0 ml-2">Users</h3>
                <div className="col flex justify-content-end">
                    <Button label="add" icon="pi pi-plus" onClick={() => setShowCreateDialog(true)} />
                </div>
            </div>
            <div className="grid col-10">
                <div className="col-12">
                    <UsersDatatable items={data} onEditRow={onEditRow} onRowConfirmDelete={onRowConfirmDelete} onRowClick={onRowClick} />
                </div>
            </div>
            <Toast ref={toast} />
            <UsersEditDialogComponent entity={data[selectedEntityIndex]} show={showEditDialog} onHide={() => setShowEditDialog(false)} onEditResult={onEditResult} />
            <UsersCreateDialogComponent show={showCreateDialog} onHide={() => setShowCreateDialog(false)} onCreateResult={onCreateResult} />
        </div>
    );
};
const mapState = (state) => ({
    //
});
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
    //
});

export default connect(mapState, mapDispatch)(UsersPage);
