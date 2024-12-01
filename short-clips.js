const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const ProgressBar = require("progress");
const { getVideoDuration } = require("./utils");

// input path for the background video
const bgVideoInput = path.join(__dirname, "../1/output.mp4");
let bgVideoDurationSec = 0;

// Function to generate video with audio waveform
function generateVideoWithWaveform(input, output) {
  return new Promise((resolve, reject) => {
    let bar = new ProgressBar("Processing [:bar] :percent", {
      total: 100,
      width: 40,
    });
    // song can't be longer than 5 min (300 sec), use this as a random start point threshold
    const randomClipStartWithinDuration = Math.ceil(
      (bgVideoDurationSec - 300) * Math.random()
    );
    console.log("Random clip start within duration: " + randomClipStartWithinDuration);
    ffmpeg(input)
      .input(bgVideoInput)
      .inputOptions("-ss " + randomClipStartWithinDuration)
      .outputOptions(["-c:v copy", "-c:a aac", "-shortest"])
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
  bgVideoDurationSec = await getVideoDuration(bgVideoInput);
  // Generate the video
  // Read all mp3 files from the folder '_instrumental'
  const inputFolderPath = path.join(__dirname, "../_songs_unprocessed");
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
