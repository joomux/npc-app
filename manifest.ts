import { Manifest } from "deno-slack-sdk/mod.ts";
import NpcObjectDatastore from "./datastores/npc_datastore.ts";
import { GetnpclistDefinition } from "./functions/getnpcs.ts";
import { NewnpcFunctionDefinition } from "./functions/newnpc_function.ts";
// import { NpcmessageFunctionDefinition } from "./functions/npcmessage_function.ts";
import NewnpcWorkflow from "./workflows/newnpc_workflow.ts";
// import { NpcType } from "./types/npcs.ts";
// import NewnpcWorkflow from "./workflows/newnpc_workflow.ts";
import NpcmessageWorkflow from "./workflows/npcmessage_workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "NPC Simulator",
  description: "Send messages as NPCs",
  icon: "assets/dungeons-and-dragons-48.png",
  functions: [
    NewnpcFunctionDefinition,
    GetnpclistDefinition,
  ],
  workflows: [NpcmessageWorkflow, NewnpcWorkflow],
  outgoingDomains: [],
  datastores: [NpcObjectDatastore],
  types: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.customize",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "channels:read",
    "groups:read",
    "mpim:read",
    "im:read",
  ],
});
