const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const ProgressBar = require("progress");
const { getVideoDuration } = require("./utils");

// input path for the background image
// Read all image files from the folder '../boberImages'
const imageFolderPath = path.join(__dirname, "../boberImages");
const imageFiles = fs
  .readdirSync(imageFolderPath)
  .filter((file) => [".png", ".jpg", ".jpeg"].includes(path.extname(file)));

// Select a random image from the folder

// Function to generate video with audio waveform
async function generateVideoWithWaveform(input, output) {
  const bgImageInput = path.join(
    imageFolderPath,
    imageFiles[Math.floor(Math.random() * imageFiles.length)]
  );
  const bgVideoDurationSec = await getVideoDuration(input);
  return new Promise((resolve, reject) => {
    let bar = new ProgressBar("Processing [:bar] :percent", {
      total: 100,
      width: 40,
    });
    ffmpeg(input)
      .input(bgImageInput)
      .inputOptions([
        "-loop 1", // Loop the image
        `-t ${bgVideoDurationSec}`, // Set the duration to the length of the audio
      ])
      .outputOptions(["-c:v libx264", "-c:a aac", "-shortest"])
      .on("start", (commandLine) => {
        console.log("Spawned Ffmpeg with command: " + commandLine);
        bar = new ProgressBar("Processing [:bar] :percent", {
          total: 100,
          width: 40,
        });
      })
      .on("error", (err, stdout, stderr) => {
        console.error("Error: " + err.message);
        console.error("ffmpeg stderr: " + stderr);
        reject(err);
      })
      .on("progress", (progress) => {
        bar.update(progress.percent / 100);
      })
      .on("end", () => {
        console.log("Processing finished!");
        resolve();
      })
      .save(output);
  });
}

async function start(params) {
  // Generate the video
  // Read all mp3 files from the folder '_instrumental'
  const inputFolderPath = path.join(__dirname, "../bober1");
  const outputFolderPath = path.join(__dirname, "../_songs_videos");
  const mp3Files = fs
    .readdirSync(inputFolderPath)
    .filter((file) => path.extname(file) === ".mp3");

  // Generate videos for each mp3 file
  for (const file of mp3Files) {
    const inputFilePath = path.join(inputFolderPath, file);
    const outputFilePath = path.join(
      outputFolderPath,
      path.basename(file, ".mp3") + ".mp4"
    );
    await generateVideoWithWaveform(inputFilePath, outputFilePath);
  }
}

start();
