import test from 'node:test'
import assert from 'node:assert/strict'

import { getEnvString, requireEnvString } from '../src/env.js'

test('getEnvString returns undefined for missing/empty values', () => {
  const previous = process.env.TEST_ENV_VALUE
  try {
    delete process.env.TEST_ENV_VALUE
    assert.equal(getEnvString('TEST_ENV_VALUE'), undefined)

    process.env.TEST_ENV_VALUE = ''
    assert.equal(getEnvString('TEST_ENV_VALUE'), undefined)
  } finally {
    if (typeof previous === 'undefined') delete process.env.TEST_ENV_VALUE
    else process.env.TEST_ENV_VALUE = previous
  }
})

test('getEnvString returns value when set', () => {
  const previous = process.env.TEST_ENV_VALUE
  try {
    process.env.TEST_ENV_VALUE = 'abc'
    assert.equal(getEnvString('TEST_ENV_VALUE'), 'abc')
  } finally {
    if (typeof previous === 'undefined') delete process.env.TEST_ENV_VALUE
    else process.env.TEST_ENV_VALUE = previous
  }
})

test('requireEnvString throws for missing values', () => {
  const previous = process.env.TEST_ENV_VALUE
  try {
    delete process.env.TEST_ENV_VALUE
    assert.throws(() => requireEnvString('TEST_ENV_VALUE'), {
      message: 'Missing environment variable TEST_ENV_VALUE.',
    })
  } finally {
    if (typeof previous === 'undefined') delete process.env.TEST_ENV_VALUE
    else process.env.TEST_ENV_VALUE = previous
  }
})

