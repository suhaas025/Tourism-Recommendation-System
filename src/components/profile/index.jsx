import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { app } from '../../firebase/firebase'; // Import the firebase config
import { auth } from '../../firebase/firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import "./profile.css"

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newProfileData, setNewProfileData] = useState({});
  const database = getDatabase(app);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profilePhoto,setProfilePhoto] =useState(null);
  
  const fetchProfileData = async () => {
    try {
      const userEmail = auth.currentUser.email; // Assuming you have access to the user's email address through Firebase Authentication
      const profileRef = ref(database, 'Users');
      const snapshot = await get(profileRef);
  
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const profile = childSnapshot.val();
          if (profile.Email === userEmail) {
            setProfileData(profile);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);

    try {
      const userEmail = auth.currentUser.email;
      const storage = getStorage(app);
      const photoRef = storageRef(storage, `Profile_Photos/${userEmail}`);
      console.log('ok')
      await uploadBytes(photoRef, file);
      // Once uploaded, update the user's profile with the photo URL
      const database = getDatabase(app);
      const usersRef = ref(database, 'Users');
      const photoURL = await getDownloadURL(photoRef)
      
      get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.Email === userEmail) {
            const userId = childSnapshot.key;
            const userRef = ref(database, `Users/${userId}`);
            
            
            // Update the user entry with the profilePhotoURL
            update(userRef, { profilePhotoURL: photoURL })
            fetchProfileData();
          }
      })}})
    } catch (error) {
      console.error('Error uploading profile photo:', error);
    }

    setUploadingPhoto(false);
  };
  useEffect(() => {
        

    fetchProfileData();
  }, [database]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setNewProfileData(profileData);
    console.log(profileData)
  };

  const handleSaveProfile = async () => {
    try {
      const userEmail = auth.currentUser.email;
      const profileRef = ref(database, 'Users');
      const snapshot = await get(profileRef);
  
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const profile = childSnapshot.val();
          if (profile.Email === userEmail) {
            const profileKey = childSnapshot.key;
            const updates = {};
            updates[profileKey] = newProfileData;
            update(profileRef, updates);
          }
        });
      }
      setProfileData(newProfileData);
      setIsEditing(false);
      console.log(profileData)
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProfileData({ ...newProfileData, [name]: value });
  };

  return (
    <div className='main'>
      <h1>Profile</h1>
      <div className="profile-section">
      <img className='profilepic' src={profileData.profilePhotoURL||"images.png"} alt="Profile" /></div>
        {isEditing && (
          <div class = "inp">
          <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} /></div>
        )}
        <div class = "imgdiv">
        
      </div>
      <div className="profile-data">
        <label>Name:</label>
        <input
          type="text"
          name="Name"
          value={isEditing ? newProfileData.Name : profileData.Name}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="profile-data">
        <label>Email:</label>
        <input
          type="text"
          name="Email"
          value={isEditing ? newProfileData.Email : profileData.Email}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="profile-data">
        <label>Age:</label>
        <input
          type="text"
          name="Age"
          value={isEditing ? newProfileData.Age : profileData.Age}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="profile-data">
        <label>Phone Number:</label>
        <input
          type="text"
          name="Number"
          value={isEditing ? newProfileData.Number : profileData.Number}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      {isEditing ? (
        <button class = "ok" onClick={()=>handleSaveProfile()}>OK</button>
      ) : (
        <button class = "ok" onClick={()=>handleEditProfile()}>Edit Profile</button>
      )}
    </div>
  );
};

export default Profile