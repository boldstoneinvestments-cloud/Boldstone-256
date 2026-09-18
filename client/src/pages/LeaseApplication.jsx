import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const plans = ['Starter Plan', 'Growth Plan']

export default function LeaseApplication() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', country: '', address: '',
    plan: plans.includes(searchParams.get('plan')) ? searchParams.get('plan') : 'Starter Plan',
    notes: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async event => {
    event.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const response = await fetch(`${BACKEND}/api/lease-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
      setError('We could not submit your details. Please try again.')
    }
  }

  if (status === 'success') {
    return <main className="lease-application-page"><div className="lease-application-card success"><span className="lease-application-kicker">Application received</span><h1>Thank you, {form.full_name}.</h1><p>Our team will review your {form.plan} interest and contact you using the details provided.</p></div></main>
  }

  return (
    <>
      <Helmet><title>Get Started | Boldstone Coffee Farm</title></Helmet>
      <main className="lease-application-page">
        <div className="lease-application-intro"><span className="lease-application-kicker">Get started</span><h1>Tell us about yourself</h1><p>Complete your details and our team will help you take the next step toward your managed coffee farm.</p></div>
        <form className="lease-application-card" onSubmit={submit}>
          <div className="lease-application-plan"><span>Selected plan</span><strong>{form.plan}</strong></div>
          <div className="lease-application-grid">
            <label>Full name *<input name="full_name" value={form.full_name} onChange={update} required autoComplete="name" /></label>
            <label>Email address *<input name="email" type="email" value={form.email} onChange={update} required autoComplete="email" /></label>
            <label>Phone number *<input name="phone" type="tel" value={form.phone} onChange={update} required autoComplete="tel" /></label>
            <label>Country *<input name="country" value={form.country} onChange={update} required autoComplete="country-name" /></label>
            <label className="full-field">Address or city<label><input name="address" value={form.address} onChange={update} autoComplete="street-address" /></label></label>
            <label className="full-field">What would you like us to know?<textarea name="notes" rows="4" value={form.notes} onChange={update} placeholder="Tell us about your goals or questions..." /></label>
          </div>
          {error && <p className="lease-application-error">{error}</p>}
          <button className="lease-application-submit" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Submitting...' : 'Submit application'}</button>
        </form>
      </main>
    </>
  )
}
