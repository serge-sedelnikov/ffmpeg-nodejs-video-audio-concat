const getVideoDurationInSeconds =
  require("get-video-duration").getVideoDurationInSeconds;

const getVideoDuration = async (inputVideoPath) => {
  const duration = await getVideoDurationInSeconds(inputVideoPath);
  console.log(`Video duration: ${duration} seconds`);
  return duration;
};

module.exports = {
  getVideoDuration,
};
