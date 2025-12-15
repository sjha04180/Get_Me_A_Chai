import mongoose from 'mongoose'
const { Schema, model } = mongoose

const UserSchema = new Schema(
    {
        name: String,

        username: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        profilepic: String,
        coverpic: String,

        razorpayId: String,

        // 🔐 VERY IMPORTANT
        razorpaySecret: {
            type: String
        }
    },
    {
        timestamps: true // ✅ auto createdAt & updatedAt
    }
)

export default mongoose.models.User || model('User', UserSchema)
