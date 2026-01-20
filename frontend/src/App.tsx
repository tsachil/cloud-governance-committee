import { useState, useEffect } from 'react'
import { Container, Table, Button, Form, Modal, InputGroup } from 'react-bootstrap'
import axios from 'axios'

const API_URL = 'http://localhost:8000/services/'

interface CloudService {
  id?: number
  name: string
  provider: string
  category: string
  cost: number
  owner: string
  status: string
}

const PROVIDERS = ['AWS', 'Azure', 'GCP', 'DigitalOcean', 'Cloudflare', 'Heroku', 'Other']
const CATEGORIES = ['Compute', 'Storage', 'Database', 'Networking', 'Security', 'Analytics', 'Other']

function App() {
  const [services, setServices] = useState<CloudService[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentService, setCurrentService] = useState<CloudService>({
    name: '', provider: 'AWS', category: 'Compute', cost: 0, owner: '', status: 'Active'
  })
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
      setCurrentService({ name: '', provider: 'AWS', category: 'Compute', cost: 0, owner: '', status: 'Active' })
    }
    setShowModal(true)
  }

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
            <th>Category</th>
            <th>Monthly Cost ($)</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.provider}</td>
              <td>{s.category}</td>
              <td>{s.cost.toFixed(2)}</td>
              <td>{s.owner}</td>
              <td>{s.status}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => openModal(s)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => s.id && handleDelete(s.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentService.id ? 'Edit Service' : 'Add New Service'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formServiceName">
              <Form.Label>Service Name</Form.Label>
              <Form.Control 
                type="text" 
                value={currentService.name} 
                onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProvider">
              <Form.Label>Provider</Form.Label>
              <Form.Select 
                value={currentService.provider} 
                onChange={(e) => setCurrentService({...currentService, provider: e.target.value})}
              >
                {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select 
                value={currentService.category} 
                onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCost">
              <Form.Label>Monthly Cost ($)</Form.Label>
              <Form.Control 
                type="number" 
                value={currentService.cost} 
                onChange={(e) => setCurrentService({...currentService, cost: parseFloat(e.target.value) || 0})}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formOwner">
              <Form.Label>Owner</Form.Label>
              <Form.Control 
                type="text" 
                value={currentService.owner} 
                onChange={(e) => setCurrentService({...currentService, owner: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select 
                value={currentService.status} 
                onChange={(e) => setCurrentService({...currentService, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Deprecated">Deprecated</option>
                <option value="Planned">Planned</option>
              </Form.Select>
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