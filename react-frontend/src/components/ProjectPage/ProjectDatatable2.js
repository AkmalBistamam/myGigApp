import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

const ProjectDatatable2 = ({ items, state, onEditRow, onRowClick, onRowConfirmDelete }) => {
    const pTemplate0 = (rowData, { rowIndex }) => <p >{rowData.project_name}</p>
    const pTemplate1 = (rowData, { rowIndex }) => <p >{rowData.project_status}</p>

    const calendarTemplate7 = (rowData, { rowIndex }) => {
        return <Calendar dateFormat="dd/mm/yy" placeholder={"dd/mm/yy"} value={rowData?.project_duration} selectionMode="range" disabled></Calendar>;
    };

    const editTemplate = (rowData, { rowIndex }) => <Button disabled={state = false} onClick={() => onEditRow(rowData, rowIndex)} icon={`pi ${rowData.isEdit ? "pi-check" : "pi-pencil"}`} className={`p-button-rounded p-button-text ${rowData.isEdit ? "p-button-success" : "p-button-warning"}`} />;
    const deleteTemplate = (rowData, { rowIndex }) => <Button disabled={state = false} onClick={(event) => onRowConfirmDelete(event, rowData, rowIndex)} icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" />;
    return (
        <DataTable value={items} onRowClick={onRowClick} scrollable rowHover paginator rows={10}>
            <Column field="project_name" header="Project Name" body={pTemplate0} />
            <Column field="project_status" header="Status" body={pTemplate1} />
            <Column field="project_duration" header="Project Duration" body={calendarTemplate7} />

            <Column header="Edit" body={editTemplate} />
            <Column header="Delete" body={deleteTemplate} />
        </DataTable>
    );
};

export default ProjectDatatable2;