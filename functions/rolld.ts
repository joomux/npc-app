import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import NpcObjectDatastore from "../datastores/npc_datastore.ts";

export const RolldDefinition = DefineFunction({
  callback_id: "rolld",
  title: "Roll a die",
  source_file: "functions/rolld.ts",
  description: "Generate results form dice rolls",
  input_parameters: {
    properties: {
      rollexpression: {
        type: Schema.types.string,
        description: "Roll Expression",
        title: "Roll Expression",
        hint: "Eg, 1d20+2",
      },
    },
    required: ["rollexpression"],
  },
  output_parameters: {
    properties: {
      rollresult: {
        type: Schema.types.string,
        description: "Roll Result",
        title: "Roll Result",
      },
      rollmakeup: {
        type: Schema.types.string,
        description: "Raw roll result",
        title: "Raw roll result",
      },
      // interactivity: {
      //   type: Schema.slack.types.interactivity,
      // },
    },
    required: ["rollresult", "rollmakeup"],
  },
});

export default SlackFunction(
  RolldDefinition,
  async ({ inputs, client }) => {
    const headers = {
      "Content-Type": "application/json",
    };

    const url = "https://rpg-dice-roller-api.djpeacher.com/api/roll/" +
      inputs.rollexpression;

    console.log("hitting endpoint ", url);

    // const result = await fetch(
    //   url,
    //   {
    //     method: "GET",
    //     headers,
    //   },
    // ).then((response) => {
    //   const res = response;
    // }).then((data) => {
    //   const da = data;
    // });

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    let rollresult = "";
    let rollmakeup = "";
    console.log(typeof data);
    if (!data.total) {
      console.log("error: ", data.error);
      rollresult = "Error";
      rollmakeup = data.error;
    } else {
      const result = data.total;

      rollresult = result;
      const rollregex = new RegExp(/\[([\d,\s]+)\]/);
      const rolls = data.output.match(rollregex);
      const eachroll = rolls[1].split(", ");
      console.log("eachroll ", eachroll);
      rollmakeup = data.output;
      // for (let x = 0; x < eachroll.length; x++) {
      //   if (parseInt(eachroll[x]) == 1) {
      //     rollresult += " (oh no, you rolled a natural 1)";
      //   }
      // }
    }
    return { outputs: { rollresult, rollmakeup } };

    // return { outputs: { npclist, npclist_ids, interactivity } };
  },
);
