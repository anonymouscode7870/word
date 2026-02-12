import React from 'react';
import RichTextEditor from './RichTextEditor';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Word & PDF Editor</h1>
      <RichTextEditor />
    </div>
  );
};

export default App;
