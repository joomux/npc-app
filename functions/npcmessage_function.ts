import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import NpcObjectDatastore from "../datastores/npc_datastore.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const NpcmessageFunctionDefinition = DefineFunction({
  callback_id: "npcmessage_function",
  title: "Send NPC Message",
  description: "Send a message from an NPC",
  source_file: "functions/npcmessage_function.ts",
  input_parameters: {
    properties: {
      npc: {
        items: {
          type: Schema.types.string,
          enum: ["John", "Jane"],
        },
        maxItems: 1,
        type: Schema.types.array,
        description: "Name of NPC",
      },
      message: {
        type: Schema.slack.types.rich_text,
        description: "Image URL",
        hint: "Must be square. No larger than 256x256.",
      },
    },
    required: ["npc", "message"],
  },
  output_parameters: {
    properties: {
      updatedMsg: {
        type: Schema.types.string,
        description: "Message result",
      },
    },
    required: ["updatedMsg"],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  NpcmessageFunctionDefinition,
  async ({ client }) => {
    // Save the sample object to the datastore
    // https://api.slack.com/automation/datastores
    const npc_result = await client.apps.datastore.query<
      typeof NpcObjectDatastore.definition
    >({
      datastore: "NpcObjects",
    });

    if (!npc_result.ok) {
      return { error: `Failed to retrieve NPCs: ${npc_result.error}` };
    }

    const npcs = new Map<typeof Schema.types.string, {
      name: string;
      avatar: string;
    }>();

    // inputs.user is set from the interactivity_context defined in sample_trigger.ts
    // https://api.slack.com/automation/forms#add-interactivity
    // const updatedMsg = `:wave: ` + `${inputs.name}` + ` has been created`;

    return { inputs: { npcs: [...npcs.entries()].map((r) => r[1]) } };
  },
);
