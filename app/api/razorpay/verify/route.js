import { connectDb } from '@/db/connectDb'
import { NextResponse } from 'next/server'
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils'
import Payment from '@/models/Payment'
import User from '@/models/User'

export async function POST(req) {
    await connectDb()
    try {
        // support both JSON (client handler) and form POST (callback)
        let body
        try {
            body = await req.json()
        } catch (e) {
            const fd = await req.formData()
            body = Object.fromEntries(fd)
        }

        const orderId = body.razorpay_order_id || body['razorpay_order_id']
        const paymentId = body.razorpay_payment_id || body['razorpay_payment_id']
        const signature = body.razorpay_signature || body['razorpay_signature']

        if (!orderId || !paymentId || !signature) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 })
        }

        // Find payment record by order id
        const p = await Payment.findOne({ oid: orderId }).exec()
        if (!p) {
            return NextResponse.json({ success: false, message: 'Order Id not found' }, { status: 404 })
        }

        // fetch the secret of the user who is receiving the payment
        
        const user = await User.findOne({ username: p.to_user }).exec()
        const secret = user?.razorpaySecret || process.env.RAZORPAY_KEY_SECRET || ''


        const valid = validatePaymentVerification({ order_id: orderId, payment_id: paymentId }, signature, secret)

        if (valid) {
            const updatedPayment = await Payment.findOneAndUpdate({ oid: orderId }, { done: true }, { new: true }).exec()
            const redirectUrl = `${process.env.NEXT_PUBLIC_URL || ''}/${updatedPayment.to_user}?paymentdone=true`
            return NextResponse.json({ success: true, redirect: redirectUrl })
        } else {
            return NextResponse.json({ success: false, message: 'Payment Verification Failed' }, { status: 400 })
        }
    } catch (err) {
        console.error('Verify error', err)
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
    }
}
