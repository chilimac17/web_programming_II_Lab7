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

