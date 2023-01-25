import _ from "lodash";
import { Button } from "primereact/button";
import { confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import client from "../../services/restClient";
import ProjectCreateDialogComponent from "./ProjectCreateDialogComponent";
import ProjectDatatable from "./ProjectDataTable";
import ProjectDatatable2 from "./ProjectDatatable2";
import ProjectEditDialogComponent from "./ProjectEditDialogComponent";
import ProjectInfoDialogComponent from "./ProjectInfoDialogComponent";

const ProjectPage = (props) => {
    const history = useHistory();
    const [state, setState] = useState(false);
    const [data, setData] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [selectedEntityIndex, setSelectedEntityIndex] = useState();
    const toast = useRef(null);
    useEffect(() => {
        //on mount
        if (props.user?.isAdmin) {
            client
                .service("project")
                .find({
                    query: {
                        $limit: 100, project_status: "Pending", $sort: {
                            createdAt: -1
                        }
                    }
                })
                .then((res) => {
                    res.data.map((results) => {
                        if (results.project_duration)
                            results.project_duration = results.project_duration.map((duration) => new Date(duration));
                    });
                    setData(res.data);

                })
                .catch((error) => {
                    console.log({ error });
                    props.alert({ title: "Project", type: "error", message: error.message || "Failed get Project" });
                });
        }
        else {
            client
                .service("project")
                .find({
                    query: {
                        $limit: 100, user_id: props.user?._id, $sort: {
                            createdAt: -1
                        }
                    }
                })
                .then((res) => {
                    res.data.map((results) => {
                        if (results.project_duration)
                            results.project_duration = results.project_duration.map((duration) => new Date(duration));
                    });
                    setData(res.data);
                    // res.data.forEach(e => {

                    //     // console.log('>>>', e.project_duration)
                    //     // e.project_duration?.forEach(d => { console.log(typeof d) })
                    //     for (let i = 0; i < e.project_duration.length; i++) {
                    //         const elem = e.project_duration[i];
                    //         console.log('elem', elem, typeof elem)

                    //     }
                    // })

                })
                .catch((error) => {
                    console.log({ error });
                    props.alert({ title: "Project", type: "error", message: error.message || "Failed get Project" });
                });
        }
    }, [props.user?._id, data]);
    const onEditRow = (rowData, rowIndex) => {
        if (rowData.project_status === "Accepted" || rowData.project_status === "Rejected") {
            setSelectedEntityIndex(rowIndex);
            setShowInfoDialog(true);
        }
        else {
            setSelectedEntityIndex(rowIndex);
            setShowEditDialog(true);
        }
    };

    const onCreateResult = (newEntity) => {
        newEntity.project_duration = newEntity.project_duration ? newEntity.project_duration.map((el) => (el ? new Date(el) : null)) : [];
        setData([...data, newEntity]);
    };

    const onEditResult = (newEntity) => {
        let _newData = _.cloneDeep(data);
        newEntity.project_duration = newEntity.project_duration ? newEntity.project_duration.map((el) => (el ? new Date(el) : null)) : [];
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
        if (rowData.project_status === "Accepted" || rowData.project_status === "Rejected") {
            setState(true);
            setSelectedEntityIndex(rowIndex);
        }
        else {
            confirmPopup({
                target: event.currentTarget,
                message: 'Do you want to delete this record?',
                icon: 'pi pi-info-circle',
                accept: () => accept(rowData, rowIndex),
                reject
            });
        }
    };

    const onRowDelete = async (rowData, rowIndex) => {
        if (rowData.project_status === "Accepted" || rowData.project_status === "Rejected") {
            setState(true);
            setSelectedEntityIndex(rowIndex);
        }
        else {
            setState(false);
            setSelectedEntityIndex(null);
            try {
                await client.service("project").remove(data[rowIndex]?._id);
                let _newData = data.filter((_, i) => i !== rowIndex);
                setData(_newData);
            } catch (error) {
                console.log({ error });
                props.alert({ title: "Project", type: "error", message: error.message || "Failed delete record" });
            }
        }
    };

    const onRowAccept = async (index) => {
        let _data = {
            project_status: "Accepted",
        };
        try {
            await client.service("project").patch(data[index]?._id, _data);
            props.alert({ type: "success", title: "Edit info", message: "Info updated successfully" });
        } catch (error) {
            console.log("error", error);
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
    }

    const onRowRejected = async (index) => {
        let _data = {
            project_status: "Rejected",
        };
        try {
            await client.service("project").patch(data[index]?._id, _data);
            props.alert({ type: "success", title: "Edit info", message: "Info updated successfully" });
        } catch (error) {
            console.log("error", error);
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
    }
    const onRowClick = (e) => {
        console.log("e", e);
    };
    return (
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <h3 className="mb-0 ml-2">Project</h3>
                <div className="col flex justify-content-end">
                    <Button label="add" icon="pi pi-plus" onClick={() => setShowCreateDialog(true)} />
                </div>
            </div>
            <div className="grid col-10">
                <div className="col-12">
                    {props.user?.isAdmin &&
                        <ProjectDatatable items={data} state={state} onRowAccept={onRowAccept} onRowRejected={onRowRejected} onEditRow={onEditRow} onRowClick={onRowClick} onRowConfirmDelete={onRowConfirmDelete} />
                    }
                    {!props.user?.isAdmin &&
                        <ProjectDatatable2 items={data} state={state} onEditRow={onEditRow} onRowClick={onRowClick} onRowConfirmDelete={onRowConfirmDelete} />
                    }
                </div>
            </div>
            <Toast ref={toast} />
            <ProjectEditDialogComponent entity={data[selectedEntityIndex]} show={showEditDialog} onHide={() => setShowEditDialog(false)} onEditResult={onEditResult} />
            <ProjectInfoDialogComponent entity={data[selectedEntityIndex]} show={showInfoDialog} onHide={() => setShowInfoDialog(false)} onEditResult={onEditResult} />
            <ProjectCreateDialogComponent show={showCreateDialog} onHide={() => setShowCreateDialog(false)} onCreateResult={onCreateResult} />
        </div>
    );
};
const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
    //
});

export default connect(mapState, mapDispatch)(ProjectPage);
