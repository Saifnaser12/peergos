export type AuditAction =
  | 'VIEW_SETUP'
  | 'VIEW_FILING'
  | 'VIEW_DASHBOARD'
  | 'VIEW_ASSISTANT'
  | 'SUBMIT_FILING'
  | 'SWITCH_ROLE'
  | 'EXPORT_REPORT'
  | 'TRN_SEARCH'
  | 'UPDATE_PROFILE'
  | 'ASSISTANT_QUERY'
  | 'DOWNLOAD_CHART';

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  role: string;
  details?: Record<string, any>;
}

export interface AuditLog {
  entries: AuditEntry[];
} 
export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  role: string;
  details?: Record<string, any>;
}

export interface AuditLog {
  entries: AuditEntry[];
}

export type AuditAction = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE_FILING'
  | 'SUBMIT_FILING'
  | 'EDIT_FILING'
  | 'DELETE_FILING'
  | 'SWITCH_ROLE'
  | 'VIEW_REPORT'
  | 'EXPORT_DATA'
  | 'UPLOAD_DOCUMENT';
