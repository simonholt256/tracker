import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DisplayPosts() {
  const [posts, setPosts] = useState('');
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get('http://127.0.0.1:8000/posts/?mine=true', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <div>
      <h2>Your Posts</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '8px', margin: '8px 0' }}>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}


export default DisplayPosts;