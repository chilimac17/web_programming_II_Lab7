import React from "react";
import './App.css'
import {useMutation} from '@apollo/client';
import ReactModal from 'react-modal';

import queries from '../queries';

ReactModal.setAppElement('#root');
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            border: '1px solid #235c1d',
            borderRadius: '4px'
        }

        };

function DeleteArtistModal(props) {
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [artist, setArtist] = useState(props.deleteArtist);

    const [deleteArtist] = useMutation(queries.DELETE_ARTIST, {
        update(cache){
            cache.modify({
                fields: {
                    artist(existingArtists, { readField }) {
                        return existingArtists.filter(artistRef => artist._id !== readField('id', artistRef),
                        );
                    },
                },
            });
        },
    });

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setArtist(null);
        props.handleClose();
    };

    return (
        <div>
            <ReactModal isOpen={showDeleteModal} contentLabel="Delete Artist" style={customStyles}> 
            <div>
                <p>Are you sure you want to delete this {artist?.stage_name}?</p>
                <form id='delete-artist' onSubmit={(e) => {
                    e.preventDefault();
                    deleteArtist({variables: {id: artist._id}});
                    setShowDeleteModal(false);
                    alert("Artist deleted successfully!");
                    props.handleClose();
                }}>
                <br />
                <br />
                <button type="submit">Delete Artist</button>
                </form>
            </div>
            <br />
            <br />
            <button onClick={handleCloseModal}>Cancel</button>
            </ReactModal>
        </div>

            );
}