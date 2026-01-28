import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Button, Modal, Form, Badge, InputGroup, Tab, Tabs } from 'react-bootstrap'
import axios from 'axios'
import './App.css'

interface CloudService {
  id?: number
  system_name: string
  organization: string
  committee_date: string
  requesting_unit: string
  requesting_product_manager: string
  applicant: string
  cmdb_id: number
  subsidiaries: string
  solution_description: string
  total_score: number
  approval_path: string
  status: string
  committee_summary: string
  committee_notes: string
  approver: string
  approval_date: string
  explanation_data_leakage: string
  score_data_leakage: number
  explanation_provider_fit: string
  score_provider_fit: number
  explanation_service_failure: string
  score_service_failure: number
  explanation_compliance: string
  score_compliance: number
  explanation_exit_strategy: string
  score_exit_strategy: number
  vp_technologies: string
  vp_business_division: string
  vp_approval_date: string
  management_approval: string
  management_approval_date: string
  board_approval: string
  board_approval_date: string
  branch_cto: string
  branch_infrastructure: string
  dept_infosec: string
  tech_risk_management: string
  additional_factors: string
  other_factors: string
  provider_description: string
  is_significant_outsourcing: string
  is_significant_cyber: string
  is_bia_relevant: string
}

const DEFAULT_SERVICE: CloudService = {
  system_name: '',
  organization: '',
  committee_date: '',
  requesting_unit: '',
  requesting_product_manager: '',
  applicant: '',
  cmdb_id: '',
  subsidiaries: '',
  solution_description: '',
  total_score: 0,
  approval_path: '',
  status: '',
  committee_summary: '',
  committee_notes: '',
  approver: '',
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
}

function App() {
  const [services, setServices] = useState<CloudService[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentService, setCurrentService] = useState<CloudService>(DEFAULT_SERVICE)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof CloudService; direction: 'asc' | 'desc' } | null>(null)

  const fetchServices = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/services/?search=${searchTerm}`)
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [searchTerm])

  const handleSort = (key: keyof CloudService) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const parts = dateString.split('-')
    if (parts.length !== 3) return dateString
    const [year, month, day] = parts
    return `${day}-${month}-${year}`
  }

  const sortedServices = [...services].sort((a, b) => {
    if (!sortConfig) return 0
    
    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    // Handle null/undefined
    if (aValue === undefined || aValue === null) aValue = ''
    if (bValue === undefined || bValue === null) bValue = ''

    if (sortConfig.key === 'committee_date' || sortConfig.key === 'approval_date') {
      const dateA = new Date(aValue as string).getTime()
      const dateB = new Date(bValue as string).getTime()
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const getSortIndicator = (key: keyof CloudService) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
    }
    return ''
  }

  const handleSave = async () => {
    if (!currentService.system_name.trim()) {
      alert('נא להזין שם מערכת / פרוייקט')
      return
    }

    // Risk Score Validation
    if ((currentService.score_service_failure || 0) < 0 || (currentService.score_service_failure || 0) > 30) {
        alert('ציון כשל בשירות חייב להיות בין 0 ל-30')
        return
    }
    if ((currentService.score_data_leakage || 0) < 0 || (currentService.score_data_leakage || 0) > 30) {
        alert('ציון דליפת מידע חייב להיות בין 0 ל-30')
        return
    }
    if ((currentService.score_compliance || 0) < 0 || (currentService.score_compliance || 0) > 15) {
        alert('ציון עמידה בדין חייב להיות בין 0 ל-15')
        return
    }
    if ((currentService.score_provider_fit || 0) < 0 || (currentService.score_provider_fit || 0) > 15) {
        alert('ציון התאמת ספק חייב להיות בין 0 ל-15')
        return
    }
    if ((currentService.score_exit_strategy || 0) < 0 || (currentService.score_exit_strategy || 0) > 10) {
        alert('ציון יכולת צמצום חייב להיות בין 0 ל-10')
        return
    }

    try {
      if (currentService.id) {
        await axios.patch(`http://localhost:8000/services/${currentService.id}`, currentService)
      } else {
        await axios.post('http://localhost:8000/services/', currentService)
      }
      setShowModal(false)
      fetchServices()
    } catch (error) {
      console.error('Error saving service:', error)
      alert('שגיאה בשמירת הנתונים')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק שירות זה?')) {
      try {
        await axios.delete(`http://localhost:8000/services/${id}`)
        fetchServices()
      } catch (error) {
        console.error('Error deleting service:', error)
      }
    }
  }

  const openModal = (service?: CloudService) => {
    if (service) {
      setCurrentService({ ...service })
    } else {
      setCurrentService({ ...DEFAULT_SERVICE })
    }
    setShowModal(true)
  }

  const getBadgeColor = (score: number) => {
    if (score >= 70) return 'danger'
    if (score >= 50) return 'warning'
    return 'success'
  }

  const calculateTotalScore = (service: CloudService) => {
    return (service.score_data_leakage || 0) +
           (service.score_provider_fit || 0) +
           (service.score_service_failure || 0) +
           (service.score_compliance || 0) +
           (service.score_exit_strategy || 0)
  }

  const handleScoreChange = (field: keyof CloudService, value: number) => {
    let max = 100;
    if (field === 'score_service_failure' || field === 'score_data_leakage') max = 30;
    else if (field === 'score_compliance' || field === 'score_provider_fit') max = 15;
    else if (field === 'score_exit_strategy') max = 10;

    if (value < 0) value = 0;
    if (value > max) {
        alert(`הערך המקסימלי עבור שדה זה הוא ${max}`);
        value = max;
    }

    const updatedService = { ...currentService, [field]: value }
    updatedService.total_score = calculateTotalScore(updatedService)
    setCurrentService(updatedService)
  }

  const renderInput = (label: string, field: keyof CloudService, type = 'text', as?: any, rows?: number, readOnly = false) => {
    let min = undefined;
    let max = undefined;
    
    if (field === 'score_service_failure' || field === 'score_data_leakage') {
        min = 0; max = 30;
    } else if (field === 'score_compliance' || field === 'score_provider_fit') {
        min = 0; max = 15;
    } else if (field === 'score_exit_strategy') {
        min = 0; max = 10;
    }

    return (
    <Form.Group className="mb-3" controlId={`form-${field}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control 
        type={type} 
        as={as}
        rows={rows}
        readOnly={readOnly}
        min={min}
        max={max}
        value={currentService[field] || ''} 
        onChange={(e) => {
            if (field.startsWith('score_')) {
                handleScoreChange(field, parseInt(e.target.value) || 0)
            } else {
                setCurrentService({...currentService, [field]: type === 'number' ? (parseInt(e.target.value) || 0) : e.target.value})
            }
        }}
      />
    </Form.Group>
  )}

  return (
    <Container fluid className="mt-4">
      <h1 className="mb-4">ועדת ממשל ענן - דוח מרוכז</h1>
      
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-50">
          <Form.Control 
            placeholder="חיפוש לפי שם מערכת או מגיש..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button onClick={() => openModal()}>הוסף שירות חדש</Button>
      </div>

      <div className="table-responsive">
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>#{getSortIndicator('id')}</th>
            <th onClick={() => handleSort('system_name')} style={{ cursor: 'pointer' }}>שם מערכת{getSortIndicator('system_name')}</th>
            <th onClick={() => handleSort('organization')} style={{ cursor: 'pointer' }}>ארגון{getSortIndicator('organization')}</th>
            <th onClick={() => handleSort('applicant')} style={{ cursor: 'pointer' }}>מגיש{getSortIndicator('applicant')}</th>
            <th onClick={() => handleSort('committee_date')} style={{ cursor: 'pointer' }}>מועד ועדה{getSortIndicator('committee_date')}</th>
            <th onClick={() => handleSort('total_score')} style={{ cursor: 'pointer' }}>ציון{getSortIndicator('total_score')}</th>
            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>סטטוס{getSortIndicator('status')}</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {sortedServices.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.system_name}</td>
              <td>{s.organization}</td>
              <td>{s.applicant}</td>
              <td>{formatDate(s.committee_date)}</td>
              <td>
                <Badge bg={getBadgeColor(s.total_score)}>
                  {s.total_score}
                </Badge>
              </td>
              <td>{s.status}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openModal(s)}>ערוך</Button>
                <Button variant="outline-danger" size="sm" onClick={() => s.id && handleDelete(s.id)}>מחק</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{currentService.id ? 'עריכת שירות' : 'הוספת שירות חדש'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="general" id="service-tabs" className="mb-3">
            <Tab eventKey="general" title="פרטים כלליים">
              <Row>
                <Col md={6}>{renderInput('שם מערכת / פרויקט', 'system_name')}</Col>
                <Col md={6}>{renderInput('ארגון', 'organization')}</Col>
              </Row>
              <Row>
                <Col md={4}>{renderInput('חטיבה דורשת', 'requesting_unit')}</Col>
                <Col md={4}>{renderInput('מנהל מוצר דורש', 'requesting_product_manager')}</Col>
                <Col md={4}>{renderInput('מגיש הבקשה', 'applicant')}</Col>
              </Row>
              <Row>
                <Col md={4}>{renderInput('מספר קטלוגי ב-CMDB', 'cmdb_id', 'number')}</Col>
                <Col md={4}>{renderInput('חברות בנות', 'subsidiaries')}</Col>
                <Col md={4}>{renderInput('מועד הועדה', 'committee_date', 'date')}</Col>
              </Row>
              {renderInput('תיאור הפתרון', 'solution_description', 'text', 'textarea', 3)}
              {renderInput('תיאור ספק הענן', 'provider_description', 'text', 'textarea', 3)}
            </Tab>

            <Tab eventKey="risk" title="סיכונים וציונים">
               <Row className="mb-3 align-items-center">
                 <Col md={2}><strong>ציון כולל:</strong></Col>
                 <Col md={2}>
                    <Form.Control 
                        type="number" 
                        value={currentService.total_score} 
                        readOnly 
                        className={`bg-${getBadgeColor(currentService.total_score)} text-white fw-bold text-center`}
                    />
                 </Col>
                 <Col md={8}>
                    <Badge bg={getBadgeColor(currentService.total_score)} className="fs-6">
                        {currentService.total_score >= 70 ? 'High' : currentService.total_score >= 50 ? 'Medium' : 'Minimal'} Impact
                    </Badge>
                 </Col>
               </Row>
               <hr/>
               <Row>
                 <Col md={9}>{renderInput('הסבר - כשל בשירות', 'explanation_service_failure', 'text', 'textarea', 2)}</Col>
                 <Col md={3}>{renderInput('ציון (עד 30)', 'score_service_failure', 'number')}</Col>
               </Row>
               <Row>
                 <Col md={9}>{renderInput('הסבר - השפעת דליפת מידע', 'explanation_data_leakage', 'text', 'textarea', 2)}</Col>
                 <Col md={3}>{renderInput('ציון (עד 30)', 'score_data_leakage', 'number')}</Col>
               </Row>
               <Row>
                 <Col md={9}>{renderInput('הסבר - עמידה בדין', 'explanation_compliance', 'text', 'textarea', 2)}</Col>
                 <Col md={3}>{renderInput('ציון (עד 15)', 'score_compliance', 'number')}</Col>
               </Row>
               <Row>
                 <Col md={9}>{renderInput('הסבר - התאמת ספק', 'explanation_provider_fit', 'text', 'textarea', 2)}</Col>
                 <Col md={3}>{renderInput('ציון (עד 15)', 'score_provider_fit', 'number')}</Col>
               </Row>
               <Row>
                 <Col md={9}>{renderInput('הסבר - יכולת צמצום', 'explanation_exit_strategy', 'text', 'textarea', 2)}</Col>
                 <Col md={3}>{renderInput('ציון (עד 10)', 'score_exit_strategy', 'number')}</Col>
               </Row>
            </Tab>

            <Tab eventKey="approval" title="אישורים וסטטוס">
              <Row>
                <Col md={6}>{renderInput('סטטוס', 'status')}</Col>
                <Col md={6}>{renderInput('מסלול אישורים נדרש', 'approval_path')}</Col>
              </Row>
              <Row>
                <Col md={6}>{renderInput('גורם מאשר', 'approver')}</Col>
                <Col md={6}>{renderInput('תאריך אישור', 'approval_date', 'date')}</Col>
              </Row>
              <hr />
              <Row>
                <Col md={4}>{renderInput('סמנכ"ל טכנולוגיות', 'vp_technologies')}</Col>
                <Col md={4}>{renderInput('סמנכ"ל חטיבה עסקית', 'vp_business_division')}</Col>
                <Col md={4}>{renderInput('תאריך אישור סמנכ"לים', 'vp_approval_date', 'date')}</Col>
              </Row>
              <Row>
                <Col md={6}>{renderInput('אישור הנהלה', 'management_approval')}</Col>
                <Col md={6}>{renderInput('תאריך אישור הנהלה', 'management_approval_date', 'date')}</Col>
              </Row>
              <Row>
                <Col md={6}>{renderInput('אישור דירקטוריון', 'board_approval')}</Col>
                <Col md={6}>{renderInput('תאריך אישור דירקטוריון', 'board_approval_date', 'date')}</Col>
              </Row>
            </Tab>

            <Tab eventKey="stakeholders" title="גורמים מעורבים">
               <Row>
                 <Col md={4}>{renderInput('ענף CTO', 'branch_cto')}</Col>
                 <Col md={4}>{renderInput('ענף תשתית', 'branch_infrastructure')}</Col>
                 <Col md={4}>{renderInput('אגף אבטחת מידע', 'dept_infosec')}</Col>
               </Row>
               <Row>
                 <Col md={4}>{renderInput('ניהול סיכונים', 'tech_risk_management')}</Col>
               </Row>
               {renderInput('נוספים', 'additional_factors', 'text', 'textarea', 2)}
               {renderInput('גורמים נוספים', 'other_factors', 'text', 'textarea', 2)}
            </Tab>

            <Tab eventKey="classification" title="סיווגים">
               <Row>
                 <Col md={4}>{renderInput('ספק מיקור חוץ מהותי?', 'is_significant_outsourcing')}</Col>
                 <Col md={4}>{renderInput('ספק סייבר מהותי?', 'is_significant_cyber')}</Col>
                 <Col md={4}>{renderInput('רלוונטי ל-BIA?', 'is_bia_relevant')}</Col>
               </Row>
               {renderInput('סיכום ועדה', 'committee_summary', 'text', 'textarea', 3)}
               {renderInput('הערות ועדה', 'committee_notes', 'text', 'textarea', 3)}
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>ביטול</Button>
          <Button variant="primary" onClick={handleSave}>שמור</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default App
