import React from "react";
import './App.css'

import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';

function Add(props) {
    const [addArtist] = useMutation(queries.ADD_ARTIST, {
        update(cache, {data: {addArtist}}) {
            const {artist} = cache.readQuery({query: queries.GET_ARTISTS});
            cache.writeQuery({
                query: queries.GET_ARTISTS,
                data: {artist: [...artist, addArtist]}
            });

        }
    });

    const [addAlbum] = useMutation(queries.ADD_ALBUM, {
        update(cache, {data: {addAlbum}}) {
            const {albums} = cache.readQuery({query: queries.GET_ALBUMS});
            cache.writeQuery({
                query: queries.GET_ALBUMS,
                data: {albums: [...albums, addAlbum]}
            });
        }
    });

    const [addListener] = useMutation(queries.ADD_LISTENER, {
        update(cache, {data: {addListener}}) {
            const {listeners} = cache.readQuery({query: queries.GET_LISTENERS});
            cache.writeQuery({
                query: queries.GET_LISTENERS,
                data: {listeners: [...listeners, addListener]}
            });
        }
    });

    const onSubmitArtist = (e) => {
        e.preventDefault();
        let stage_name = document.getElementById("stage_name");
        let genre = document.getElementById("genre");
        let label = document.getElementById("label");
        let management_email = document.getElementById("management_email");
        let management_phone = document.getElementById("management_phone");
        let home_city = document.getElementById("home_city");
        let date_signed = document.getElementById("date_signed");

        addArtist({
            variables: {
                stage_name: stage_name.value, 
                genre: genre.value, 
                label: label.value, 
                management_email: management_email.value, 
                management_phone: management_phone.value, 
                home_city: home_city.value, 
                date_signed: date_signed.value}});
        //reset drop down ?
        // employerId.value = '1';
        document.getElementById("add-artist-form").reset();
        alert("Artist added successfully!");
        props.closeAddFormState();
    };

    const onSubmitAlbum = (e) => {
        e.preventDefault();
        let title = document.getElementById("title");
        let genre = document.getElementById("genre");
        let track_count = document.getElementById("track_count");
        let artist_id = document.getElementById("artist_id");
        let release_date = document.getElementById("release_date");
        let promo_start = document.getElementById("promo_start");
        let promo_end = document.getElementById("promo_end");
        addAlbum({
            variables: {
                title: title.value,
                genre: genre.value,
                track_count: track_count.value,
                artist_id: artist_id.value,
                release_date: release_date.value,
                promo_start: promo_start.value,
                promo_end: promo_end.value
            }
        });
        document.getElementById("add-album-form").reset();
        alert("Album added successfully!");
        props.closeAddFormState();
    };

    const onSubmitListener = (e) => {
        e.preventDefault();
        let first_name = document.getElementById("first_name");
        let last_name = document.getElementById("last_name");
        let email = document.getElementById("email");
        let date_of_birth = document.getElementById("date_of_birth");
        let subscription_tier = document.getElementById("subscription_tier");
        addListener({
            variables: {
                first_name: first_name.value,
                last_name: last_name.value,
                email: email.value,
                date_of_birth: date_of_birth.value,
                subscription_tier: subscription_tier.value
            }
        });
        document.getElementById("add-listener-form").reset();
        alert("Listener added successfully!");
        props.closeAddFormState();
    };

    const {data} = useQuery(queries.GET_ARTISTS);
    if(data){
        const {artist} = data;
    }

    let body = null;
    if(props.type === "artist"){
        body = (
            <div>DIVVVV23</div>
        );
    }

    return (
        <div>
            {body}
        </div>
    );
}

export default Add;