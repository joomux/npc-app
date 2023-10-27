import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import NpcObjectDatastore from "../datastores/npc_datastore.ts";

export const SendmessageDefinition = DefineFunction({
  callback_id: "sendmessage_function",
  title: "Send custom message",
  source_file: "functions/sendmessage.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      message: {
        type: Schema.slack.types.rich_text,
      },
      npc: {
        type: Schema.types.string,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: [],
  },
  output_parameters: { properties: {}, required: [] },
});

export default SlackFunction(
  SendmessageDefinition,
  async ({ inputs, client }) => {
    const channel_id = inputs.channel_id ? inputs.channel_id : "";
    console.log("input chan id ", channel_id);
    console.log(inputs);
    // const chan = await client.conversations.info({
    //   channel: channel_id,
    // });
    const chan = await client.apiCall("conversations.info", {
      channel: channel_id,
    });
    console.log("channel info", chan);

    if (!chan.ok) {
      const error = `I can't sent messages to that channel: ${chan.error}`;
      // send an ephemeral message
      return { error };
    }

    // await Schema.slack.functions.SendMessage({
    //   channel_id: inputs.channel_id,
    //   message: "raaaa",
    // });

    // get the npc details by name

    const npc_name = inputs.npc ? inputs.npc : "";
    // const channel_id = inputs.channel_id ? inputs.channel_id : "";
    const npcObject = await client.apps.datastore.query<
      typeof NpcObjectDatastore.definition
    >({
      datastore: "NpcObjects",
      expression: "#npcname = :name",
      expression_attributes: { "#npcname": "name" },
      expression_values: { ":name": npc_name },
    });

    if (!npcObject.ok) {
      const error = `Failed to retrieve a row in datastore: ${npcObject.error}`;
      // send an ephemeral message
      // await Schema.slack.functions.SendDm({
      //   user_id: inputs.user_id,
      //   message: error,
      // });
      return { error };
    }

    console.log(npcObject);

    const msg = await client.chat.postMessage({
      channel: channel_id,
      blocks: inputs.message,
      icon_url: npcObject.items[0].avatar,
      username: npcObject.items[0].name,
    });
    console.log(msg);

    if (!msg.ok) {
      await Schema.slack.functions.SendDm({
        user_id: inputs.user_id,
        message: `Failed to send message: ${msg.error}`,
      });
      // await client.chat.postMessage({
      //   channel: inputs.user_id,
      //   text: `Failed to send message: ${msg.error}`,
      // });
      return { error: `Failed to send message: ${msg.error}` };
    }

    return { outputs: {}, completed: true };
  },
);
