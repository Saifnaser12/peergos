
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  alpha,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { RelatedParty, RelationshipType } from '../../types/transferPricing';
import { v4 as uuidv4 } from 'uuid';

interface RelatedPartyFormProps {
  relatedParties: RelatedParty[];
  onUpdate: (relatedParties: RelatedParty[]) => void;
}

const initialRelatedParty: Omit<RelatedParty, 'id'> = {
  name: '',
  country: '',
  relationshipType: RelationshipType.SUBSIDIARY,
  ownershipPercentage: undefined,
  taxIdentificationNumber: '',
  isActive: true,
  description: ''
};

export const RelatedPartyForm: React.FC<RelatedPartyFormProps> = ({ relatedParties, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<RelatedParty | null>(null);
  const [formData, setFormData] = useState<Omit<RelatedParty, 'id'>>(initialRelatedParty);

  const handleOpen = (party?: RelatedParty) => {
    if (party) {
      setEditingParty(party);
      setFormData(party);
    } else {
      setEditingParty(null);
      setFormData(initialRelatedParty);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingParty(null);
    setFormData(initialRelatedParty);
  };

  const handleSave = () => {
    if (editingParty) {
      // Update existing party
      const updatedParties = relatedParties.map(party =>
        party.id === editingParty.id ? { ...formData, id: editingParty.id } : party
      );
      onUpdate(updatedParties);
    } else {
      // Add new party
      const newParty: RelatedParty = {
        ...formData,
        id: uuidv4()
      };
      onUpdate([...relatedParties, newParty]);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    const updatedParties = relatedParties.filter(party => party.id !== id);
    onUpdate(updatedParties);
  };

  const handleInputChange = (field: keyof Omit<RelatedParty, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'number' 
      ? (event.target.value ? parseFloat(event.target.value) : undefined)
      : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRelationshipTypeColor = (type: RelationshipType) => {
    switch (type) {
      case RelationshipType.PARENT_COMPANY:
        return 'primary';
      case RelationshipType.SUBSIDIARY:
        return 'secondary';
      case RelationshipType.SISTER_COMPANY:
        return 'info';
      case RelationshipType.ASSOCIATED_ENTERPRISE:
        return 'warning';
      case RelationshipType.BRANCH:
        return 'success';
      default:
        return 'default';
    }
  };

  const countries = [
    'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
    'United States', 'United Kingdom', 'Germany', 'France', 'Singapore', 'Hong Kong',
    'India', 'China', 'Japan', 'Australia', 'Canada', 'Switzerland', 'Netherlands',
    'Luxembourg', 'Ireland', 'Cayman Islands', 'British Virgin Islands'
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('transferPricing.relatedParties')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2 }}
        >
          {t('transferPricing.addRelatedParty')}
        </Button>
      </Box>

      {relatedParties.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('transferPricing.noRelatedParties')}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2 }}
          >
            {t('transferPricing.addFirstRelatedParty')}
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>{t('transferPricing.partyName')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('transferPricing.country')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('transferPricing.relationshipType')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('transferPricing.ownership')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('transferPricing.status')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relatedParties.map((party) => (
                <TableRow key={party.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {party.name}
                    </Typography>
                    {party.taxIdentificationNumber && (
                      <Typography variant="caption" color="text.secondary">
                        TIN: {party.taxIdentificationNumber}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{party.country}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`transferPricing.relationshipTypes.${party.relationshipType}`)}
                      color={getRelationshipTypeColor(party.relationshipType) as any}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {party.ownershipPercentage ? `${party.ownershipPercentage}%` : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={party.isActive ? t('common.active') : t('common.inactive')}
                      color={party.isActive ? 'success' : 'default'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(party)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(party.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {editingParty ? t('transferPricing.editRelatedParty') : t('transferPricing.addRelatedParty')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={t('transferPricing.partyName')}
                value={formData.name}
                onChange={handleInputChange('name')}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                label={t('transferPricing.country')}
                value={formData.country}
                onChange={handleInputChange('country')}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                label={t('transferPricing.relationshipType')}
                value={formData.relationshipType}
                onChange={handleInputChange('relationshipType')}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {Object.values(RelationshipType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`transferPricing.relationshipTypes.${type}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('transferPricing.ownershipPercentage')}
                value={formData.ownershipPercentage || ''}
                onChange={handleInputChange('ownershipPercentage')}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: '%'
                }}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('transferPricing.taxIdentificationNumber')}
                value={formData.taxIdentificationNumber}
                onChange={handleInputChange('taxIdentificationNumber')}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('transferPricing.description')}
                value={formData.description}
                onChange={handleInputChange('description')}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                placeholder={t('transferPricing.descriptionPlaceholder')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} sx={{ borderRadius: 2 }}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name || !formData.country}
            sx={{ borderRadius: 2 }}
          >
            {editingParty ? t('common.update') : t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
