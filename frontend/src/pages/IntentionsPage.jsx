import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

import Mountains from '../assets/mountains.png';
import Pencil from '../assets/pencil.png';

import '../cssStyles/Intentions.css';

import { IntentionsContext } from "../context/IntentionsContext";
import { UserInfoContext } from "../context/UserInfoContext";

function IntentionsPage() {
  const navigate = useNavigate();

  const {
    intentions,
    createIntention,
    updateIntention,
    deleteIntention,
    loadingIntentions
  } = useContext(IntentionsContext);

  const { user } = useContext(UserInfoContext);

  const [intentionText, setIntentionText] = useState('');
  const [toQuit, setToQuit] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [selectedIntention, setSelectedIntention] = useState(null);
  const [addIntentionsVisible, setAddIntentionsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (!selectedIntention) return;

    deleteIntention(selectedIntention.id);
    setSelectedIntention(null);
  };

  const handleEdit = () => {
    if (!selectedIntention) return;

    setIsEditing(true);
    setAddIntentionsVisible(true);

    setIntentionText(selectedIntention.intention);
    setNoteText(selectedIntention.note || "");
    setToQuit(selectedIntention.to_quit);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSave = () => {
    if (isEditing) {
      updateIntention(selectedIntention.id, {
        intention: intentionText,
        to_quit: toQuit,
        note: noteText
      });
    } else {
      createIntention({
        intention: intentionText,
        to_quit: toQuit,
        note: noteText
      });
    }

    setIntentionText("");
    setNoteText("");
    setToQuit(false);
    setIsEditing(false);
    setAddIntentionsVisible(false);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className='intention-page-split'>
        <div className='mission-switch for-mobile'>
          <NavLink to="/intentions" className="missions-link">
            Intentions
          </NavLink>
          <NavLink to="/challenges" className="missions-link">
            Challenges
          </NavLink>
        </div>
        <div className='mobile-add-intention for-mobile' onClick={() => setAddIntentionsVisible(prev => !prev)}>Add an Intention</div>
        <div className='set-intentions'>
          <div className='set-intentions-tab'></div>
          <h3>Intentions:</h3>

          {loadingIntentions && <p>Loading...</p>}
          {!loadingIntentions && intentions.length === 0 && (
            <p>No intentions yet, add something above</p>
          )}

          <ul className='intentions-ul'>
            {intentions.map((item) => (
              <React.Fragment key={item.id}>
                <li
                  onClick={() => setSelectedIntention(item)}
                  className={`set-intention 
                    ${item.to_quit ? "quit-intention" : ""} 
                    ${selectedIntention?.id === item.id ? 'selected-intent' : ''}`}
                >
                  {item.intention} {item.to_quit ? "(Quit)" : ""}
                </li>

                {/* MOBILE DETAILS BOX — appears directly under the clicked item */}
                {isMobile && selectedIntention?.id === item.id && (
                  <div className="mobile-intention-details">
                    {/* <div>Intention:</div>
                    <div className="intention-info-display">
                      {item.intention}
                    </div> */}

                    <div>Note:</div>
                    <div className="intention-info-display">
                      {item.note || "No note available"}
                    </div>

                    <div>Start date:</div>
                    <div className="intention-info-display">
                      {item.created_at?.split("T")[0]}
                    </div>

                    <div>Active challenges: 2</div>
                    <div>Completed challenges: 0</div>
                    <div>Total stars: 50</div>

                    <div className="edit-intentions-buttons">
                      <button className="edit-intentions-button" onClick={handleEdit}>
                        Edit
                      </button>
                      <button className="edit-intentions-button">Retire</button>
                      <button className="edit-intentions-button" onClick={handleDelete}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </ul>

        </div>

        <div className='intentions-right-column'>
          <div className='intentions-right-column__button-and-pic'>
            <div className='intentions-right-column__button-box'>
              <div
                onClick={() => setAddIntentionsVisible(prev => !prev)}
                className='add-intention'>
                Add Intention
              </div>
              
            </div>
          </div>

          <div className='intentions-right-column__box'>
            <div className='intentions-right-column__display'>
              <img className='pencil-img' src={Pencil} />
              <div className='intention-file'>intention file</div>

              {selectedIntention ? (
                <>
                  <div>Intention:</div>
                  <div className='intention-info-display'>
                    {selectedIntention.intention}
                  </div>

                  <div>Note:</div>
                  <div className='intention-info-display'>
                    {selectedIntention.note || "No note available"}
                  </div>

                  <div>Start date:</div>
                  <div className='intention-info-display'>
                    {selectedIntention.created_at?.split('T')[0]}
                  </div>

                  <div>Active challenges: 2</div>
                  <div>Completed challenges: 0</div>
                  <div>Total stars: 50</div>

                  <div className='edit-intentions-buttons'>
                    <button className='edit-intentions-button' onClick={handleEdit}>Edit</button>
                    <button className='edit-intentions-button'>Retire</button>
                    <button className='edit-intentions-button' onClick={handleDelete}>Delete</button>
                  </div>
                </>
              ) : (
                <div>Select an intention</div>
              )}
            </div>
          </div>

          <div className='intention-help-box'>
            <div className='intention-help'>
              It's best to set simple and achievable goals. If an intention can't be summed up in a simple phrase consider splitting the objective into smaller more manageable chunks.
            </div>
          </div>
        </div>

        {addIntentionsVisible && (
          <div className='add-box'>
            <h2 className='add-title'>Add an Intention</h2>

            <div>
              <button onClick={() => setToQuit(false)}>To introduce</button>
              <button onClick={() => setToQuit(true)}>To stop/reduce</button>
            </div>

            <div style={{ margin: '10px', background: toQuit ? '#e08d8b' : '#d5f2cb'}}>
              <input
                type="text"
                placeholder="Enter your intention"
                value={intentionText}
                onChange={(e) => setIntentionText(e.target.value)}
                style={{ padding: '8px', width: '300px', margin: '10px' }}
              />
            </div>

            <div>
              Add a note
              <input
                type="text"
                placeholder="Add a note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>

            <button
              className='add-button'
              onClick={handleSave}
              style={{ padding: '8px 12px', width: '200px' }}
            >
              {isEditing ? "Save Changes" : "Add Intention"}
            </button>

            <button
              className='challenge-close-button'
              onClick={() => {
                setAddIntentionsVisible(false);
                setIsEditing(false);
              }}
            >
              x
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default IntentionsPage;
