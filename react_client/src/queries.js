import { gql } from "@apollo/client"

const GET_ARTISTS = gql`
    query {
        artists {
            _id
            stage_name
            genre
            label
            management_email
            management_phone
            home_city
            date_signed
            numOfAlbums
        }
    }
`;

