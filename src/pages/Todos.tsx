import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ClickAwayListener,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import api, { Todo } from '../services/api';

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Partial<Todo>>({});
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.todos.getAll();
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddClick = () => {
    setEditingTodo({});
    setOpen(true);
  };

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTodo({});
  };

  const handleSave = async () => {
    try {
      if (editingTodo.id) {
        await api.todos.update(editingTodo as Todo);
      } else {
        await api.todos.create({
          title: editingTodo.title || '',
          completed: editingTodo.completed || false,
          userId: 1, // Using a default user ID
        });
      }
      fetchTodos();
      handleClose();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.todos.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await api.todos.update(updatedTodo);
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // New functions for inline editing
  const startInlineEdit = (todo: Todo) => {
    setInlineEditId(todo.id);
    setInlineEditValue(todo.title);
  };

  const saveInlineEdit = async () => {
    if (!inlineEditId) return;
    
    try {
      const todoToUpdate = todos.find(t => t.id === inlineEditId);
      if (!todoToUpdate) return;
      
      const updatedTodo = { ...todoToUpdate, title: inlineEditValue };
      await api.todos.update(updatedTodo);
      
      // Update local state
      setTodos(todos.map(t => t.id === inlineEditId ? updatedTodo : t));
      cancelInlineEdit();
    } catch (error) {
      console.error('Error updating todo title:', error);
    }
  };

  const cancelInlineEdit = () => {
    setInlineEditId(null);
    setInlineEditValue('');
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveInlineEdit();
    } else if (e.key === 'Escape') {
      cancelInlineEdit();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleAddClick}>
          Add Todo
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Completed</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo)}
                  />
                </TableCell>
                <TableCell>
                  {inlineEditId === todo.id ? (
                    <ClickAwayListener onClickAway={saveInlineEdit}>
                      <TextField
                        fullWidth
                        variant="standard"
                        value={inlineEditValue}
                        onChange={(e) => setInlineEditValue(e.target.value)}
                        onKeyDown={handleInlineKeyDown}
                        autoFocus
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={saveInlineEdit} size="small">
                              <SaveIcon fontSize="small" />
                            </IconButton>
                          ),
                        }}
                      />
                    </ClickAwayListener>
                  ) : (
                    <Tooltip title="Click to edit" placement="top" arrow>
                      <Box 
                        component="span" 
                        onClick={() => startInlineEdit(todo)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { 
                            textDecoration: 'underline',
                            color: 'primary.main'
                          },
                          display: 'block',
                          width: '100%',
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? 'text.disabled' : 'text.primary'
                        }}
                      >
                        {todo.title}
                      </Box>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(todo)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingTodo.id ? 'Edit Todo' : 'Add Todo'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editingTodo.title || ''}
            onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Todos; 