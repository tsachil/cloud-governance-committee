import pandas as pd
import requests
import os
import datetime

def import_data():
    file_path = "Easy_report-27.01.2026-1311169718.xlsx"
    api_url = "http://localhost:8000/services/"
    
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    print(f"Reading file: {file_path}")
    
    try:
        # Read Excel file
        df = pd.read_excel(file_path)
    except Exception as e:
        print(f"Failed to read excel: {e}")
        return

    print(f"Found {len(df)} rows.")
    
    success = 0
    failed = 0
    
    for index, row in df.iterrows():
        try:
            # Helper to safely get value
            def get_val(col_name):
                val = row.get(col_name)
                if pd.isna(val):
                    return None
                return val

            # Date Parsing Helper
            def parse_date(date_val):
                if not date_val:
                    return None
                if isinstance(date_val, datetime.datetime):
                    return date_val.date().isoformat()
                try:
                    # Try parsing DD/MM/YYYY
                    return pd.to_datetime(date_val, dayfirst=True).date().isoformat()
                except:
                    return str(date_val)

            # Map Excel columns to Database fields
            payload = {
                "id": int(get_val('#')) if get_val('#') is not None else None,
                "system_name": str(get_val('שם מערכת / פרויקט')).strip() if get_val('שם מערכת / פרויקט') else None,
                "organization": str(get_val('אירגון')).strip() if get_val('אירגון') else None,
                "committee_date": parse_date(get_val('מועד הועדה')),
                "requesting_unit": str(get_val('חטיבה דורשת')).strip() if get_val('חטיבה דורשת') else None,
                "requesting_product_manager": str(get_val('מנהל מוצר דורש')).strip() if get_val('מנהל מוצר דורש') else None,
                "applicant": str(get_val('מגיש הבקשה')).strip() if get_val('מגיש הבקשה') else None,
                "cmdb_id": int(get_val('מספר קטלוגי ב-CMDB')) if get_val('מספר קטלוגי ב-CMDB') is not None else None,
                "subsidiaries": str(get_val('חברות בנות')).strip() if get_val('חברות בנות') else None,
                "solution_description": str(get_val('תיאור הפתרון')).strip() if get_val('תיאור הפתרון') else None,
                
                "total_score": int(get_val('ציון כולל')) if get_val('ציון כולל') is not None else 0,
                "approval_path": str(get_val('מסלול אישורים נדרש')).strip() if get_val('מסלול אישורים נדרש') else None,
                "status": str(get_val('סטטוס')).strip() if get_val('סטטוס') else None,
                "committee_summary": str(get_val('סיכום ועדה')).strip() if get_val('סיכום ועדה') else None,
                "committee_notes": str(get_val('הערות ועדה')).strip() if get_val('הערות ועדה') else None,
                "approver": str(get_val('גורם מאשר')).strip() if get_val('גורם מאשר') else None,
                "approval_date": parse_date(get_val('תאריך אישור')),

                "explanation_data_leakage": str(get_val('הסבר - השפעת דליפת מידע')).strip() if get_val('הסבר - השפעת דליפת מידע') else None,
                "score_data_leakage": int(get_val('ציון - השפעת דליפת מידע (עד 30)')) if get_val('ציון - השפעת דליפת מידע (עד 30)') is not None else 0,
                
                "explanation_provider_fit": str(get_val('הסבר - התאמת ספק שירותי הענן')).strip() if get_val('הסבר - התאמת ספק שירותי הענן') else None,
                "score_provider_fit": int(get_val('ציון - התאמת ספק שירותי הענן (עד 15)')) if get_val('ציון - התאמת ספק שירותי הענן (עד 15)') is not None else 0,
                
                "explanation_service_failure": str(get_val('הסבר - כשל בשירות ענן')).strip() if get_val('הסבר - כשל בשירות ענן') else None,
                "score_service_failure": int(get_val('ציון - כשל בשירות ענן (עד 30)')) if get_val('ציון - כשל בשירות ענן (עד 30)') is not None else 0,
                
                "explanation_compliance": str(get_val('הסבר - עמידה בדין ורגולציה')).strip() if get_val('הסבר - עמידה בדין ורגולציה') else None,
                "score_compliance": int(get_val('ציון - עמידה בדין ורגולציה (עד 15)')) if get_val('ציון - עמידה בדין ורגולציה (עד 15)') is not None else 0,
                
                "explanation_exit_strategy": str(get_val('הסבר - היכולת לצמצם את השירות')).strip() if get_val('הסבר - היכולת לצמצם את השירות') else None,
                "score_exit_strategy": int(get_val('ציון - היכולת לצמצם את השירות (עד 10)')) if get_val('ציון - היכולת לצמצם את השירות (עד 10)') is not None else 0,

                "vp_technologies": str(get_val('סמנכ"ל טכנולוגיות')).strip() if get_val('סמנכ"ל טכנולוגיות') else None,
                "vp_business_division": str(get_val('סמנכ"ל חטיבה עסקית')).strip() if get_val('סמנכ"ל חטיבה עסקית') else None,
                "vp_approval_date": parse_date(get_val('תאריך אישור סמנכ"לים')),
                "management_approval": str(get_val('אישור הנהלה')).strip() if get_val('אישור הנהלה') else None,
                "management_approval_date": parse_date(get_val('תאריך אישור הנהלה')),
                "board_approval": str(get_val('אישור דירקטוריון')).strip() if get_val('אישור דירקטוריון') else None,
                "board_approval_date": parse_date(get_val('תאריך אישור דירקטוריון')),

                "branch_cto": str(get_val('ענף CTO')).strip() if get_val('ענף CTO') else None,
                "branch_infrastructure": str(get_val('ענף תשתית')).strip() if get_val('ענף תשתית') else None,
                "dept_infosec": str(get_val('אגף אבטחת מידע')).strip() if get_val('אגף אבטחת מידע') else None,
                "tech_risk_management": str(get_val('ניהול סיכונים טכנולוגיים')).strip() if get_val('ניהול סיכונים טכנולוגיים') else None,
                "additional_factors": str(get_val('נוספים')).strip() if get_val('נוספים') else None,
                "other_factors": str(get_val('גורמים נוספים')).strip() if get_val('גורמים נוספים') else None,

                "provider_description": str(get_val('תיאור של ספק פתרון מחשוב הענן המוצע')).strip() if get_val('תיאור של ספק פתרון מחשוב הענן המוצע') else None,
                "is_significant_outsourcing": str(get_val('האם הספק מסווג כספק מיקור חוץ מהותי ')).strip() if get_val('האם הספק מסווג כספק מיקור חוץ מהותי ') else None,
                "is_significant_cyber": str(get_val('האם הספק מסווג כספק סייבר מהותי ')).strip() if get_val('האם הספק מסווג כספק סייבר מהותי ') else None,
                "is_bia_relevant": str(get_val('האם רלוונטי לתהליכי המשכיות עסקית/BIA')).strip() if get_val('האם רלוונטי לתהליכי המשכיות עסקית/BIA') else None,
            }

            if not payload["system_name"]:
                 print(f"Skipping row {index}: Missing system name")
                 continue

            print(f"Posting: {payload['system_name']} (ID: {payload['id']})")
            response = requests.post(api_url, json=payload)
            
            if response.status_code in [200, 201]:
                success += 1
            else:
                print(f"Failed to post {payload['system_name']}: {response.status_code} - {response.text}")
                failed += 1
                
        except Exception as e:
            print(f"Error processing row {index}: {e}")
            failed += 1
            
    print(f"Import complete. Success: {success}, Failed: {failed}")

if __name__ == "__main__":
    import_data()