import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
const ComplianceChecklist = ({ items = [], onItemChange }) => {
    const defaultItems = [
        { id: '1', text: 'Transfer pricing documentation prepared', checked: false },
        { id: '2', text: 'Economic analysis completed', checked: false },
        { id: '3', text: 'Benchmarking study conducted', checked: false },
        { id: '4', text: 'Local file prepared', checked: false },
        { id: '5', text: 'Master file prepared', checked: false }
    ];
    const checklistItems = items.length > 0 ? items : defaultItems;
    return (_jsxs(Paper, { sx: { p: 3, borderRadius: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Compliance Checklist" }), _jsx(List, { children: checklistItems.map((item) => (_jsxs(ListItem, { dense: true, children: [_jsx(ListItemIcon, { children: _jsx(Checkbox, { edge: "start", checked: item.checked, onChange: (e) => onItemChange?.(item.id, e.target.checked) }) }), _jsx(ListItemText, { primary: item.text })] }, item.id))) })] }));
};
export { ComplianceChecklist };
export default ComplianceChecklist;
