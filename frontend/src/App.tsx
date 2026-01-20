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
  participants: string
  q_failure: number
  q_data_leakage: number
  q_legal: number
  q_vendor: number
  q_disconnection: number
  total_score?: number
  impact_level?: string
}

const PROVIDERS = ['AWS', 'Azure', 'GCP', 'DigitalOcean', 'Cloudflare', 'Heroku', 'Other']

const DEFAULT_SERVICE: CloudService = {
  name: '', description: '', provider: 'AWS', provider_description: '', participants: '',
  q_failure: 0, q_data_leakage: 0, q_legal: 0, q_vendor: 0, q_disconnection: 0
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
      setCurrentService({ ...DEFAULT_SERVICE })
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
            <th>Name</th>
            <th>Provider</th>
            <th>Participants</th>
            <th>Risk Score</th>
            <th>Impact Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.provider}</td>
              <td>{s.participants}</td>
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
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formServiceName">
                  <Form.Label>Service Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentService.name} 
                    onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProvider">
                  <Form.Label>Provider</Form.Label>
                  <Form.Select 
                    value={currentService.provider} 
                    onChange={(e) => setCurrentService({...currentService, provider: e.target.value})}
                  >
                    {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </Form.Select>
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

            <Form.Group className="mb-3" controlId="formParticipants">
              <Form.Label>Participants</Form.Label>
              <Form.Control 
                type="text" 
                value={currentService.participants} 
                onChange={(e) => setCurrentService({...currentService, participants: e.target.value})}
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
