import React from "react";

function Button(props) {
    return (
        <div className={props.className}>
            {/* delete arrow function parameters if not used */}
            <button type="button" onClick={() => props.handleClick(props.name)}>
                {props.value}
            </button>
        </div>
    );
}

export default Button;
