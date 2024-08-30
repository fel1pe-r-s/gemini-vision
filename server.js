const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function filesCreateImage(pathImage) {
  const fileManager = new GoogleAIFileManager(process.env.API_KEY);
  const uploadResult = await fileManager.uploadFile(
    `./temp/uploads/${pathImage}`,
    {
      mimeType: "image/png",
      displayName: "Jetpack drawing",
    }
  );
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    "Extract the current meter reading and label it as measure_consumption.",
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);

  // View the response.
  return result.response.text();
  // [END files_create_image]
}

const pathImage = "image.png";

function convertJson(stringComFormatacao) {
  const jsonStringLimpa = stringComFormatacao
    .replace(/```json|```|`/g, "")
    .trim();
  const jsonObject = JSON.parse(jsonStringLimpa);

  return jsonObject;
}

async function main() {
  const jsonString = await filesCreateImage(pathImage);

  const jsonObject = convertJson(jsonString);
  console.log(jsonObject.measure_consumption);
}
main();
