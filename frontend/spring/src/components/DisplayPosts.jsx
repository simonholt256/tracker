import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DisplayPosts({state}) {
  const [posts, setPosts] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(state)

  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  
  const mine = view === "user";

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get(`http://127.0.0.1:8000/posts/?mine=${mine}`, {
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


  const handleUpdate = async (postId) => {
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/posts/${postId}`,
      { content: editedContent },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Update the post in state
    setPosts(posts.map(post =>
      post.id === postId ? response.data : post
    ));

    // Exit edit mode
    setEditingId(null);

  } catch (error) {
    console.error("Update failed", error);
  }
};


  const handleDelete = async (postId) => {
    const token = localStorage.getItem("jwtToken");

    try {
      await axios.delete(
        `http://127.0.0.1:8000/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // remove from UI without refresh
      setPosts(posts.filter(post => post.id !== postId));

    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div>
      <h2>{view === "user" ? "Your Post" : "All Posts"}</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '8px', margin: '8px 0' }}>
          <>
            {editingId === post.id ? (
              <input
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            ) : (
              <p>{post.content}</p>
            )}
          </>
          <div>
            {view === "user" ? (
              <>
                {editingId === post.id ? (
                  <>
                    <button onClick={() => handleUpdate(post.id)}>save</button>
                    <button onClick={() => setEditingId(null)}>cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => {
                      setEditingId(post.id);
                      setEditedContent(post.content);
                    }}>
                      edit
                    </button>
                    <button onClick={() => handleDelete(post.id)}>delete</button>
                  </>
                )}
                <span> likes 0</span>
              </>
              
            ) : (
              <>
                <button>like</button>
                <span> 0</span>
              </>
            )}
          </div>
        </div>
        
      ))}
    </div>
  );
}


export default DisplayPosts;