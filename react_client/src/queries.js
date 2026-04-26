import { gql } from "@apollo/client";

const GET_ARTISTS = gql`
  query GetArtists {
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

const ADD_ARTIST = gql`
  mutation AddArtist(
    $stage_name: String!
    $genre: String!
    $label: String!
    $management_email: String!
    $management_phone: String!
    $home_city: String!
    $date_signed: String!
  ) {
    addArtist(
      stage_name: $stage_name
      genre: $genre
      label: $label
      management_email: $management_email
      management_phone: $management_phone
      home_city: $home_city
      date_signed: $date_signed
    ) {
      _id
      stage_name
      albums {
        _id
        title
      }
      numOfAlbums
    }
  }
`;

const EDIT_ARTIST = gql`
  mutation EditArtist(
    $_id: String!
    $management_email: String
    $management_phone: String
  ) {
    editArtist(
      _id: $_id
      management_email: $management_email
      management_phone: $management_phone
    ) {
      _id
      stage_name
      albums {
        _id
        title
      }
      numOfAlbums
    }
  }
`;

const DELETE_ARTIST = gql`
  mutation DeleteArtist($_id: String!) {
    removeArtist(_id: $_id) {
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

const GET_LISTENERS = gql`
  query GetListeners {
    listeners {
      _id
      first_name
      last_name
      email
      date_of_birth
      subscription_tier
      favorite_albums {
        _id
        title
        genre
        track_count
        artist {
          _id
          stage_name
          albums {
            _id
            title
          }
          numOfAlbums
        }
        release_date
        promo_start
        promo_end
      }
      numOfFavoriteAlbums
    }
  }
`;

const ADD_LISTENER = gql`
  mutation AddListener(
    $first_name: String!
    $last_name: String!
    $email: String!
    $date_of_birth: String!
    $subscription_tier: String!
  ) {
    addListener(
      first_name: $first_name
      last_name: $last_name
      email: $email
      date_of_birth: $date_of_birth
      subscription_tier: $subscription_tier
    ) {
      _id
      first_name
      last_name
      email
      date_of_birth
      subscription_tier
      favorite_albums {
        _id
        title
        genre
        track_count
        artist {
          _id
          stage_name
          albums {
            _id
            title
          }
          numOfAlbums
        }
        release_date
        promo_start
        promo_end
      }
      numOfFavoriteAlbums
    }
  }
`;

const EDIT_LISTENER = gql`
  mutation EditListener(
    $_id: String!
    $email: String
    $subscription_tier: String
  ) {
    editListener(
      _id: $_id
      email: $email
      subscription_tier: $subscription_tier
    ) {
      _id
      first_name
      last_name
      email
      date_of_birth
      subscription_tier
    }
  }
`;

const DELETE_LISTENER = gql`
  mutation DeleteListener($_id: String!) {
    removeListener(_id: $_id) {
      _id
      first_name
      last_name
      email
      date_of_birth
      subscription_tier
    }
  }
`;

const GET_ALBUMS = gql`
  query GetAlbums {
    albums {
      _id
      title
      genre
      track_count
      artist {
        _id
        stage_name
        albums {
          _id
          title
        }
        numOfAlbums
      }
      release_date
      promo_start
      promo_end
    }
  }
`;

const ADD_ALBUM = gql`
  mutation AddAlbum(
    $title: String!
    $genre: String!
    $track_count: Int!
    $artist: String!
    $release_date: String!
    $promo_start: String!
    $promo_end: String!
  ) {
    addAlbum(
      title: $title
      genre: $genre
      track_count: $track_count
      artist: $artist
      release_date: $release_date
      promo_start: $promo_start
      promo_end: $promo_end
    ) {
      _id
      title
      genre
      track_count
      artist {
        _id
        stage_name
        albums {
          _id
          title
        }
        numOfAlbums
      }
      release_date
      promo_start
      promo_end
    }
  }
`;

const EDIT_ALBUM = gql`
  mutation EditAlbum(
    $_id: String!
    $title: String
    $track_count: Int
    $artist: String
    $release_date: String
    $promo_start: String
    $promo_end: String
  ) {
    editAlbum(
      _id: $_id
      title: $title
      track_count: $track_count
      artist: $artist
      release_date: $release_date
      promo_start: $promo_start
      promo_end: $promo_end
    ) {
      _id
      title
      genre
      track_count
      artist {
        _id
        stage_name
        albums {
          _id
          title
        }
        numOfAlbums
      }
      release_date
      promo_start
      promo_end
    }
  }
`;

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($_id: String!) {
    removeAlbum(_id: $_id) {
      _id
      title
      genre
      track_count
      artist {
        _id
        stage_name
        albums {
          _id
          title
        }
        numOfAlbums
      }
      release_date
      promo_start
      promo_end
    }
  }
`;

const queries = {
  GET_ARTISTS,
  ADD_ARTIST,
  EDIT_ARTIST,
  DELETE_ARTIST,
  GET_LISTENERS,
  ADD_LISTENER,
  EDIT_LISTENER,
  DELETE_LISTENER,
  GET_ALBUMS,
  ADD_ALBUM,
  EDIT_ALBUM,
  DELETE_ALBUM,
};

export default queries;