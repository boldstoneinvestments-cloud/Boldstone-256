import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { farmerApi, saveFarmerToken } from './farmerApi'
import './FarmerDashboard.css'

export default function FarmerAuth({ mode = 'sign-in' }) {
  const signup = mode === 'sign-up'
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', farm_name: '', location: '', district: '', acres: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async event => {
    event.preventDefault()
    if (signup && form.password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = signup ? form : { email: form.email, password: form.password }
      const result = await farmerApi(`auth/${mode}`, { method: 'POST', body: JSON.stringify(payload) })
      saveFarmerToken(result.token)
      localStorage.setItem('boldstone_farmer_account', JSON.stringify(result.farmer))
      navigate(location.state?.from || '/farmers/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="farmer-auth-page">
      <section className="farmer-auth-panel">
        <Link className="farmer-auth-brand" to="/farmers">BOLDSTONE <span>FARMER PORTAL</span></Link>
        <span className="farmer-section-label">FARM WORKSPACE ACCESS</span>
        <h1>{signup ? 'Create your farmer account' : 'Welcome back'}</h1>
        <p>{signup ? 'Register your farm to access its records and services.' : 'Sign in to view your farm records and applications.'}</p>
        <form onSubmit={submit} aria-busy={saving}>
          {signup && <>
            <label>Full name<input name="name" value={form.name} onChange={update} autoComplete="name" required /></label>
            <label>Phone number<input name="phone" value={form.phone} onChange={update} autoComplete="tel" /></label>
            <label>Farm name<input name="farm_name" value={form.farm_name} onChange={update} required /></label>
            <div className="farmer-auth-form-row">
              <label>District<input name="district" value={form.district} onChange={update} required /></label>
              <label>Farm size (acres)<input name="acres" type="number" min="0.01" step="0.01" value={form.acres} onChange={update} required /></label>
            </div>
            <label>Farm location<input name="location" value={form.location} onChange={update} required /></label>
          </>}
          <label>Email address<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required /></label>
          <label>Password<div className="farmer-auth-password-field"><input name="password" type={showPassword ? 'text' : 'password'} minLength="8" value={form.password} onChange={update} autoComplete={signup ? 'new-password' : 'current-password'} required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} aria-hidden="true" /></button></div></label>
          {signup && <label>Confirm password<div className="farmer-auth-password-field"><input name="confirm-password" type={showConfirmPassword ? 'text' : 'password'} minLength="8" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" required /><button type="button" onClick={() => setShowConfirmPassword(value => !value)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}><FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} aria-hidden="true" /></button></div></label>}
          {error && <p className="farmer-auth-inline-error" role="alert">{error}</p>}
          <button className="farmer-primary-button" type="submit" disabled={saving}>
            {saving ? 'Please wait...' : signup ? 'Register' : 'Sign in'}
          </button>
        </form>
        <p className="farmer-auth-switch">
          {signup ? 'Already registered?' : 'New farmer?'}{' '}
          <Link to={signup ? '/farmers/sign-in' : '/farmers/sign-up'}>{signup ? 'Sign in' : 'Create an account'}</Link>
        </p>
      </section>
    </main>
  )
}