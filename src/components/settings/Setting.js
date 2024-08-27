import * as React from "react";
import { Button } from "../Button";

export const Setting = ({label, setting, value, type, pushSettingChange, reset}) => {
    const [localValue, setLocalValue] = React.useState(value)

    const resetSettingValue = setting => {
        reset(setting);
        setLocalValue(value);
    }

    const types = {
        "color": <input type="color" value={localValue} onInput={e => setLocalValue(e.target.value)} onBlur={e => pushSettingChange(setting, e.target.value)} />
    }

    const resetButton = <Button text={"Reset to default"} action={() => resetSettingValue(setting)} />

    return(
        <>
            <div className="setting-wrapper">
                {label}: {types[type]} {resetButton}
            </div>
        </>
    )
}