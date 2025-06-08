import React from 'react';
import { Box, Typography, Paper, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Users as UsersIcon,
  Settings as SettingsIcon,
  BarChart3 as AnalyticsIcon,
  Shield as SecurityIcon,
  Database as BackupIcon,
  AlertTriangle as AlertIcon,
  CheckCircle as CheckIcon,
  Clock as ClockIcon
} from 'lucide-react';
import { Assignment as AssignmentIcon } from '@mui/icons-material';

const Admin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administration
      </Typography>
      <Paper sx={{ p: 3 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* QA Checklist Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/qa-checklist')}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <AssignmentIcon className="text-green-600 mr-3" sx={{ fontSize: 32 }} />
                    <Typography variant="h6" className="font-semibold">
                      QA Launch Checklist
                    </Typography>
                  </div>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                    Pre-launch validation checklist for all system components
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    Open Checklist
                  </Button>
                </CardContent>
              </Card>

          <Typography variant="body1">
            System administration and user management features will be implemented here.
          </Typography>
        </div>
      </Paper>
    </Box>
  );
};

export default Admin;