import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@mui/material';

interface ComplianceChecklistProps {
  items?: Array<{
    id: string;
    text: string;
    checked: boolean;
  }>;
  onItemChange?: (id: string, checked: boolean) => void;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ 
  items = [], 
  onItemChange 
}) => {
  const defaultItems = [
    { id: '1', text: 'Transfer pricing documentation prepared', checked: false },
    { id: '2', text: 'Economic analysis completed', checked: false },
    { id: '3', text: 'Benchmarking study conducted', checked: false },
    { id: '4', text: 'Local file prepared', checked: false },
    { id: '5', text: 'Master file prepared', checked: false }
  ];

  const checklistItems = items.length > 0 ? items : defaultItems;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Compliance Checklist
      </Typography>
      <List>
        {checklistItems.map((item) => (
          <ListItem key={item.id} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.checked}
                onChange={(e) => onItemChange?.(item.id, e.target.checked)}
              />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export { ComplianceChecklist };
export default ComplianceChecklist;