import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import moment from 'moment'
import { Time } from '../src/time.js'

beforeEach(() => { Time.initialize() })
afterEach(() => { if (Time.isRealtime()) Time.stopRealtime() })

describe('Time.convertToMoment', () => {
  it('clones and converts a moment object to UTC', () => {
    const m = moment.utc('2024-06-15T10:00:00Z')
    const result = Time.convertToMoment(m)
    expect(moment.isMoment(result)).toBe(true)
    expect(result.utcOffset()).toBe(0)
    expect(result).not.toBe(m)
  })
  it('converts a non-Z ISO string to UTC', () => {
    const result = Time.convertToMoment('2024-06-15T10:00:00')
    expect(moment.isMoment(result)).toBe(true)
    expect(result.utcOffset()).toBe(0)
  })
  it('converts a Z ISO string to UTC', () => {
    const result = Time.convertToMoment('2024-06-15T10:00:00.000Z')
    expect(result.toISOString()).toBe('2024-06-15T10:00:00.000Z')
  })
  it('converts a Date object to UTC', () => {
    const d = new Date('2024-06-15T10:00:00.000Z')
    const result = Time.convertToMoment(d)
    expect(moment.isMoment(result)).toBe(true)
  })
})

describe('Time.getRange / patchRange / patchField', () => {
  it('getRange returns an object with start, end and field', () => {
    const range = Time.getRange()
    expect(range).toHaveProperty('start')
    expect(range).toHaveProperty('end')
    expect(range).toHaveProperty('field')
  })
  it('patchRange is a no-op when start and end are the same moment', () => {
    const { start, end } = Time.getRange()
    const queryBefore = JSON.stringify(Time.getRangeQuery())
    Time.patchRange({ start, end })
    expect(JSON.stringify(Time.getRangeQuery())).toBe(queryBefore)
  })
  it('patchRange updates range when start changes', () => {
    const newStart = moment.utc().subtract(3, 'months')
    const { end } = Time.getRange()
    Time.patchRange({ start: newStart, end })
    expect(Time.getRange().start.isSame(newStart)).toBe(true)
  })
  it('patchField is a no-op when field is unchanged', () => {
    const field = Time.getRange().field
    Time.patchField(field)
    expect(Time.getRange().field).toBe(field)
  })
  it('patchField updates the range query field', () => {
    Time.patchField('updatedAt')
    expect(Time.getRange().field).toBe('updatedAt')
    expect(Time.getRangeQuery()).toHaveProperty('updatedAt')
  })
  it('updateTimeRangeQuery rebuilds query from current field', () => {
    Time.updateTimeRangeQuery()
    const field = Time.getRange().field
    expect(Time.getRangeQuery()).toHaveProperty(field)
  })
})

describe('Time.format', () => {
  it('returns an ISO string for format="iso"', () => {
    const iso = Time.format(moment.utc(), 'iso')
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
  it('returns a locale string for format="locale"', () => {
    const str = Time.format(moment.utc(), 'locale')
    expect(typeof str).toBe('string')
    expect(str.length).toBeGreaterThan(0)
  })
  it('returns a formatted string for a named format key', () => {
    const str = Time.format(moment.utc(), 'time.short')
    expect(typeof str).toBe('string')
  })
  it('getCurrentFormattedTime returns all format categories', () => {
    const f = Time.getCurrentFormattedTime()
    expect(f).toHaveProperty('time')
    expect(f).toHaveProperty('date')
    expect(f).toHaveProperty('year')
    expect(f.iso).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})

describe('Time.setCurrentTime / setNow', () => {
  it('setCurrentTime is a no-op when the moment is identical', () => {
    const before = Time.getCurrentTime().toISOString()
    Time.setCurrentTime(Time.getCurrentTime().clone())
    expect(Time.getCurrentTime().toISOString()).toBe(before)
  })
  it('setCurrentTime updates to the new moment', () => {
    const newTime = moment.utc().subtract(1, 'hour')
    Time.setCurrentTime(newTime)
    expect(Time.getCurrentTime().isSame(newTime)).toBe(true)
  })
  it('setNow sets current time to approximately now', () => {
    const before = moment.utc()
    Time.setNow()
    expect(Time.getCurrentTime().isSameOrAfter(before)).toBe(true)
  })
})

describe('Time realtime', () => {
  it('startRealtime sets realtime flag to true', () => {
    Time.startRealtime()
    expect(Time.isRealtime()).toBe(true)
  })
  it('startRealtime does not throw when already active', () => {
    Time.startRealtime()
    expect(() => Time.startRealtime()).not.toThrow()
  })
  it('stopRealtime sets realtime flag to false', () => {
    Time.startRealtime()
    Time.stopRealtime()
    expect(Time.isRealtime()).toBe(false)
  })
  it('stopRealtime does not throw when not active', () => {
    expect(() => Time.stopRealtime()).not.toThrow()
  })
  it('setCurrentTime stops realtime before updating', () => {
    Time.startRealtime()
    const newTime = moment.utc().subtract(1, 'hour')
    Time.setCurrentTime(newTime)
    expect(Time.isRealtime()).toBe(false)
    expect(Time.getCurrentTime().isSame(newTime)).toBe(true)
  })
})

describe('Time.getStep / setStep / roundHours', () => {
  it('setStep is a no-op when step is unchanged', () => {
    const step = Time.getStep()
    Time.setStep(step)
    expect(Time.getStep()).toBe(step)
  })
  it('setStep updates to a new value', () => {
    Time.setStep(30)
    expect(Time.getStep()).toBe(30)
  })
  it('roundHours rounds down to the nearest interval', () => {
    expect(Time.roundHours(10, 6)).toBe(6)
    expect(Time.roundHours(18, 6)).toBe(18)
    expect(Time.roundHours(7, 6)).toBe(6)
    expect(Time.roundHours(0, 6)).toBe(0)
  })
})
