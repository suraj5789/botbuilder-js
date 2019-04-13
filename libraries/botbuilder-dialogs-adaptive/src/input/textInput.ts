/**
 * @module botbuilder-planning
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity } from "botbuilder-core";
import { DialogCommand, DialogDependencies, TextPrompt, Dialog, DialogConfiguration, DialogContext, DialogTurnResult } from "botbuilder-dialogs";
import { TextSlotConfiguration } from "./textSlot";
import { ActivityProperty } from "../activityProperty";

export interface TextInputConfiguration extends DialogConfiguration, TextSlotConfiguration {

}

export class TextInput extends DialogCommand implements DialogDependencies {
    private prompt = new TextPrompt();
    private entityName:string;
    constructor(property: string, entityName: string, activity: string|Partial<Activity>) {
        super();
        this.property = property;
        this.activity.value = activity;
        this.entityName = entityName;
    }

    protected onComputeID(): string {
        return `textInput[${this.bindingPath()}]`;
    }

    public getDependencies(): Dialog[] {
        // Update prompts ID before returning.
        this.prompt.id = this.id + ':prompt';
        return [this.prompt];
    }

    public configure(config: TextInputConfiguration): this {
        return super.configure(config);
    }

    /**
     * Activity to send the user.
     */
    public activity = new ActivityProperty();

    /**
     * (Optional) data binds the called dialogs input & output to the given property.
     * 
     * @remarks
     * The bound properties current value will be passed to the called dialog as part of its 
     * options and will be accessible within the dialog via `dialog.options.value`. The result
     * returned from the called dialog will then be copied to the bound property.
     */
    public set property(value: string) {
        this.inputProperties['value'] = value;
        this.outputProperty = value;
    }

    public get property(): string {
       return this.outputProperty; 
    }

    public async onRunCommand(dc: DialogContext): Promise<DialogTurnResult> {
        // Get entity
        const values: any|any[] = dc.state.getValue(this.entityName);
        if (Array.isArray(values) && values.length > 0) {
            // Save first value to property
            dc.state.setValue(this.property, values[0]);
        } else if (values !== undefined) {
            dc.state.setValue(this.property, values);
        }
        // Check value and only call if missing
        const value = dc.state.getValue(this.property);
        if (typeof value !== 'string' || value.length == 0) {
            const activity = this.activity.format(dc, { utterance: dc.context.activity.text || '' });
            return await dc.prompt(this.prompt.id, activity);
        } else {
            return await dc.endDialog();
        }
    }
}