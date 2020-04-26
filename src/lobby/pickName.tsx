import * as React from "react";
import { CB } from "../generic/apis";
import { Dialog, Header, Input } from "../basic/basics";

export const PickName: React.FC<{ onPick: CB<string> }> = props => {
    const storageKey = "lastusername";
    const [name, setName] = React.useState(localStorage.getItem(storageKey));
    return <Dialog>
        <Header>Please enter a name</Header>
        <Input
            name="Name"
            value={name}
            onChange={setName}
        />
        <div>
            <button disabled={!name} onClick={() => {
                if (name) {
                    localStorage.setItem(storageKey, name);
                    props.onPick(name)
                }
            }}>Confirm</button>
        </div>
    </Dialog>;
}