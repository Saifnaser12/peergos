import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, useTheme, alpha } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Note as NoteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
export const NotesToFinancials = ({ onNotesChange }) => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const [notes, setNotes] = useState([
        {
            id: '1',
            title: 'Accounting Policies',
            content: 'The financial statements are prepared in accordance with International Financial Reporting Standards (IFRS) as adopted by the UAE.',
            tags: ['IFRS', 'Policies'],
            lastModified: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Revenue Recognition',
            content: 'Revenue is recognized when control of goods or services is transferred to customers at the amount expected to be received.',
            tags: ['Revenue', 'Recognition'],
            lastModified: new Date().toISOString()
        }
    ]);
    const [editingNote, setEditingNote] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        tags: [],
        tagInput: ''
    });
    useEffect(() => {
        onNotesChange(notes);
    }, [notes, onNotesChange]);
    const handleAddNote = () => {
        const note = {
            id: Date.now().toString(),
            title: newNote.title,
            content: newNote.content,
            tags: newNote.tags,
            lastModified: new Date().toISOString()
        };
        setNotes([...notes, note]);
        setNewNote({ title: '', content: '', tags: [], tagInput: '' });
        setOpenDialog(false);
    };
    const handleEditNote = (note) => {
        setEditingNote(note);
        setNewNote({
            title: note.title,
            content: note.content,
            tags: note.tags,
            tagInput: ''
        });
        setOpenDialog(true);
    };
    const handleUpdateNote = () => {
        if (editingNote) {
            const updatedNotes = notes.map(note => note.id === editingNote.id
                ? { ...editingNote, ...newNote, lastModified: new Date().toISOString() }
                : note);
            setNotes(updatedNotes);
            setEditingNote(null);
            setNewNote({ title: '', content: '', tags: [], tagInput: '' });
            setOpenDialog(false);
        }
    };
    const handleDeleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };
    const handleAddTag = () => {
        if (newNote.tagInput.trim() && !newNote.tags.includes(newNote.tagInput.trim())) {
            setNewNote({
                ...newNote,
                tags: [...newNote.tags, newNote.tagInput.trim()],
                tagInput: ''
            });
        }
    };
    const handleRemoveTag = (tagToRemove) => {
        setNewNote({
            ...newNote,
            tags: newNote.tags.filter(tag => tag !== tagToRemove)
        });
    };
    return (_jsxs(Box, { sx: { direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(NoteIcon, { sx: { mr: 1, color: theme.palette.primary.main } }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: t('financials.notesToFinancials', 'Notes to Financial Statements') })] }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => setOpenDialog(true), sx: { borderRadius: 2, textTransform: 'none' }, children: t('financials.addNote', 'Add Note') })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 }, children: t('financials.notesDescription', 'Add explanatory notes and disclosures to accompany your financial statements as required by FTA guidelines.') }), _jsx(Grid, { container: true, spacing: 3, children: notes.map((note) => (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: {
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.primary.main, 0.02)})`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                transform: 'translateY(-2px)'
                            }
                        }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600, flex: 1 }, children: note.title }), _jsxs(Box, { children: [_jsx(IconButton, { size: "small", onClick: () => handleEditNote(note), sx: { mr: 1 }, children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", onClick: () => handleDeleteNote(note.id), color: "error", children: _jsx(DeleteIcon, { fontSize: "small" }) })] })] }), _jsx(Typography, { variant: "body2", sx: { mb: 2, lineHeight: 1.6 }, children: note.content }), _jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }, children: note.tags.map((tag) => (_jsx(Chip, { label: tag, size: "small", sx: {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main
                                    } }, tag))) }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [t('common.lastModified', 'Last modified'), ": ", new Date(note.lastModified).toLocaleDateString()] })] }) }, note.id))) }), _jsxs(Dialog, { open: openDialog, onClose: () => {
                    setOpenDialog(false);
                    setEditingNote(null);
                    setNewNote({ title: '', content: '', tags: [], tagInput: '' });
                }, maxWidth: "md", fullWidth: true, PaperProps: {
                    sx: { borderRadius: 3 }
                }, children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: editingNote ? t('financials.editNote', 'Edit Note') : t('financials.addNote', 'Add New Note') }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 2, sx: { mt: 1 }, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: t('common.title', 'Title'), value: newNote.title, onChange: (e) => setNewNote({ ...newNote, title: e.target.value }), sx: { mb: 2 } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, multiline: true, rows: 6, label: t('common.content', 'Content'), value: newNote.content, onChange: (e) => setNewNote({ ...newNote, content: e.target.value }), sx: { mb: 2 } }) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { sx: { display: 'flex', gap: 1, mb: 2 }, children: [_jsx(TextField, { label: t('common.addTag', 'Add Tag'), value: newNote.tagInput, onChange: (e) => setNewNote({ ...newNote, tagInput: e.target.value }), onKeyPress: (e) => e.key === 'Enter' && handleAddTag(), sx: { flex: 1 } }), _jsx(Button, { variant: "outlined", onClick: handleAddTag, children: t('common.add', 'Add') })] }), _jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 1 }, children: newNote.tags.map((tag) => (_jsx(Chip, { label: tag, onDelete: () => handleRemoveTag(tag), size: "small", color: "primary" }, tag))) })] })] }) }), _jsxs(DialogActions, { sx: { p: 3 }, children: [_jsx(Button, { onClick: () => {
                                    setOpenDialog(false);
                                    setEditingNote(null);
                                    setNewNote({ title: '', content: '', tags: [], tagInput: '' });
                                }, sx: { textTransform: 'none' }, children: t('common.cancel', 'Cancel') }), _jsx(Button, { onClick: editingNote ? handleUpdateNote : handleAddNote, variant: "contained", sx: { textTransform: 'none', borderRadius: 2 }, children: editingNote ? t('common.update', 'Update') : t('common.add', 'Add') })] })] })] }));
};
