import test from 'node:test'
import assert from 'node:assert/strict'

import {
  calculateLoanRepayment,
  getHarvestSeason,
  formatUgx,
  getLoanTypeLabel,
} from './loanCalculator.js'

test('calculates principal, interest, total repayment, and coffee quantity', () => {
  const result = calculateLoanRepayment({
    amount: 2_000_000,
    interestRate: 0.1,
    coffeePricePerKg: 8_750,
  })

  assert.equal(result.principal, 2_000_000)
  assert.equal(result.interestAmount, 200_000)
  assert.equal(result.totalRepayment, 2_200_000)
  assert.equal(result.coffeeKg, 251.43)
})

test('uses the loan type label in the application summary', () => {
  assert.equal(getLoanTypeLabel('cash'), 'Cash loan')
  assert.equal(getLoanTypeLabel('fertilizer'), 'Fertilizer loan')
})

test('detects the active harvest season from the application date', () => {
  const season = getHarvestSeason(new Date('2026-10-07'))

  assert.equal(season.name, 'Main harvest')
  assert.equal(season.start, 'September 1')
  assert.equal(season.end, 'January 31')
  assert.deepEqual(season.months, [9, 10, 11, 12, 1])
})

test('formats ugx values for the farmer UI', () => {
  assert.equal(formatUgx(1234567), 'UGX 1,234,567')
})
