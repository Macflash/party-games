import * as React from "react";
import { CB } from "../generic/apis";

export const border = "2px solid var(--main-color)";

export const Header: React.FC = props =>
    <div style={{ fontSize: 18, margin: "10px 0"}} role="header" aria-level={1}>
        {props.children}
    </div>;

export const Dialog: React.FC = props => {
    const margin = "var(--margin)";
    return <div style={{ backgroundColor: "rgba(0,0,0,.5)", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <div style={{ backgroundColor: "rgb(75,75,75)", position: "absolute", top: margin, left: margin, right: margin, bottom: margin, padding: 25, paddingTop: 10, overflow: "auto" }}>
            {props.children}
        </div>
    </div>;
}

export const Input: React.FC<{
    name: string,
    value?: string | number | null,
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

export function HSVtoRGB(h: number, s: number, v: number) {
    var r: number, g: number, b: number, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        r: Math.round(r! * 255),
        g: Math.round(g! * 255),
        b: Math.round(b! * 255)
    };
}

export function CreateColors() {
    const s1 = .56;
    const s2 = .36;

    const v1 = .9;
    const v2 = .89;

    const h1 = Math.random();
    const h2 = Math.abs(h1 - .337);

    return [
        HSVtoRGB(h1, s1, v1),
        HSVtoRGB(h2, s2, v2),
    ]
}