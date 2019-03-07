import React from "react"
import { IoIosPower } from "react-icons/io"

export default () => (
    <a href="/api/logout">
        <button
            className={`side_nav_icon_container`}
            style={{ background: "none", border: "none", outline: "none", cursor: "pointer" }}>
            <div className="nav_icon_container">
                <IoIosPower size={"2em"} color="white" />
            </div>
            <p className="nav_icon_text">Logout</p>
        </button>
    </a>
)