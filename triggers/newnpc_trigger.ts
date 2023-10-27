import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import NewnpcWorkflow from "../workflows/newnpc_workflow.ts";
/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const newnpcTrigger: Trigger<typeof NewnpcWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Create New NPC",
  // icon: "https://i.imgur.com/wqKV7Fw.png",
  // shortcut: {
  //   button_text: "Create NPC",
  // },
  description: "Create a new NPC to send messages from",
  workflow: `#/workflows/${NewnpcWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default newnpcTrigger;
