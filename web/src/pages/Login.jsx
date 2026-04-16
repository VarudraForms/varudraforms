import { useState } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../firebase'
export default function Login() {
const [phone, setPhone] = useState('')
const [otp, setOtp] = useState('')
const [step, setStep] = useState('phone')
const [confirm, setConfirm] = useState(null)
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)
const setupRecaptcha = () => {
if (!window.recaptchaVerifier) {
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
size: 'invisible',
callback: () => {},
})
}
}
const sendOTP = async () => {
if (phone.length !== 10) { setError('Enter 10-digit mobile number'); return }
setLoading(true); setError('')
try {
setupRecaptcha()
const result = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier)
setConfirm(result); setStep('otp')
} catch (err) {
setError('Could not send OTP. Check number and try again.')
} finally { setLoading(false) }
}
const verifyOTP = async () => {
if (otp.length !== 6) { setError('Enter 6-digit OTP'); return }
setLoading(true); setError('')
try {
await confirm.confirm(otp)
} catch (err) {
setError('Wrong OTP — please try again')
} finally { setLoading(false) }
}
return (
<div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-6">
<div className="w-full max-w-sm">
<div className="text-center mb-10">
<div className="text-5xl mb-3">📋</div>
<h1 className="text-3xl font-bold text-green-800">VarudraForms</h1>
<p className="text-green-600 mt-1 text-sm">వరుద్ర ఫారమ్స్</p>
</div>
{step === 'phone' ? (
<div>
<p className="text-gray-600 text-center mb-6 text-base">
మీ మొబైల్ నంబర్ ఇవ్వండి</p>
<div className="flex items-center border-2 border-green-300 rounded-xl bg-white mb-4 overflow-hidden">
<span className="px-4 py-5 text-gray-500 font-bold text-lg border-r border-green-200">+91</span>
<input type="tel" inputMode="numeric" maxLength={10}
className="flex-1 px-4 py-5 text-xl outline-none"
placeholder="9876543210"
value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))} />
</div>
<button onClick={sendOTP} disabled={loading}
className="w-full bg-green-700 text-white py-5 rounded-xl text-xl font-bold active:bg-green-800 disabled:opacity-50">
{loading ? 'పంపిస్తున్నాం...' : 'OTP పంపండి →'}
</button>
</div>
) : (
<div>
<p className="text-gray-600 text-center mb-6">
+91 {phone} కి OTP వచ్చింది</p>
<input type="tel" inputMode="numeric" maxLength={6}
className="w-full border-2 border-green-300 rounded-xl px-4 py-5 text-3xl text-center tracking-widest mb-4 outline-none"
placeholder="------"
value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))} />
<button onClick={verifyOTP} disabled={loading}
className="w-full bg-green-700 text-white py-5 rounded-xl text-xl font-bold mb-3">
{loading ? 'వెరిఫై చేస్తున్నాం...' : 'లాగిన్ →'}
</button>
<button onClick={() => setStep('phone')} className="w-full text-green-700 py-3 text-sm">
← నంబర్ మార్చండి</button>
</div>
)}
{error && <p className="text-red-600 text-center mt-4 text-sm">{error}</p>}
<div id="recaptcha-container"></div>
</div>
</div>
)
}