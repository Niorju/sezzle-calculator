import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Calculator } from './Calculator'
import * as api from '../services/api'

vi.mock('../services/api')

describe('Calculator', () => {
  beforeEach(() => {
    vi.mocked(api.calculate).mockReset()
  })

  it('renders calculator UI', () => {
    render(<Calculator />)
    expect(screen.getByText('Calculator')).toBeInTheDocument()
    const display = screen.getByRole('region', { name: 'Display' })
    expect(display).toHaveTextContent('0')
  })

  it('displays digit when clicked', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    const display = screen.getByRole('region', { name: 'Display' })
    expect(display).toHaveTextContent('7')
  })

  it('clears display when C is clicked', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    fireEvent.click(screen.getByRole('button', { name: 'C' }))
    const display = screen.getByRole('region', { name: 'Display' })
    expect(display).toHaveTextContent('0')
  })

  it('calls API for sqrt and displays result', async () => {
    vi.mocked(api.calculate).mockResolvedValueOnce(4)
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '6' }))
    fireEvent.click(screen.getByRole('button', { name: '√' }))
    expect(api.calculate).toHaveBeenCalledWith({ a: 16, operation: 'sqrt' })
    const display = screen.getByRole('region', { name: 'Display' })
    await waitFor(() => expect(display).toHaveTextContent('4'))
  })

  it('shows error on API failure', async () => {
    vi.mocked(api.calculate).mockRejectedValueOnce(new Error('division by zero'))
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '÷' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    const display = screen.getByRole('region', { name: 'Display' })
    await waitFor(() => expect(display).toHaveTextContent('division by zero'))
  })
})
