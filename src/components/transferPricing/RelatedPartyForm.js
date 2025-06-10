import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Chip, alpha, useTheme } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { RelationshipType } from '../../types/transferPricing';
import { v4 as uuidv4 } from 'uuid';
const initialRelatedParty = {
    name: '',
    country: '',
    relationshipType: RelationshipType.SUBSIDIARY,
    ownershipPercentage: undefined,
    taxIdentificationNumber: '',
    isActive: true,
    description: ''
};
export const RelatedPartyForm = ({ relatedParties, onUpdate }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [editingParty, setEditingParty] = useState(null);
    const [formData, setFormData] = useState(initialRelatedParty);
    const handleOpen = (party) => {
        if (party) {
            setEditingParty(party);
            setFormData(party);
        }
        else {
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
            const updatedParties = relatedParties.map(party => party.id === editingParty.id ? { ...formData, id: editingParty.id } : party);
            onUpdate(updatedParties);
        }
        else {
            // Add new party
            const newParty = {
                ...formData,
                id: uuidv4()
            };
            onUpdate([...relatedParties, newParty]);
        }
        handleClose();
    };
    const handleDelete = (id) => {
        const updatedParties = relatedParties.filter(party => party.id !== id);
        onUpdate(updatedParties);
    };
    const handleInputChange = (field) => (event) => {
        const value = event.target.type === 'number'
            ? (event.target.value ? parseFloat(event.target.value) : undefined)
            : event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const getRelationshipTypeColor = (type) => {
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
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600 }, children: t('transferPricing.relatedParties') }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpen(), sx: { borderRadius: 2 }, children: t('transferPricing.addRelatedParty') })] }), relatedParties.length === 0 ? (_jsxs(Paper, { elevation: 0, sx: {
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
                }, children: [_jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 2 }, children: t('transferPricing.noRelatedParties') }), _jsx(Button, { variant: "outlined", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpen(), sx: { borderRadius: 2 }, children: t('transferPricing.addFirstRelatedParty') })] })) : (_jsx(TableContainer, { component: Paper, sx: { borderRadius: 2, overflow: 'hidden' }, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: alpha(theme.palette.primary.main, 0.05) }, children: [_jsx(TableCell, { sx: { fontWeight: 600 }, children: t('transferPricing.partyName') }), _jsx(TableCell, { sx: { fontWeight: 600 }, children: t('transferPricing.country') }), _jsx(TableCell, { sx: { fontWeight: 600 }, children: t('transferPricing.relationshipType') }), _jsx(TableCell, { sx: { fontWeight: 600 }, children: t('transferPricing.ownership') }), _jsx(TableCell, { sx: { fontWeight: 600 }, children: t('transferPricing.status') }), _jsx(TableCell, { sx: { fontWeight: 600 }, children: t('common.actions') })] }) }), _jsx(TableBody, { children: relatedParties.map((party) => (_jsxs(TableRow, { hover: true, children: [_jsxs(TableCell, { children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 500 }, children: party.name }), party.taxIdentificationNumber && (_jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["TIN: ", party.taxIdentificationNumber] }))] }), _jsx(TableCell, { children: party.country }), _jsx(TableCell, { children: _jsx(Chip, { label: t(`transferPricing.relationshipTypes.${party.relationshipType}`), color: getRelationshipTypeColor(party.relationshipType), variant: "outlined", size: "small" }) }), _jsx(TableCell, { children: party.ownershipPercentage ? `${party.ownershipPercentage}%` : '-' }), _jsx(TableCell, { children: _jsx(Chip, { label: party.isActive ? t('common.active') : t('common.inactive'), color: party.isActive ? 'success' : 'default', variant: "outlined", size: "small" }) }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(IconButton, { size: "small", onClick: () => handleOpen(party), color: "primary", children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", onClick: () => handleDelete(party.id), color: "error", children: _jsx(DeleteIcon, { fontSize: "small" }) })] }) })] }, party.id))) })] }) })), _jsxs(Dialog, { open: open, onClose: handleClose, maxWidth: "md", fullWidth: true, PaperProps: {
                    sx: { borderRadius: 2 }
                }, children: [_jsx(DialogTitle, { children: editingParty ? t('transferPricing.editRelatedParty') : t('transferPricing.addRelatedParty') }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 2, sx: { mt: 1 }, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, required: true, label: t('transferPricing.partyName'), value: formData.name, onChange: handleInputChange('name'), variant: "outlined", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, required: true, select: true, label: t('transferPricing.country'), value: formData.country, onChange: handleInputChange('country'), variant: "outlined", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }, children: countries.map((country) => (_jsx(MenuItem, { value: country, children: country }, country))) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, required: true, select: true, label: t('transferPricing.relationshipType'), value: formData.relationshipType, onChange: handleInputChange('relationshipType'), variant: "outlined", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }, children: Object.values(RelationshipType).map((type) => (_jsx(MenuItem, { value: type, children: t(`transferPricing.relationshipTypes.${type}`) }, type))) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: t('transferPricing.ownershipPercentage'), value: formData.ownershipPercentage || '', onChange: handleInputChange('ownershipPercentage'), variant: "outlined", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }, InputProps: {
                                            endAdornment: '%'
                                        }, inputProps: { min: 0, max: 100, step: 0.01 } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: t('transferPricing.taxIdentificationNumber'), value: formData.taxIdentificationNumber, onChange: handleInputChange('taxIdentificationNumber'), variant: "outlined", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, multiline: true, rows: 3, label: t('transferPricing.description'), value: formData.description, onChange: handleInputChange('description'), variant: "outlined", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }, placeholder: t('transferPricing.descriptionPlaceholder') }) })] }) }), _jsxs(DialogActions, { sx: { p: 3 }, children: [_jsx(Button, { onClick: handleClose, sx: { borderRadius: 2 }, children: t('common.cancel') }), _jsx(Button, { variant: "contained", onClick: handleSave, disabled: !formData.name || !formData.country, sx: { borderRadius: 2 }, children: editingParty ? t('common.update') : t('common.add') })] })] })] }));
};
