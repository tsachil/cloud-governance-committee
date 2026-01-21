import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import App from '../App'

// Mock axios
vi.mock('axios')

describe('App Component', () => {
  it('renders the main title', () => {
    (axios.get as any).mockResolvedValue({ data: [] })
    render(<App />)
    expect(screen.getByText('ועדת ממשל ענן')).toBeInTheDocument()
  })

  it('displays new columns in table', async () => {
    const mockServices = [{
      id: 1,
      name: 'Test Service',
      provider: 'CustomCloud',
      service_date: '2023-01-01',
      representative_cto: 'Alice',
      representative_security: 'Bob',
      total_score: 10,
      impact_level: 'Minimal'
    }];
    
    (axios.get as any).mockResolvedValue({ data: mockServices })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('CustomCloud')).toBeInTheDocument()
      expect(screen.getByText('2023-01-01')).toBeInTheDocument()
      expect(screen.getByText('Alice / Bob')).toBeInTheDocument()
    })
  })

  it('opens modal with new inputs including committee notes', async () => {
    (axios.get as any).mockResolvedValue({ data: [] })
    render(<App />)

    fireEvent.click(screen.getByText('הוסף שירות חדש'))

    await waitFor(() => {
      expect(screen.getByLabelText('נציג CTO')).toBeInTheDocument()
      expect(screen.getByLabelText('נציג אבטחת מידע')).toBeInTheDocument()
      expect(screen.getByLabelText('תאריך')).toBeInTheDocument()
      expect(screen.getByLabelText('ספק')).toHaveAttribute('type', 'text')
      // Check for the new field
      expect(screen.getByLabelText('הערות הוועדה')).toBeInTheDocument()
    })
  })
})