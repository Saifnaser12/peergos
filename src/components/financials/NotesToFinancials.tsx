
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  Grid,
  Divider,
  useTheme,
  alpha,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: string;
}

interface NotesToFinancialsProps {
  onNotesChange?: (notes: Note[]) => void;
}

export const NotesToFinancials: React.FC<NotesToFinancialsProps> = ({ onNotesChange }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Accounting Policies',
      content: 'The financial statements have been prepared in accordance with International Financial Reporting Standards (IFRS) as adopted in the UAE. The principal accounting policies applied in the preparation of these financial statements are set out below.',
      tags: ['IFRS', 'UAE GAAP', 'Accounting Standards'],
      lastModified: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Revenue Recognition',
      content: 'Revenue is recognized when control of goods or services is transferred to customers at an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services.',
      tags: ['Revenue', 'IFRS 15', 'Sales'],
      lastModified: new Date().toISOString()
    }
  ]);

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('financial_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    // Save notes to localStorage and notify parent
    localStorage.setItem('financial_notes', JSON.stringify(notes));
    onNotesChange?.(notes);
  }, [notes, onNotesChange]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: [],
      lastModified: new Date().toISOString()
    };
    setEditingNote(newNote);
    setIsDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote({ ...note });
    setIsDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (!editingNote) return;

    if (editingNote.title.trim() === '' || editingNote.content.trim() === '') {
      return; // Don't save empty notes
    }

    const updatedNote = {
      ...editingNote,
      lastModified: new Date().toISOString()
    };

    if (notes.find(n => n.id === editingNote.id)) {
      // Update existing note
      setNotes(notes.map(n => n.id === editingNote.id ? updatedNote : n));
    } else {
      // Add new note
      setNotes([...notes, updatedNote]);
    }

    setIsDialogOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const handleAddTag = () => {
    if (!editingNote || !newTag.trim()) return;

    const tag = newTag.trim();
    if (!editingNote.tags.includes(tag)) {
      setEditingNote({
        ...editingNote,
        tags: [...editingNote.tags, tag]
      });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingNote) return;

    setEditingNote({
      ...editingNote,
      tags: editingNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const commonTags = [
    'IFRS', 'UAE GAAP', 'FTA Compliance', 'Revenue', 'Expenses', 'Assets', 
    'Liabilities', 'Equity', 'Cash Flow', 'Depreciation', 'Provisions',
    'Going Concern', 'Fair Value', 'Related Parties', 'Contingencies'
  ];

  return (
    <Paper sx={{ 
      borderRadius: 3, 
      overflow: 'hidden', 
      boxShadow: theme.shadows[4],
      direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
    }}>
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('financials.notesToFinancials', 'Notes to Financial Statements')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('financials.notesSubtitle', 'Additional disclosures and accounting policies')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNote}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {t('financials.addNote', 'Add Note')}
        </Button>
      </Box>

      <Box sx={{ p: 3 }}>
        {notes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {t('financials.noNotes', 'No notes added yet. Click "Add Note" to get started.')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {notes.map((note, index) => (
              <Grid item xs={12} key={note.id}>
                <Paper 
                  elevation={1}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      boxShadow: theme.shadows[3]
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {`${index + 1}. ${note.title}`}
                    </Typography>
                    <Box>
                      <IconButton size="small" onClick={() => handleEditNote(note)} sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteNote(note.id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                    {note.content}
                  </Typography>

                  {note.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {note.tags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    {t('financials.lastModified', 'Last modified')}: {new Date(note.lastModified).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Edit/Add Note Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingNote?.id && notes.find(n => n.id === editingNote.id) 
            ? t('financials.editNote', 'Edit Note') 
            : t('financials.addNote', 'Add Note')
          }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('financials.noteTitle', 'Note Title')}
                value={editingNote?.title || ''}
                onChange={(e) => setEditingNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                placeholder={t('financials.noteTitlePlaceholder', 'e.g., Accounting Policies, Revenue Recognition, etc.')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label={t('financials.noteContent', 'Note Content')}
                value={editingNote?.content || ''}
                onChange={(e) => setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                placeholder={t('financials.noteContentPlaceholder', 'Enter the detailed content of this note...')}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('financials.tags', 'Tags')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    label={t('financials.addTag', 'Add Tag')}
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} variant="outlined" size="small">
                    {t('common.add', 'Add')}
                  </Button>
                </Box>
                
                {editingNote?.tags && editingNote.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {editingNote.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                      />
                    ))}
                  </Box>
                )}

                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {t('financials.commonTags', 'Common Tags')}:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {commonTags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        if (editingNote && !editingNote.tags.includes(tag)) {
                          setEditingNote({
                            ...editingNote,
                            tags: [...editingNote.tags, tag]
                          });
                        }
                      }}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsDialogOpen(false)} startIcon={<CancelIcon />}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSaveNote} variant="contained" startIcon={<SaveIcon />}>
            {t('common.save', 'Save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
