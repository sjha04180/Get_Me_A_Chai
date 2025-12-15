'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { fetchUser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';

export default function Dashboard() {
  const router = useRouter()
  const { data: session, status, update } = useSession()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    profilepic: '',
    coverpic: '',
    razorpayId: '',
    razorpaySecret: ''
  })

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // 🧑 Load user data from session
  useEffect(() => {
    if (!session) return

    const username = session.user.email?.split('@')[0] || ''

    setForm(prev => ({
      ...prev,
      name: session.user.name || '',
      username: '',
      email: session.user.email || '',
      profilepic: session.user.image || ''
    }))
  }, [session])

  // 📦 Fetch extra user data from DB
  useEffect(() => {
    if (!session) return

    const loadUser = async () => {
      const username = session.user.email?.split('@')[0] || ''
      const data = await fetchUser(username)
      if (data) {
        setForm(prev => ({ ...prev, ...data }))
      }
    }
    loadUser()
  }, [session])

  // ⏳ Loading UI
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!session) return null

  const profileImage =
    form.profilepic?.trim()
      ? form.profilepic
      : '/favicon.ico'

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()

    const username = session.user.email?.split('@')[0] || ''

    await updateProfile(form, username)

    if (typeof update === 'function') update()

    setEditing(false)
    alert("done")
    toast('Profile updated!', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",

    });
  }

  return (
    <>
      <ToastContainer
        position="bottom-right"
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

      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow p-6">

            <div className="flex justify-center items-center gap-4">
              <img
                src={profileImage}
                alt={form.name || 'Profile'}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
              />

              <div className="md:flex-1 md:flex justify-between items-center space-y-3 ">
                <div>
                  <h2 className="text-xl font-semibold">
                    {form.name || 'Creator'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {form.email}
                  </p>
                </div>

                <button
                  onClick={() => setEditing(e => !e)}
                  className="px-3 py-1 bg-blue-800 hover:bg-blue-500 rounded-lg"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {editing && (
              <form onSubmit={handleSave} className="mt-6 space-y-4">

                {[
                  ['name', 'Name', 'text'],
                  ['username', 'Username', 'text'],
                  ['email', 'Email', 'email'],
                  ['profilepic', 'Profile Picture URL', 'text'],
                  ['coverpic', 'Cover Picture URL', 'text'],
                  ['razorpayId', 'Razorpay Key ID', 'password'],
                  ['razorpaySecret', 'Razorpay Key Secret', 'password']
                ].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="block text-sm text-gray-300 mb-1">
                      {label}
                    </label>
                    <input
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      type={type}
                      className="w-full bg-gray-800 border border-gray-700 text-gray-100 px-3 py-2 rounded"
                    />
                  </div>
                ))}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

