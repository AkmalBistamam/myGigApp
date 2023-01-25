import { Button } from "primereact/button";
import React from "react";
import { withRouter } from "react-router-dom";

const NoMatchAdmin = (props) => {
    return (
        <div className="card col-12">
            <div style={{ height: "5em" }} />
            <p
                style={{
                    fontSize: "60px",
                    fontWeight: "600",
                    textAlign: "center",
                    margin: 0,
                }}
            >
                Ops!
            </p>
            <p style={{ fontSize: "24px", textAlign: "center" }}>Access Denied!</p>

            <Button label="Return Home" className="mr-2 mb-2" onClick={() => props.history.push("/")}></Button>
        </div>
    );
};

export default withRouter(NoMatchAdmin);
