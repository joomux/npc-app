import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import NpcObjectDatastore from "../datastores/npc_datastore.ts";

export const GetnpclistDefinition = DefineFunction({
  callback_id: "getnpclist_function",
  title: "Get NPCs from datastore",
  source_file: "functions/getnpcs.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
  output_parameters: {
    properties: {
      npclist: {
        type: Schema.types.array,
        description: "List of NPCs",
        items: { type: Schema.types.string },
      },
      // npclist_ids: {
      //   type: Schema.types.array,
      //   description: "List of NPC IDs",
      //   items: { type: Schema.types.string },
      // },
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["npclist", "interactivity"],
  },
});

export default SlackFunction(
  GetnpclistDefinition,
  async ({ inputs, client }) => {
    const npc_result = await client.apps.datastore.query<
      typeof NpcObjectDatastore.definition
    >({
      datastore: "NpcObjects",
    });

    if (!npc_result.ok) {
      return { error: `Failed to retrieve NPCs: ${npc_result.error}` };
    }

    console.log(npc_result);

    const npclist_ids: string[] = [];
    // const npclist_names: string[] = [];
    const npclist: string[] = [];
    npc_result.items.forEach(function (val) {
      npclist_ids.push(val.object_id);
      npclist.push(val.name);
      // npclist.push({
      //   value: val.object_id,
      //   title: val.name,
      // });
    });
    console.log(npclist);
    console.log(typeof npclist);
    // console.log(inputs);
    const interactivity = inputs.interactivity;
    console.log(interactivity);
    return { outputs: { npclist, interactivity } };
    // return { outputs: { npclist, npclist_ids, interactivity } };
  },
);
