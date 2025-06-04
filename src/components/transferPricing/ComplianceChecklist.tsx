import React from 'react';
import { Box } from '@mui/material';

interface ComplianceChecklistProps {
  items: string[];
}

export const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({
  items,
}) => {
  return (
    <Box>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </Box>
  );
};

export default ComplianceChecklist;