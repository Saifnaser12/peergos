import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Note as NoteIcon
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
  onNotesChange: (notes: Note[]) => void;
}

export const NotesToFinancials: React.FC<NotesToFinancialsProps> = ({ onNotesChange }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [notes, setNotes] = useState<Note[]>([
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

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    tagInput: ''
  });

  useEffect(() => {
    onNotesChange(notes);
  }, [notes, onNotesChange]);

  const handleAddNote = () => {
    const note: Note = {
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

  const handleEditNote = (note: Note) => {
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
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id
          ? { ...editingNote, ...newNote, lastModified: new Date().toISOString() }
          : note
      );
      setNotes(updatedNotes);
      setEditingNote(null);
      setNewNote({ title: '', content: '', tags: [], tagInput: '' });
      setOpenDialog(false);
    }
  };

  const handleDeleteNote = (id: string) => {
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

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Box sx={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NoteIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('financials.notesToFinancials', 'Notes to Financial Statements')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {t('financials.addNote', 'Add Note')}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('financials.notesDescription', 'Add explanatory notes and disclosures to accompany your financial statements as required by FTA guidelines.')}
      </Typography>

      <Grid container spacing={3}>
        {notes.map((note) => (
          <Grid item xs={12} md={6} key={note.id}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.primary.main, 0.02)})`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                  {note.title}
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

              <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                {note.content}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {note.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main
                    }}
                  />
                ))}
              </Box>

              <Typography variant="caption" color="text.secondary">
                {t('common.lastModified', 'Last modified')}: {new Date(note.lastModified).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Note Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingNote(null);
          setNewNote({ title: '', content: '', tags: [], tagInput: '' });
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingNote ? t('financials.editNote', 'Edit Note') : t('financials.addNote', 'Add New Note')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('common.title', 'Title')}
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label={t('common.content', 'Content')}
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label={t('common.addTag', 'Add Tag')}
                  value={newNote.tagInput}
                  onChange={(e) => setNewNote({ ...newNote, tagInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  sx={{ flex: 1 }}
                />
                <Button variant="outlined" onClick={handleAddTag}>
                  {t('common.add', 'Add')}
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {newNote.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    color="primary"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditingNote(null);
              setNewNote({ title: '', content: '', tags: [], tagInput: '' });
            }}
            sx={{ textTransform: 'none' }}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={editingNote ? handleUpdateNote : handleAddNote}
            variant="contained"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {editingNote ? t('common.update', 'Update') : t('common.add', 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};