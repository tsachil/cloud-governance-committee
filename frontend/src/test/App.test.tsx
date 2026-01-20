import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import axios from 'axios'
import App from '../App'

// Mock axios
vi.mock('axios')

describe('App Component', () => {
  it('renders the main title', () => {
    (axios.get as any).mockResolvedValue({ data: [] })
    render(<App />)
    expect(screen.getByText('Cloud Governance Committee')).toBeInTheDocument()
  })

  it('displays participants column in table', async () => {
    const mockServices = [{
      id: 1,
      name: 'Test Service',
      provider: 'AWS',
      participants: 'User A, User B',
      total_score: 80,
      impact_level: 'High'
    }];
    
    (axios.get as any).mockResolvedValue({ data: mockServices })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('User A, User B')).toBeInTheDocument()
      expect(screen.getByText('High')).toBeInTheDocument()
    })
  })

  it('calculates Medium impact score correctly in modal', async () => {
    (axios.get as any).mockResolvedValue({ data: [] })
    render(<App />)

    fireEvent.click(screen.getByText('Add New Service'))

    // Set failure to 30 and data leakage to 20 -> Total 50 (Medium)
    const q1Input = screen.getByLabelText(/Impact of Failure/i)
    fireEvent.change(q1Input, { target: { value: '30' } })

    const q2Input = screen.getByLabelText(/Impact of Data Leakage/i)
    fireEvent.change(q2Input, { target: { value: '20' } })

    expect(screen.getByText(/Total Score: 50/i)).toBeInTheDocument()
    expect(screen.getByText(/Medium Impact/i)).toBeInTheDocument()
  })
})
