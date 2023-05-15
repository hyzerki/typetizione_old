import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage(){
    return (
        <div>
            <h1>Page does not exists.</h1>
            <Link to="/">Back to main.</Link>
        </div>
    )
}

export default NotFoundPage;