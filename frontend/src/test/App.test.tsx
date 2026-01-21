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
    expect(screen.getByText('Cloud Governance Committee')).toBeInTheDocument()
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

    fireEvent.click(screen.getByText('Add New Service'))

    await waitFor(() => {
      expect(screen.getByLabelText('CTO Representative')).toBeInTheDocument()
      expect(screen.getByLabelText('Security Representative')).toBeInTheDocument()
      expect(screen.getByLabelText('Date')).toBeInTheDocument()
      expect(screen.getByLabelText('Provider')).toHaveAttribute('type', 'text')
      // Check for the new field
      expect(screen.getByLabelText('Committee Notes')).toBeInTheDocument()
    })
  })
})
