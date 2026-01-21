import { useState, useEffect } from 'react'
import { Container, Table, Button, Form, Modal, InputGroup, Row, Col, Badge } from 'react-bootstrap'
import axios from 'axios'

const API_URL = 'http://localhost:8000/services/'

interface CloudService {
  id?: number
  name: string
  description: string
  provider: string
  provider_description: string
  
  // Representatives
  representative_cto: string
  representative_security: string
  representative_infra: string
  representative_risk: string
  representative_other: string
  
  service_date: string // YYYY-MM-DD format

  q_failure: number
  q_data_leakage: number
  q_legal: number
  q_vendor: number
  q_disconnection: number
  
  committee_notes: string

  total_score?: number
  impact_level?: string
}

const DEFAULT_SERVICE: CloudService = {
  name: '', 
  description: '', 
  provider: '', 
  provider_description: '', 
  representative_cto: '',
  representative_security: '',
  representative_infra: '',
  representative_risk: '',
  representative_other: '',
  service_date: new Date().toISOString().split('T')[0],
  q_failure: 0, 
  q_data_leakage: 0, 
  q_legal: 0, 
  q_vendor: 0, 
  q_disconnection: 0,
  committee_notes: ''
}

function App() {
  const [services, setServices] = useState<CloudService[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentService, setCurrentService] = useState<CloudService>(DEFAULT_SERVICE)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}?search=${searchTerm}`)
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services', error)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [searchTerm])

  const handleSave = async () => {
    try {
      if (currentService.id) {
        await axios.patch(`${API_URL}${currentService.id}`, currentService)
      } else {
        await axios.post(API_URL, currentService)
      }
      setShowModal(false)
      fetchServices()
    } catch (error) {
      console.error('Error saving service', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`${API_URL}${id}`)
        fetchServices()
      } catch (error) {
        console.error('Error deleting service', error)
      }
    }
  }

  const openModal = (service?: CloudService) => {
    if (service) {
      setCurrentService(service)
    } else {
      // Find the last added service (assuming highest ID is last, or just last in list)
      const lastService = services.length > 0 ? services[services.length - 1] : null
      
      setCurrentService({ 
        ...DEFAULT_SERVICE, 
        service_date: new Date().toISOString().split('T')[0], // Always default to today for new
        // Pre-fill representatives from the last service if available
        representative_cto: lastService?.representative_cto || '',
        representative_security: lastService?.representative_security || '',
        representative_infra: lastService?.representative_infra || '',
        representative_risk: lastService?.representative_risk || '',
        representative_other: lastService?.representative_other || ''
      })
    }
    setShowModal(true)
  }

  const getBadgeColor = (level?: string) => {
    switch(level) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Minimal': return 'success';
      default: return 'secondary';
    }
  }

  const currentScore = (
    (currentService.q_failure || 0) +
    (currentService.q_data_leakage || 0) +
    (currentService.q_legal || 0) +
    (currentService.q_vendor || 0) +
    (currentService.q_disconnection || 0)
  )

  let currentLevel = 'Minimal'
  if (currentScore >= 70) currentLevel = 'High'
  else if (currentScore >= 50) currentLevel = 'Medium'

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Cloud Governance Committee</h1>
      
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-50">
          <Form.Control
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button variant="primary" onClick={() => openModal()}>Add New Service</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Provider</th>
            <th>Reps (CTO/Sec)</th>
            <th>Risk Score</th>
            <th>Impact Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.service_date}</td>
              <td>{s.name}</td>
              <td>{s.provider}</td>
              <td>{s.representative_cto} / {s.representative_security}</td>
              <td>{s.total_score}</td>
              <td><Badge bg={getBadgeColor(s.impact_level)}>{s.impact_level}</Badge></td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openModal(s)}>Edit</Button>
                <Button variant="outline-danger" size="sm" onClick={() => s.id && handleDelete(s.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentService.id ? 'Edit Service' : 'Add New Service'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control 
                    type="date"
                    value={currentService.service_date}
                    onChange={(e) => setCurrentService({...currentService, service_date: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formServiceName">
                  <Form.Label>Service Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentService.name} 
                    onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formProvider">
                  <Form.Label>Provider</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="e.g. AWS, Azure"
                    value={currentService.provider} 
                    onChange={(e) => setCurrentService({...currentService, provider: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Service Description</Form.Label>
              <Form.Control 
                as="textarea" rows={2}
                value={currentService.description} 
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formProviderDescription">
              <Form.Label>Provider Description</Form.Label>
              <Form.Control 
                as="textarea" rows={2}
                value={currentService.provider_description} 
                onChange={(e) => setCurrentService({...currentService, provider_description: e.target.value})}
              />
            </Form.Group>

            <hr />
            <h5>Representatives</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="repCTO">
                  <Form.Label>CTO Representative</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentService.representative_cto} 
                    onChange={(e) => setCurrentService({...currentService, representative_cto: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="repSec">
                  <Form.Label>Security Representative</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentService.representative_security} 
                    onChange={(e) => setCurrentService({...currentService, representative_security: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="repInfra">
                  <Form.Label>Infrastructure Representative</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentService.representative_infra} 
                    onChange={(e) => setCurrentService({...currentService, representative_infra: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="repRisk">
                  <Form.Label>Risk Mgmt Representative</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentService.representative_risk} 
                    onChange={(e) => setCurrentService({...currentService, representative_risk: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="repOther">
              <Form.Label>Other Representatives</Form.Label>
              <Form.Control 
                type="text" 
                value={currentService.representative_other} 
                onChange={(e) => setCurrentService({...currentService, representative_other: e.target.value})}
              />
            </Form.Group>

            <hr />
            <h5>Risk Assessment</h5>
            <div className="d-flex justify-content-between align-items-center mb-3">
               <strong>Total Score: {currentScore} / 100</strong>
               <Badge bg={getBadgeColor(currentLevel)} className="fs-6">{currentLevel} Impact</Badge>
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formQ1">
                  <Form.Label>1. Impact of Failure (0-30)</Form.Label>
                  <Form.Control 
                    type="number" min="0" max="30"
                    value={currentService.q_failure} 
                    onChange={(e) => setCurrentService({...currentService, q_failure: Math.min(30, Math.max(0, parseInt(e.target.value) || 0))})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formQ2">
                  <Form.Label>2. Impact of Data Leakage (0-30)</Form.Label>
                  <Form.Control 
                    type="number" min="0" max="30"
                    value={currentService.q_data_leakage} 
                    onChange={(e) => setCurrentService({...currentService, q_data_leakage: Math.min(30, Math.max(0, parseInt(e.target.value) || 0))})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formQ3">
                  <Form.Label>3. Legal/Reg (0-15)</Form.Label>
                  <Form.Control 
                    type="number" min="0" max="15"
                    value={currentService.q_legal} 
                    onChange={(e) => setCurrentService({...currentService, q_legal: Math.min(15, Math.max(0, parseInt(e.target.value) || 0))})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formQ4">
                  <Form.Label>4. Vendor Lock-in (0-15)</Form.Label>
                  <Form.Control 
                    type="number" min="0" max="15"
                    value={currentService.q_vendor} 
                    onChange={(e) => setCurrentService({...currentService, q_vendor: Math.min(15, Math.max(0, parseInt(e.target.value) || 0))})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formQ5">
                  <Form.Label>5. Disconnection (0-10)</Form.Label>
                  <Form.Control 
                    type="number" min="0" max="10"
                    value={currentService.q_disconnection} 
                    onChange={(e) => setCurrentService({...currentService, q_disconnection: Math.min(10, Math.max(0, parseInt(e.target.value) || 0))})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <Form.Group className="mb-3" controlId="formCommitteeNotes">
              <Form.Label>Committee Notes</Form.Label>
              <Form.Control 
                as="textarea" rows={4}
                value={currentService.committee_notes} 
                onChange={(e) => setCurrentService({...currentService, committee_notes: e.target.value})}
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default App