import { Config } from "@remotion/cli/config"

Config.setVideoImageFormat("jpeg")
Config.setOverwriteOutput(true)
Config.setCodec("h264")

// Increase timeout for slow renders
Config.setDelayRenderTimeoutInMilliseconds(30000)

// Set concurrency for better performance
Config.setConcurrency(4)
