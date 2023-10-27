import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetnpclistDefinition } from "../functions/getnpcs.ts";
import { NpcmessageFunctionDefinition } from "../functions/npcmessage_function.ts";
import { SendmessageDefinition } from "../functions/sendmessage.ts";
// import { NpcType } from "../types/npcs.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/automation/forms#add-interactivity
 */
const NpcmessageWorkflow = DefineWorkflow({
  callback_id: "npcmessage_workflow",
  title: "Message workflow",
  description: "Send the npc message",
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
    required: ["npc", "interactivity"],
  },
});

// step 0 = get the list from the datastore
const npclist = NpcmessageWorkflow.addStep(
  GetnpclistDefinition,
  {
    interactivity: NpcmessageWorkflow.inputs.interactivity,
  },
);

// step 1 = type the message
/**
 * For collecting input from users, we recommend the
 * OpenForm Slack function as a first step.
 * https://api.slack.com/automation/functions#open-a-form
 */
const inputForm = NpcmessageWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send message to channel",
    interactivity: npclist.outputs.interactivity,
    submit_label: "Send message",
    fields: {
      elements: [{
        name: "npc",
        title: "Name of the person",
        // items: {
        //   type: Schema.types.string,
        enum: npclist.outputs.npclist,
        // },
        // maxItems: 1,
        type: Schema.types.string,
        // choices: npclist.outputs.npclist,
      }, {
        name: "message",
        title: "Message",
        type: Schema.slack.types.rich_text,
      }, {
        name: "channel",
        title: "Target channel",
        type: Schema.slack.types.channel_id,
        default: NpcmessageWorkflow.inputs.channel,
      }],
      required: ["npc", "message", "channel"],
    },
  },
);

// step 2 = send the message

/**
 * Custom functions are reusable building blocks
 * of automation deployed to Slack infrastructure. They
 * accept inputs, perform calculations, and provide
 * outputs, just like typical programmatic functions.
 * https://api.slack.com/automation/functions/custom
 */
// const npcmessageFunctionStep = NpcmessageWorkflow.addStep(
//   NpcmessageFunctionDefinition,
//   {
//     npc: "", //inputForm.outputs.fields.npc,
//     message: inputForm.outputs.fields.message,
//   },
// );

// /**
//  * SendMessage is a Slack function. These are
//  * Slack-native actions, like creating a channel or sending
//  * a message and can be used alongside custom functions in a workflow.
//  * https://api.slack.com/automation/functions
//  */
NpcmessageWorkflow.addStep(SendmessageDefinition, {
  channel_id: inputForm.outputs.fields.channel,
  message: inputForm.outputs.fields.message,
  npc: inputForm.outputs.fields.npc,
  user_id: NpcmessageWorkflow.inputs.user,
});

export default NpcmessageWorkflow;
