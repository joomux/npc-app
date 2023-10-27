import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import NpcObjectDatastore from "../datastores/npc_datastore.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const NewnpcFunctionDefinition = DefineFunction({
  callback_id: "newnpc_function",
  title: "Create NPC",
  description: "Create a new NPC to send from",
  source_file: "functions/newnpc_function.ts",
  input_parameters: {
    properties: {
      name: {
        type: Schema.types.string,
        description: "Name of NPC",
      },
      avatar: {
        type: Schema.types.string,
        format: "url",
        description: "Image URL",
        hint: "Must be square. No larger than 256x256.",
      },
    },
    required: ["name"],
  },
  output_parameters: {
    properties: {
      updatedMsg: {
        type: Schema.types.string,
        description: "Result of creating NPC",
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
  NewnpcFunctionDefinition,
  async ({ inputs, client }) => {
    const uuid = crypto.randomUUID();

    const npcObject = {
      name: inputs.name,
      avatar: inputs.avatar,
      object_id: uuid,
    };

    // Save the sample object to the datastore
    // https://api.slack.com/automation/datastores
    const write = await client.apps.datastore.put<
      typeof NpcObjectDatastore.definition
    >(
      {
        datastore: "NpcObjects",
        item: npcObject,
      },
    );

    if (!write.ok) {
      return { error: `Failed to create NPC: ${write.error}` };
    }

    // inputs.user is set from the interactivity_context defined in sample_trigger.ts
    // https://api.slack.com/automation/forms#add-interactivity
    const updatedMsg = `:white_check_mark: ` + `*${inputs.name}*` +
      ` has been created`;

    return { outputs: { updatedMsg } };
  },
);
