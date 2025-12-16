"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import Script from 'next/script'
import { initiate } from '@/actions/useractions'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { fetchUser, fetchPayments } from '@/actions/useractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';


const PaymentPage = ({ username }) => {
    const { data: session } = useSession()
    const [paymentform, setPaymentform] = useState({ name: '', message: '', amount: '' })
    const [currentUser, setcurrentUser] = useState({})
    const [payments, setPayments] = useState([])
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        const paymentDone = searchParams.get("paymentdone")

        if (paymentDone === "true") {
            toast('Payment has been made 🎉', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"

            });

            // Change URL AFTER toast renders
            setTimeout(() => {
                router.push(`/${currentUser?.username ? currentUser.username : ""}`)
            }, 1000) // small delay ensures toast renders
        }
    }, [searchParams, router, currentUser?.username])


    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }



    const getData = async () => {
        let u = await fetchUser(username)
        setcurrentUser(u)
        console.log(u)
        let dbpayments = await fetchPayments(username)
        setPayments(dbpayments)
         console.log(dbpayments)
    }

    const pay = async (amount) => {
        // Get the orderId from your server
        const a = await initiate(amount, username, paymentform)
        const orderId = a?.id
        if (!orderId) {
            console.error('No order id returned')
            alert('Unable to start payment. Try again.')
            return
        }

        const publicKey = currentUser.razorpayId ||process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
        if (!publicKey) {
            console.error('Razorpay public key missing (NEXT_PUBLIC_RAZORPAY_KEY_ID).')
            alert('Payment configuration error: payment key missing.')
            return
        }

        const options = {
            key: publicKey,
            amount: amount,
            currency: 'INR',
            name: 'Get Me A Chai',
            description: 'Support payment',
            image: 'https://example.com/your_logo',
            order_id: orderId,
            prefill: {
                name: 'gaurav kumar',
                email: 'GauravKumar@gmai.com',
                contact: '9845903456'
            },
            notes: { address: 'Razorpay Corporate Office' },
            theme: { color: '#3399cc' },
            handler: async function (response) {
                try {
                    const res = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response)
                    })
                    if (!res.ok) throw new Error('Verification failed')
                    router.push(`/${currentUser?.username ? currentUser.username : ""}/?paymentdone=true`)
                } catch (err) {
                    console.error('Verification failed', err)
                    alert('Payment verification failed.')
                }
            }
        }

        const rzp1 = new window.Razorpay(options)
        rzp1.open()
    }

    return (
        <><ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className='cover text-white w-full relative '>
                <img className="object-cover w-full h-48 md:h-[350]" src={currentUser.coverpic} alt="" />
                <div className='absolute top-[66%] md:top-[82%] right-[35%]  md:right-[46%] border-1  rounded-lg'>
                    <img className='rounded-lg' width={120} height={120} src={currentUser.profilepic} alt="" />
                </div>
            </div>
            <div className="info flex flex-col  justify-center items-center my-20 gap-1  ">
                <div className='font-bold text-3xl'>
                    {username}
                </div>
                <div>
                    let's help {username} get a chai!
                </div>
                <div className='text-[#C0BEBE]'>
                    {payments.length} Payments •  ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
                </div>
                <div className="payment flex gap-3 w-[80%] mt-6 flex-col md:flex-row">
                    <div className="supporters w-full md:w-1/2 bg-slate-800   rounded-lg p-5 md:p-10  ">
                        {/* show list of all the supporters as a leaderboard */}
                        <h2 className='text-2xl font-bold mb-5 md:my-5 text-center '>Supporters</h2>
                        <ul className="text-sm h-[35vh] overflow-y-auto">
                            {payments.length == 0 && <li>No payments yet</li>}
                            {payments.map((p, i, key) => {

                                return <div key={p.name} className="flex gap-2 items-center">
                                    <div className="bg-black rounded-full p-1">
                                        <img className='w-5 h-5' src="/avatar.png" alt="user avatar" />
                                    </div>
                                    <li className='my-2'>{p.name} donated <span className="font-bold">₹{(Number(p.amount)).toLocaleString('en-IN')}</span> with a message "{p.message}"</li>
                                </div>
                            })}

                        </ul>
                    </div>
                    <div className="makePayment w-full md:w-1/2  bg-slate-800 rounded-lg p-10 gap-2 ">
                        <h2 className='text-2xl text-center font-bold my-5 '>Make a payment</h2>
                        <div className="flex gap-2 flex-col">

                            <input name="name" onChange={handleChange} value={paymentform.name} type="text" className='w-full p-3 rounded-lg bg-slate-900' placeholder='Enter Name' />
                            <input name="message" onChange={handleChange} value={paymentform.message} type="text" className='w-full p-3 rounded-lg bg-slate-900' placeholder='Enter Message' />
                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <input name="amount" onChange={handleChange} value={paymentform.amount} type="text" className='w-full md:w-3/4 p-3 rounded-lg bg-slate-900' placeholder='Enter Amount' />
                                <button
                                    onClick={() => pay(Number(paymentform.amount) * 100 || 1000)}
                                    type="button"
                                    disabled={paymentform?.name?.length < 3 || paymentform?.message?.length < 4}
                                    className={`
                                    text-white cursor-pointer w-full md:w-1/4 font-medium rounded-lg text-lg px-4 py-2.5 text-center leading-5
                                       focus:outline-none focus:ring-4
                                       transition-all duration-300
                                     ${paymentform?.name?.length < 3 || paymentform?.message?.length < 4 || paymentform?.amount?.length < 1
                                            ? 'bg-slate-400 cursor-not-allowed opacity-70'
                                            : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 focus:ring-green-300'
                                        }
                                     `}
                                >
                                    Pay
                                </button>

                            </div>
                        </div>
                        {/* or choose form these amounts */}
                        <div className="flex gap-2 mt-5 w-full">
                            <button onClick={() => pay(1000)} className={`
                                    text-white cursor-pointer w-full md:w-1/4 font-medium rounded-lg text-lg px-2 py-2 md:py-4 text-center leading-5
                                       focus:outline-none focus:ring-4
                                       transition-all duration-300
                                     ${paymentform?.name?.length < 3 || paymentform?.message?.length < 4
                                    ? 'bg-slate-400 cursor-not-allowed opacity-70'
                                    : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 focus:ring-green-300'
                                }
                                     `}>Pay ₹10</button>
                            <button onClick={() => pay(2000)} className={`
                                    text-white cursor-pointer w-full md:w-1/4 font-medium rounded-lg text-lg px-2 py-2 md:py-4 text-center leading-5
                                       focus:outline-none focus:ring-4
                                       transition-all duration-300
                                     ${paymentform?.name?.length < 3 || paymentform?.message?.length < 4
                                    ? 'bg-slate-400 cursor-not-allowed opacity-70'
                                    : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 focus:ring-green-300'
                                }
                                     `}>Pay ₹20</button>
                            <button onClick={() => pay(3000)} className={`
                                    text-white cursor-pointer w-full md:w-1/4 font-medium rounded-lg text-lg px-2 py-2 md:py-4 text-center leading-5
                                       focus:outline-none focus:ring-4
                                       transition-all duration-300
                                     ${paymentform?.name?.length < 3 || paymentform?.message?.length < 4
                                    ? 'bg-slate-400 cursor-not-allowed opacity-70'
                                    : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 focus:ring-green-300'
                                }
                                     `}>Pay ₹30</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentPage
