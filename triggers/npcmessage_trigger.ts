import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import NpcmessageWorkflow from "../workflows/npcmessage_workflow.ts";
/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const npcmessageTrigger: Trigger<typeof NpcmessageWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Send NPC Message",
  description: "Send a message as an NPC",
  workflow: `#/workflows/${NpcmessageWorkflow.definition.callback_id}`,
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

export default npcmessageTrigger;
