import { useState, useCallback } from 'react'
import { calculate, type Operation } from '../services/api'
import styles from './Calculator.module.css'

const DISPLAY_MAX_LENGTH = 12

function formatDisplay(value: string): string {
  if (value.length <= DISPLAY_MAX_LENGTH) return value
  return value.slice(-DISPLAY_MAX_LENGTH)
}

export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [pendingOp, setPendingOp] = useState<Operation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const clear = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setPendingOp(null)
    setError(null)
  }, [])

  const inputDigit = useCallback((digit: string) => {
    setError(null)
    setDisplay((prev) => {
      if (prev === '0' && digit !== '.') return digit
      if (digit === '.' && prev.includes('.')) return prev
      return formatDisplay(prev + digit)
    })
  }, [])

  const executeOp = useCallback(
    async (op: Operation) => {
      const current = parseFloat(display)
      if (isNaN(current)) return

      if (op === 'sqrt') {
        setLoading(true)
        setError(null)
        try {
          const result = await calculate({ a: current, operation: 'sqrt' })
          setDisplay(String(roundResult(result)))
          setPreviousValue(null)
          setPendingOp(null)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error')
        } finally {
          setLoading(false)
        }
        return
      }

      // x² = square (power with exponent 2) when no binary op pending
      if (op === 'power' && pendingOp === null) {
        setLoading(true)
        setError(null)
        try {
          const result = await calculate({ a: current, b: 2, operation: 'power' })
          setDisplay(String(roundResult(result)))
          setPreviousValue(null)
          setPendingOp(null)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error')
        } finally {
          setLoading(false)
        }
        return
      }

      if (pendingOp && previousValue !== null) {
        setLoading(true)
        setError(null)
        try {
          const result = await calculate({
            a: previousValue,
            b: current,
            operation: pendingOp,
          })
          setDisplay(String(roundResult(result)))
          setPreviousValue(result)
          setPendingOp(op)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error')
        } finally {
          setLoading(false)
        }
      } else {
        setPreviousValue(current)
        setPendingOp(op)
        setDisplay('0')
      }
    },
    [display, previousValue, pendingOp]
  )

  const equals = useCallback(async () => {
    if (pendingOp === null || previousValue === null) return

    const current = parseFloat(display)
    if (isNaN(current)) return

    setLoading(true)
    setError(null)
    try {
      const result = await calculate({
        a: previousValue,
        b: current,
        operation: pendingOp,
      })
      setDisplay(String(roundResult(result)))
      setPreviousValue(null)
      setPendingOp(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [display, previousValue, pendingOp])

  function roundResult(n: number): number {
    if (Number.isInteger(n)) return n
    return Math.round(n * 1e10) / 1e10
  }

  return (
    <div className={styles.calculator}>
      <h1 className={styles.title}>Calculator</h1>
      <div className={styles.display} role="region" aria-label="Display">
        {error ? (
          <span className={styles.error}>{error}</span>
        ) : (
          <span className={styles.value}>
            {loading ? '...' : display}
          </span>
        )}
      </div>
      <div className={styles.buttons}>
        <button className={styles.btnClear} onClick={clear}>
          C
        </button>
        <button className={styles.btnOp} onClick={() => executeOp('sqrt')}>
          √
        </button>
        <button className={styles.btnOp} onClick={() => executeOp('percent')}>
          %
        </button>
        <button className={styles.btnOp} onClick={() => executeOp('divide')}>
          ÷
        </button>

        <button className={styles.btnNum} onClick={() => inputDigit('7')}>
          7
        </button>
        <button className={styles.btnNum} onClick={() => inputDigit('8')}>
          8
        </button>
        <button className={styles.btnNum} onClick={() => inputDigit('9')}>
          9
        </button>
        <button className={styles.btnOp} onClick={() => executeOp('multiply')}>
          ×
        </button>

        <button className={styles.btnNum} onClick={() => inputDigit('4')}>
          4
        </button>
        <button className={styles.btnNum} onClick={() => inputDigit('5')}>
          5
        </button>
        <button className={styles.btnNum} onClick={() => inputDigit('6')}>
          6
        </button>
        <button className={styles.btnOp} onClick={() => executeOp('subtract')}>
          −
        </button>

        <button className={styles.btnNum} onClick={() => inputDigit('1')}>
          1
        </button>
        <button className={styles.btnNum} onClick={() => inputDigit('2')}>
          2
        </button>
        <button className={styles.btnNum} onClick={() => inputDigit('3')}>
          3
        </button>
        <button className={styles.btnOp} onClick={() => executeOp('add')}>
          +
        </button>

        <button className={styles.btnNum} onClick={() => inputDigit('0')}>
          0
        </button>
        <button className={styles.btnNum} onClick={() => inputDigit('.')}>
          .
        </button>
        <button className={styles.btnOp} onClick={() => executeOp('power')}>
          x²
        </button>
        <button className={styles.btnEquals} onClick={equals}>
          =
        </button>
      </div>
    </div>
  )
}
