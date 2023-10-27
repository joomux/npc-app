import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { NewnpcFunctionDefinition } from "../functions/newnpc_function.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/automation/forms#add-interactivity
 */
const NewnpcWorkflow = DefineWorkflow({
  callback_id: "newnpc_workflow",
  title: "Create NPC",
  description: "Create a new NPC to send from",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user", "interactivity"],
  },
});

/**
 * For collecting input from users, we recommend the
 * OpenForm Slack function as a first step.
 * https://api.slack.com/automation/functions#open-a-form
 */
const inputForm = NewnpcWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Define NPC",
    interactivity: NewnpcWorkflow.inputs.interactivity,
    submit_label: "Save NPC",
    fields: {
      elements: [{
        name: "name",
        title: "Name of NPC",
        type: Schema.types.string,
      }, {
        name: "avatar",
        title: "Image URL",
        type: Schema.types.string,
        format: "url",
      }],
      required: ["name"],
    },
  },
);

/**
 * Custom functions are reusable building blocks
 * of automation deployed to Slack infrastructure. They
 * accept inputs, perform calculations, and provide
 * outputs, just like typical programmatic functions.
 * https://api.slack.com/automation/functions/custom
 */
const newnpcFunctionStep = NewnpcWorkflow.addStep(NewnpcFunctionDefinition, {
  name: inputForm.outputs.fields.name,
  avatar: inputForm.outputs.fields.avatar,
});

// /**
//  * SendMessage is a Slack function. These are
//  * Slack-native actions, like creating a channel or sending
//  * a message and can be used alongside custom functions in a workflow.
//  * https://api.slack.com/automation/functions
//  */
NewnpcWorkflow.addStep(Schema.slack.functions.SendDm, {
  user_id: NewnpcWorkflow.inputs.user,
  message: newnpcFunctionStep.outputs.updatedMsg,
});

export default NewnpcWorkflow;
