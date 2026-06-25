import React, { useState } from 'react';
import axios from 'axios';

function CreatePost() {
  const [postContent, setPostContent] = useState('');
  const [postMessage, setPostMessage] = useState('');

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');

    try {
       await axios.post(
        'http://127.0.0.1:8000/posts/',
        { content: postContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      

      setPostMessage('Post created!');
      setPostContent('');
    } catch (error) {
      console.error(error);
      setPostMessage('Failed to create post.');
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleCreatePost}>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>
      {postMessage && <p>{postMessage}</p>}
    </div>
  );
}

export default CreatePost;