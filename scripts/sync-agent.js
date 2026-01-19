#!/usr/bin/env node

/**
 * INR99 School Enterprise - Sync Agent Runner
 * This script starts the sync agent as a background service
 */

const { SyncAgent } = require("@inr99/sync")

async function main() {
  // Validate required environment variables
  const requiredEnvVars = [
    "SCHOOL_ID",
    "LICENSE_KEY",
    "CLOUD_ENDPOINT",
    "SYNC_SECRET",
    "DATABASE_URL"
  ]

  const missingVars = requiredEnvVars.filter(v => !process.env[v])
  if (missingVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingVars.join(", ")}`)
    process.exit(1)
  }

  const config = {
    schoolId: process.env.SCHOOL_ID,
    licenseKey: process.env.LICENSE_KEY,
    cloudEndpoint: process.env.CLOUD_ENDPOINT,
    syncSecret: process.env.SYNC_SECRET,
    batchSize: parseInt(process.env.BATCH_SIZE) || 100,
    intervalMs: parseInt(process.env.SYNC_INTERVAL_MS) || 60000,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 5
  }

  console.log("Starting INR99 Sync Agent...")
  console.log(`School ID: ${config.schoolId}`)
  console.log(`Cloud Endpoint: ${config.cloudEndpoint}`)
  console.log(`Sync Interval: ${config.intervalMs}ms`)
  console.log(`Batch Size: ${config.batchSize}`)
  console.log("")

  const agent = new SyncAgent(config)

  // Handle graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`)
    await agent.stop()
    console.log("Sync Agent stopped successfully")
    process.exit(0)
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("SIGINT", () => shutdown("SIGINT"))

  // Handle uncaught exceptions
  process.on("uncaughtException", async (error) => {
    console.error("Uncaught Exception:", error)
    await agent.stop()
    process.exit(1)
  })

  process.on("unhandledRejection", async (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason)
  })

  try {
    await agent.start()
    console.log("Sync Agent is running")
    console.log("")
    console.log("Use Ctrl+C to stop")
    console.log("")

    // Log status every minute
    setInterval(async () => {
      const status = await agent.getStatus()
      console.log(`[${new Date().toISOString()}] Status: pending=${status.pendingCount}, failed=${status.failedCount}, lastSync=${status.lastSyncAt?.toISOString() || "never"}`)
    }, 60000)

  } catch (error) {
    console.error("Failed to start Sync Agent:", error)
    process.exit(1)
  }
}

main()
