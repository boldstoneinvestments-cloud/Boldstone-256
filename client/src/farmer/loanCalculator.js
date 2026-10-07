export const coffeePrices = [
  { id: 'robusta-faq', name: 'Robusta FAQ', pricePerKg: 8750 },
  { id: 'robusta-screen-18', name: 'Robusta Screen 18', pricePerKg: 9400 },
  { id: 'arabica-faq', name: 'Arabica FAQ', pricePerKg: 12600 },
]

export const defaultInterestRate = 0.1

export function getLoanTypeLabel(type) {
  return type === 'fertilizer' ? 'Fertilizer loan' : 'Cash loan'
}

export function formatUgx(value) {
  return `UGX ${Number(value || 0).toLocaleString('en-US')}`
}

export function calculateLoanRepayment({ amount, interestRate = defaultInterestRate, coffeePricePerKg }) {
  const principal = Number(amount) || 0
  const rate = Math.max(0, Number(interestRate) || 0)
  const pricePerKg = Number(coffeePricePerKg) || 0
  const interestAmount = principal * rate
  const totalRepayment = principal + interestAmount
  const coffeeKg = pricePerKg > 0 ? totalRepayment / pricePerKg : 0

  return {
    principal,
    interestAmount,
    totalRepayment,
    coffeeKg: Number(coffeeKg.toFixed(2)),
  }
}

export function getHarvestSeason(date = new Date()) {
  const currentDate = new Date(date)
  const currentMonth = currentDate.getMonth() + 1
  const seasons = [
    { id: 'main', name: 'Main harvest', start: 'September 1', end: 'January 31', months: [9, 10, 11, 12, 1] },
    { id: 'early', name: 'Early harvest', start: 'February 1', end: 'April 30', months: [2, 3, 4] },
    { id: 'late', name: 'Late harvest', start: 'May 1', end: 'August 31', months: [5, 6, 7, 8] },
  ]

  const nextSeason = seasons.find(season => season.months.includes(currentMonth)) ?? seasons[0]
  return nextSeason
}
