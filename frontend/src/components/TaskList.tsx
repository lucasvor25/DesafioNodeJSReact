import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Container
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Task } from '../interface/taskInterface';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}) => (
  <Container maxWidth="md" style={{ display: 'flex', justifyContent: 'center' }}>
    <List style={{ width: '100%', maxWidth: '600px' }}>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          divider
          secondaryAction={
            <>
              <IconButton edge="end" onClick={() => onEdit(task)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => onDelete(task.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <Checkbox
            edge="start"
            checked={task.completed}
            onChange={() => onToggleComplete(task)}
          />
          <ListItemText
            primary={task.title}
            secondary={task.description}
            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
          />
        </ListItem>
      ))}
    </List>
  </Container>
);

export default TaskList;
