const nsfwjs = require("nsfwjs-node");
const { createCanvas, Image } = require("canvas");

const toImageDataFromBase64 = async imgurl => {
  const { image, error } = await new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve({ image, error: false });
    image.onerror = () => resolve({ image: null, error: true });

    image.src = imgurl;
  });

  if (error) return { error };

  const canvas = createCanvas(200, 200);
  var context = canvas.getContext("2d");
  var height = image.height;
  var width = image.width;

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0);

  return { imageData: context.getImageData(0, 0, width, height), error: null };
};

let model;
(async () => (model = await nsfwjs.load()))();

const nsfw = async img => {
  const { imageData, error } = await toImageDataFromBase64(img);
  if (error) throw Error(`toImageDataFromBase64 failed: ${error}`);

  const input = nsfwjs.imageToInput(imageData, nsfwjs.NUMBER_OF_CHANNELS);
  model = model || (await nsfwjs.load());

  const predictions = await model.classify(input);
  return predictions.reduce((result, prediction) => {
    result[prediction.className] = prediction.probability;
    return result;
  }, {});
};

module.exports = { nsfw };
