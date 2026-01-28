from typing import Optional
from sqlmodel import Field, SQLModel

class CloudServiceBase(SQLModel):
    # Basic Info
    system_name: Optional[str] = Field(default=None)  # שם מערכת / פרויקט
    organization: Optional[str] = Field(default=None)  # אירגון
    committee_date: Optional[str] = Field(default=None)  # מועד הועדה
    requesting_unit: Optional[str] = Field(default=None)  # חטיבה דורשת
    requesting_product_manager: Optional[str] = Field(default=None)  # מנהל מוצר דורש
    applicant: Optional[str] = Field(default=None)  # מגיש הבקשה
    cmdb_id: Optional[int] = Field(default=None)  # מספר קטלוגי ב-CMDB
    subsidiaries: Optional[str] = Field(default=None)  # חברות בנות
    solution_description: Optional[str] = Field(default=None)  # תיאור הפתרון
    
    # Scoring & Status
    total_score: Optional[int] = Field(default=0)  # ציון כולל
    approval_path: Optional[str] = Field(default=None)  # מסלול אישורים נדרש
    status: Optional[str] = Field(default=None)  # סטטוס
    committee_summary: Optional[str] = Field(default=None)  # סיכום ועדה
    committee_notes: Optional[str] = Field(default=None)  # הערות ועדה
    approver: Optional[str] = Field(default=None)  # גורם מאשר
    approval_date: Optional[str] = Field(default=None)  # תאריך אישור

    # Risk Questions & Explanations
    explanation_data_leakage: Optional[str] = Field(default=None)  # הסבר - השפעת דליפת מידע
    score_data_leakage: Optional[int] = Field(default=0)  # ציון - השפעת דליפת מידע (עד 30)
    
    explanation_provider_fit: Optional[str] = Field(default=None)  # הסבר - התאמת ספק שירותי הענן
    score_provider_fit: Optional[int] = Field(default=0)  # ציון - התאמת ספק שירותי הענן (עד 15)
    
    explanation_service_failure: Optional[str] = Field(default=None)  # הסבר - כשל בשירות ענן
    score_service_failure: Optional[int] = Field(default=0)  # ציון - כשל בשירות ענן (עד 30)
    
    explanation_compliance: Optional[str] = Field(default=None)  # הסבר - עמידה בדין ורגולציה
    score_compliance: Optional[int] = Field(default=0)  # ציון - עמידה בדין ורגולציה (עד 15)
    
    explanation_exit_strategy: Optional[str] = Field(default=None)  # הסבר - היכולת לצמצם את השירות
    score_exit_strategy: Optional[int] = Field(default=0)  # ציון - היכולת לצמצם את השירות (עד 10)

    # Additional Approvals
    vp_technologies: Optional[str] = Field(default=None)  # סמנכ"ל טכנולוגיות
    vp_business_division: Optional[str] = Field(default=None)  # סמנכ"ל חטיבה עסקית
    vp_approval_date: Optional[str] = Field(default=None)  # תאריך אישור סמנכ"לים
    management_approval: Optional[str] = Field(default=None)  # אישור הנהלה
    management_approval_date: Optional[str] = Field(default=None)  # תאריך אישור הנהלה
    board_approval: Optional[str] = Field(default=None)  # אישור דירקטוריון
    board_approval_date: Optional[str] = Field(default=None)  # תאריך אישור דירקטוריון

    # Branches / Departments
    branch_cto: Optional[str] = Field(default=None)  # ענף CTO
    branch_infrastructure: Optional[str] = Field(default=None)  # ענף תשתית
    dept_infosec: Optional[str] = Field(default=None)  # אגף אבטחת מידע
    tech_risk_management: Optional[str] = Field(default=None)  # ניהול סיכונים טכנולוגיים
    additional_factors: Optional[str] = Field(default=None)  # נוספים
    other_factors: Optional[str] = Field(default=None)  # גורמים נוספים

    # Provider Details
    provider_description: Optional[str] = Field(default=None)  # תיאור של ספק פתרון מחשוב הענן המוצע
    is_significant_outsourcing: Optional[str] = Field(default=None)  # האם הספק מסווג כספק מיקור חוץ מהותי
    is_significant_cyber: Optional[str] = Field(default=None)  # האם הספק מסווג כספק סייבר מהותי
    is_bia_relevant: Optional[str] = Field(default=None)  # האם רלוונטי לתהליכי המשכיות עסקית/BIA

class CloudService(CloudServiceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class CloudServiceCreate(CloudServiceBase):
    id: Optional[int] = None

class CloudServiceRead(CloudServiceBase):
    id: int

class CloudServiceUpdate(SQLModel):
    system_name: Optional[str] = None
    organization: Optional[str] = None
    committee_date: Optional[str] = None
    requesting_unit: Optional[str] = None
    requesting_product_manager: Optional[str] = None
    applicant: Optional[str] = None
    cmdb_id: Optional[int] = None
    subsidiaries: Optional[str] = None
    solution_description: Optional[str] = None
    total_score: Optional[int] = None
    approval_path: Optional[str] = None
    status: Optional[str] = None
    committee_summary: Optional[str] = None
    committee_notes: Optional[str] = None
    approver: Optional[str] = None
    approval_date: Optional[str] = None
    explanation_data_leakage: Optional[str] = None
    score_data_leakage: Optional[int] = None
    explanation_provider_fit: Optional[str] = None
    score_provider_fit: Optional[int] = None
    explanation_service_failure: Optional[str] = None
    score_service_failure: Optional[int] = None
    explanation_compliance: Optional[str] = None
    score_compliance: Optional[int] = None
    explanation_exit_strategy: Optional[str] = None
    score_exit_strategy: Optional[int] = None
    vp_technologies: Optional[str] = None
    vp_business_division: Optional[str] = None
    vp_approval_date: Optional[str] = None
    management_approval: Optional[str] = None
    management_approval_date: Optional[str] = None
    board_approval: Optional[str] = None
    board_approval_date: Optional[str] = None
    branch_cto: Optional[str] = None
    branch_infrastructure: Optional[str] = None
    dept_infosec: Optional[str] = None
    tech_risk_management: Optional[str] = None
    additional_factors: Optional[str] = None
    other_factors: Optional[str] = None
    provider_description: Optional[str] = None
    is_significant_outsourcing: Optional[str] = None
    is_significant_cyber: Optional[str] = None
    is_bia_relevant: Optional[str] = None
