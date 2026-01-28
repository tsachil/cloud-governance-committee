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
    expect(screen.getByText('ועדת ממשל ענן - דוח מרוכז')).toBeInTheDocument()
  })

  it('displays new columns in table', async () => {
    const mockServices = [{
      id: 1,
      system_name: 'Test Project',
      organization: 'IT',
      committee_date: '2023-01-01',
      requesting_unit: 'Dev',
      requesting_product_manager: 'Alice',
      applicant: 'Bob',
      cmdb_id: '123',
      subsidiaries: 'Sub1',
      solution_description: 'Desc',
      total_score: 55,
      approval_path: 'Board',
      status: 'Approved',
      committee_summary: '',
      committee_notes: '',
      approver: 'Charlie',
      approval_date: '',
      explanation_data_leakage: '',
      score_data_leakage: 0,
      explanation_provider_fit: '',
      score_provider_fit: 0,
      explanation_service_failure: '',
      score_service_failure: 0,
      explanation_compliance: '',
      score_compliance: 0,
      explanation_exit_strategy: '',
      score_exit_strategy: 0,
      vp_technologies: '',
      vp_business_division: '',
      vp_approval_date: '',
      management_approval: '',
      management_approval_date: '',
      board_approval: '',
      board_approval_date: '',
      branch_cto: '',
      branch_infrastructure: '',
      dept_infosec: '',
      tech_risk_management: '',
      additional_factors: '',
      other_factors: '',
      provider_description: '',
      is_significant_outsourcing: '',
      is_significant_cyber: '',
      is_bia_relevant: ''
    }];
    
    (axios.get as any).mockResolvedValue({ data: mockServices })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText('IT')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
      expect(screen.getByText('Approved')).toBeInTheDocument()
    })
  })

  it('opens modal with new inputs', async () => {
    (axios.get as any).mockResolvedValue({ data: [] })
    render(<App />)

    fireEvent.click(screen.getByText('הוסף שירות חדש'))

    await waitFor(() => {
      expect(screen.getByLabelText('שם מערכת / פרויקט')).toBeInTheDocument()
      expect(screen.getByLabelText('ארגון')).toBeInTheDocument()
      expect(screen.getByLabelText('חטיבה דורשת')).toBeInTheDocument()
      expect(screen.getByLabelText('מנהל מוצר דורש')).toBeInTheDocument()
      expect(screen.getByLabelText('מגיש הבקשה')).toBeInTheDocument()
    })
  })
})