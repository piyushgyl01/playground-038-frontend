// src/components/TagList.js
import React from 'react';
import { Badge } from 'react-bootstrap';

const TagList = ({ tags, onTagSelect }) => {
  if (!tags || tags.length === 0) {
    return <p className="text-muted">No tags available</p>;
  }

  return (
    <div className="tag-list">
      {tags.map(tag => (
        <Badge
          key={tag}
          bg="secondary"
          className="me-1 mb-1"
          style={{ cursor: 'pointer' }}
          onClick={() => onTagSelect(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default TagList;