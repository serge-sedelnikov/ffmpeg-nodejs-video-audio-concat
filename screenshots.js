const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

function takeScreenshot(videoFilePath) {
    const outputDir = path.dirname(videoFilePath);
    const outputFileName = path.basename(videoFilePath, path.extname(videoFilePath)) + '.jpg';
    const outputFilePath = path.join(outputDir, outputFileName);

    ffmpeg(videoFilePath)
        .screenshots({
            timestamps: ['1'],
            filename: outputFileName,
            folder: outputDir
        })
        .on('end', () => {
            console.log('Screenshot taken and saved as', outputFilePath);
        })
        .on('error', (err) => {
            console.error('Error taking screenshot:', err);
        });
}

async function start(params) {
    const inputFolderPath = path.join(__dirname, "../_songs_videos");
    const videoFiles = fs
      .readdirSync(inputFolderPath)
      .filter((file) => path.extname(file) === ".mp4");
  
    // Generate videos for each mp3 file
    for (const file of videoFiles) {
      const inputFilePath = path.join(inputFolderPath, file);
      await takeScreenshot(inputFilePath);
    }
  }
  
  start();