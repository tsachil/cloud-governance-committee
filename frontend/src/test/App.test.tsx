import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import App from '../App'

// Mock axios
vi.mock('axios')

describe('App Component', () => {
  it('renders the main title', () => {
    // Mock get request to return empty list initially
    (axios.get as any).mockResolvedValue({ data: [] })
    
    render(<App />)
    
    expect(screen.getByText('Cloud Governance Committee')).toBeInTheDocument()
    expect(screen.getByText('Add New Service')).toBeInTheDocument()
  })

  it('fetches and displays services', async () => {
    const mockServices = [
      {
        id: 1,
        name: 'Test Service',
        provider: 'AWS',
        category: 'Compute',
        cost: 100,
        owner: 'Test Owner',
        status: 'Active'
      }
    ]

    ;(axios.get as any).mockResolvedValue({ data: mockServices })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Test Service')).toBeInTheDocument()
      expect(screen.getByText('Test Owner')).toBeInTheDocument()
    })
  })

  it('opens modal when Add New Service is clicked', async () => {
    (axios.get as any).mockResolvedValue({ data: [] })
    render(<App />)

    const addButton = screen.getByText('Add New Service')
    fireEvent.click(addButton)

    expect(screen.getByText('Add New Service', { selector: '.modal-title' })).toBeInTheDocument()
    expect(screen.getByLabelText('Service Name')).toBeInTheDocument()
  })
})
