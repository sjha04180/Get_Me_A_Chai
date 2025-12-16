"use server"
import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import User from "@/models/User"
import { connectDb } from "@/db/connectDb"


export const initiate = async (amount, to_username, paymentform) => {

    await connectDb()

    // fetch the secret of the user who is receiving the payment
    const user = await User.findOne({ username: to_username }).exec()
    const keyId =
        user?.razorpayId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''

    const keySecret =
        user?.razorpaySecret || process.env.RAZORPAY_KEY_SECRET || ''

    if (!keyId || !keySecret) {
        throw new Error("Razorpay credentials not configured")
    }

    var instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    })

    instance.orders.create({
        amount: 50000,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    })
    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",

    }

    let x = await instance.orders.create(options)

    //create a payment which shows a pending payment in the database
    await Payment.create({ oid: x.id, amount: amount / 100, to_user: to_username, name: paymentform.name, message: paymentform.message })
    return x
}

export const fetchUser = async (username) => {
    await connectDb()
    // Explicitly select razorpaySecret even though it has select: false
    const u = await User.findOne({ username: username }).select('+razorpaySecret')
    if (!u) return null
    const user = u.toObject ? u.toObject({ flattenObjectIds: true }) : u
    return JSON.parse(JSON.stringify(user))
}
//Fetch only top 10 payments
export const fetchPayments = async (username) => {
    await connectDb()
    //find all payments sorted by decreasing order of amount and flatten object ids
    let p = await Payment.find({ to_user: username, done: true }).sort({ amount: -1 }).lean()

    return JSON.parse(JSON.stringify(p))
}



export const updateProfile = async (data, oldusername) => {
    await connectDb()

    let ndata

    // ✅ Normalize input
    if (data instanceof FormData) {
        ndata = Object.fromEntries(data)
    } else if (data && typeof data === 'object') {
        ndata = data
    } else {
        throw new Error('Unsupported data format for updateProfile')
    }

    // ✅ Allow only safe fields (VERY IMPORTANT)
    // Filter out undefined values but keep empty strings
    const updateFields = {}
    if (ndata.name !== undefined) updateFields.name = ndata.name
    if (ndata.username !== undefined) updateFields.username = ndata.username
    if (ndata.email !== undefined) updateFields.email = ndata.email
    if (ndata.profilepic !== undefined) updateFields.profilepic = ndata.profilepic
    if (ndata.coverpic !== undefined) updateFields.coverpic = ndata.coverpic
    if (ndata.razorpayId !== undefined) updateFields.razorpayId = ndata.razorpayId
    if (ndata.razorpaySecret !== undefined) updateFields.razorpaySecret = ndata.razorpaySecret



    // ✅ If username changed → check availability
    if (oldusername !== ndata.username) {
        const existing = await User.findOne({
            username: ndata.username,
            email: { $ne: ndata.email }
        })

        if (existing) {
            return { error: 'Username already exists' }
        }

        // ✅ Update user
        await User.updateOne(
            { email: ndata.email },
            { $set: updateFields }
        )

        // ✅ Sync payments
        await Payment.updateMany(
            { to_user: oldusername },
            { $set: { to_user: ndata.username } }
        )

    } else {
        // ✅ Normal update
        await User.updateOne(
            { email: ndata.email },
            { $set: updateFields }
        )
    }

    return { success: true }
}

