import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastores are a Slack-hosted location to store
 * and retrieve data for your app.
 * https://api.slack.com/automation/datastores
 */
const NpcObjectDatastore = DefineDatastore({
  name: "NpcObjects",
  primary_key: "object_id",
  attributes: {
    object_id: {
      type: Schema.types.string,
    },
    name: {
      type: Schema.types.string,
    },
    avatar: {
      type: Schema.types.string,
    },
  },
});

export default NpcObjectDatastore;
