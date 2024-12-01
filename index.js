const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ProgressBar = require("progress");
const { getVideoDuration } = require("./utils");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const inputVideoPath = "../1/output.MP4";
const inputAudioPath = "../_jazz.mp3";
const outputPath = "../1/result_music_songs.mp4";

const runProcessVideo = (durationSec) => {
  const bar = new ProgressBar("Processing [:bar] :percent", {
    total: 100,
    width: 40,
  });
  ffmpeg(inputVideoPath)
    .addInput(inputAudioPath)
    .outputOptions(["-c:v copy", "-c:a aac", "-shortest"])
    .outputOptions([`-af afade=t=out:st=${durationSec - 5}:d=5`])
    .on("progress", (progress) => {
      bar.update(progress.percent / 100);
    })
    .on("end", () => {
      console.log("Processing finished successfully");
    })
    .on("error", (err) => {
      console.error("Error: " + err.message);
    })
    .save(outputPath);
};

async function start() {
  const durationSec = await getVideoDuration(inputVideoPath);
  runProcessVideo(durationSec);
}

start();
