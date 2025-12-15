
import mongoose from 'mongoose'

export async function connectDb() {
    if (!process.env.MONGODB_URI) return
    if (mongoose.connection && mongoose.connection.readyState === 1) return
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('Mongo connect error', err)
    }
}
