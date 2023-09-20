import React from 'react'
import {Link} from "react-router-dom"

export default function Permission() {
    return (
        <div>
            <h1>You don't have permission</h1>
            <Link to="/">Go back home page</Link>
        </div>
    )
}
