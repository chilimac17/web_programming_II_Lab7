import React, {useState} from 'react';
import './App.css'
import {useQuery} from '@apollo/client';
import queries from '../queries';
import Add from "./Add";
import DeleteArtistModal from './DeleteArtistModal';
import EditArtistModal from './EditArtistModal';

function Artist() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editArtist, setEditArtist] = useState(null);
    const [deleteArtist, setDeleteArtist] = useState(null);
    const {loading, error, data} = useQuery(queries.GET_ARTISTS, {
        fetchPolicy: 'cache-and-network'
    });

    const handleOpenEditModal = (artist) => {
        setShowEditModal(true);
        setEditArtist(artist);
    };

    const handleOpenDeleteModal = (artist) => {
        setShowDeleteModal(true);
        setDeleteArtist(artist);
    };

    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };



    if(data)
        {
            const {artist} = data;
            
            return(
                <div>
                    <button onClick={() => setShowAddForm(!showAddForm)}>Create Artist</button>
                    {showAddForm && <Add type="artist" closeAddFormState={closeAddFormState} />}
                    <br />
                    <br />
                    {artist.map((artist) => (
                      
                                <div key={artist.id} >
                                    <h5>{artist.name}</h5>
                                    <br />
                                    <button onClick={() => handleOpenEditModal(artist)}>Edit</button>
                                    <button onClick={() => handleOpenDeleteModal(artist)}>Delete</button>
                                    <br />  
                                </div>
                    ))}
                    {showEditModal && (<EditArtistModal isOpen={showEditModal} artist={editArtist} handleClose={handleCloseModals}/>)}
                    {showDeleteModal && (<DeleteArtistModal isOpen={showDeleteModal} artist={deleteArtist} handleClose={deleteArtist} />)}
                </div>
            );
        } else if(loading)
            {
                return(<div>Loading...</div>)
            }
            else if(error)
                {
                    return(<div>{error.message}</div>)
                }

}

export default Artist;