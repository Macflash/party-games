import * as React from "react";
import { CB } from "../generic/apis";

export const border = "2px solid grey";

export const Header: React.FC = props =>
    <div style={{ fontSize: 18, margin: "10px 0" }} role="header" aria-level={1}>
        {props.children}
    </div>;

export const Dialog: React.FC = props => {
    const margin = 100;
    return <div style={{ backgroundColor: "rgba(0,0,0,.5)", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <div style={{ backgroundColor: "rgb(75,75,75)", position: "absolute", top: margin, left: margin, right: margin, bottom: margin, padding: 25, paddingTop: 10, overflow: "auto" }}>
            {props.children}
        </div>
    </div>;
}

export const Input: React.FC<{
    name: string,
    value?: string | null,
    onChange: CB<string>,
    inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}> = props => {
    return <div>
        <label>
            {props.name}
            <input {...props.inputProps} value={props.value ?? ""} onChange={ev => props.onChange(ev.target.value)} />
        </label>
    </div>
}

export const DropDown: React.FC<{
    name: string,
    value?: string,
    onChange: CB<string>,
}> = props => {
    return <div>
        <label>
            {props.name}
            <select placeholder="Please pick an option" value={props.value ?? ""} onChange={ev => props.onChange(ev.target.value)}>
                <option>Please pick an option</option>
                {props.children}
            </select>
        </label>
    </div>
}