import mongoose from "mongoose"

// Global cache for serverless environments (e.g. Vercel)
let cached = global._mongooseCache

if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null }
}

export const connectDB = async (uri, { timeoutMs = 15000 } = {}) => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            serverSelectionTimeoutMS: timeoutMs,
            family: 4, // Force IPv4, useful occasionally but generally Vercel handles standard DNS well.
        }

        cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (err) {
        cached.promise = null
        throw err
    }

    return cached.conn
}

export const disconnectDB = () => mongoose.disconnect()
