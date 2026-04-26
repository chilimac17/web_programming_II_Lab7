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

const GET_ARTIST_BY_ID = gql`
  query GetArtistById($_id: String!) {
    getArtistById(_id: $_id) {
      _id
      stage_name
      genre
      label
      management_email
      management_phone
      home_city
      date_signed
      numOfAlbums
      albums {
        _id
        title
        genre
        track_count
        release_date
        promo_start
        promo_end
      }
    }
  }
`;

const GET_ALBUMS_BY_ARTIST_ID = gql`
  query GetAlbumsByArtistId($artistId: String!) {
    getAlbumsByArtistId(artistId: $artistId) {
      _id
      title
      genre
      track_count
      release_date
      promo_start
      promo_end
    }
  }
`;

const GET_ARTISTS_BY_LABEL = gql`
  query GetArtistsByLabel($label: String!) {
    getArtistsByLabel(label: $label) {
      _id
      stage_name
      genre
      label
      home_city
      date_signed
      numOfAlbums
    }
  }
`;

const GET_ARTISTS_SIGNED_BETWEEN = gql`
  query GetArtistsSignedBetween($start: String!, $end: String!) {
    getArtistsSignedBetween(start: $start, end: $end) {
      _id
      stage_name
      genre
      label
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

const EDIT_ARTIST = gql`
  mutation EditArtist(
    $_id: String!
    $stage_name: String
    $genre: String
    $label: String
    $management_email: String
    $management_phone: String
    $home_city: String
    $date_signed: String
  ) {
    editArtist(
      _id: $_id
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

const DELETE_ARTIST = gql`
  mutation DeleteArtist($_id: String!) {
    removeArtist(_id: $_id) {
      _id
      stage_name
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
      numOfFavoriteAlbums
    }
  }
`;

const GET_LISTENER_BY_ID = gql`
  query GetListenerById($_id: String!) {
    getListenerById(_id: $_id) {
      _id
      first_name
      last_name
      email
      date_of_birth
      subscription_tier
      numOfFavoriteAlbums
      favorite_albums {
        _id
        title
        genre
        track_count
        release_date
        artist {
          _id
          stage_name
        }
      }
    }
  }
`;

const GET_LISTENERS_BY_SUBSCRIPTION = gql`
  query GetListenersBySubscription($tier: String!) {
    getListenersBySubscription(tier: $tier) {
      _id
      first_name
      last_name
      email
      subscription_tier
      numOfFavoriteAlbums
    }
  }
`;

const SEARCH_LISTENERS_BY_LAST_NAME = gql`
  query SearchListenersByLastName($searchTerm: String!) {
    searchListenersByLastName(searchTerm: $searchTerm) {
      _id
      first_name
      last_name
      email
      subscription_tier
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
      numOfFavoriteAlbums
    }
  }
`;

const EDIT_LISTENER = gql`
  mutation EditListener(
    $_id: String!
    $first_name: String
    $last_name: String
    $email: String
    $date_of_birth: String
    $subscription_tier: String
  ) {
    editListener(
      _id: $_id
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
      numOfFavoriteAlbums
    }
  }
`;

const DELETE_LISTENER = gql`
  mutation DeleteListener($_id: String!) {
    removeListener(_id: $_id) {
      _id
      first_name
      last_name
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
      release_date
      promo_start
      promo_end
      numOfListenersWhoFavorited
      artist {
        _id
        stage_name
      }
    }
  }
`;

const GET_ALBUM_BY_ID = gql`
  query GetAlbumById($_id: String!) {
    getAlbumById(_id: $_id) {
      _id
      title
      genre
      track_count
      release_date
      promo_start
      promo_end
      numOfListenersWhoFavorited
      artist {
        _id
        stage_name
        label
      }
      listenersWhoFavorited {
        _id
        first_name
        last_name
        subscription_tier
      }
    }
  }
`;

const GET_LISTENERS_BY_ALBUM_ID = gql`
  query GetListenersByAlbumId($albumId: String!) {
    getListenersByAlbumId(albumId: $albumId) {
      _id
      first_name
      last_name
      email
      subscription_tier
    }
  }
`;

const GET_ALBUMS_BY_GENRE = gql`
  query GetAlbumsByGenre($genre: String!) {
    getAlbumsByGenre(genre: $genre) {
      _id
      title
      genre
      track_count
      release_date
      artist {
        _id
        stage_name
      }
    }
  }
`;

const GET_ALBUMS_BY_PROMO_DATE_RANGE = gql`
  query GetAlbumsByPromoDateRange($start: String!, $end: String!) {
    getAlbumsByPromoDateRange(start: $start, end: $end) {
      _id
      title
      genre
      release_date
      promo_start
      promo_end
      artist {
        _id
        stage_name
      }
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
      release_date
      promo_start
      promo_end
      numOfListenersWhoFavorited
      artist {
        _id
        stage_name
      }
    }
  }
`;

const EDIT_ALBUM = gql`
  mutation EditAlbum(
    $_id: String!
    $title: String
    $genre: String
    $track_count: Int
    $artist: String
    $release_date: String
    $promo_start: String
    $promo_end: String
  ) {
    editAlbum(
      _id: $_id
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
      release_date
      promo_start
      promo_end
      numOfListenersWhoFavorited
      artist {
        _id
        stage_name
      }
    }
  }
`;

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($_id: String!) {
    removeAlbum(_id: $_id) {
      _id
      title
    }
  }
`;

const UPDATE_ALBUM_ARTIST = gql`
  mutation UpdateAlbumArtist($albumId: String!, $artistId: String!) {
    updateAlbumArtist(albumId: $albumId, artistId: $artistId) {
      _id
      title
      artist {
        _id
        stage_name
      }
    }
  }
`;

const FAVORITE_ALBUM = gql`
  mutation FavoriteAlbum($listenerId: String!, $albumId: String!) {
    favoriteAlbum(listenerId: $listenerId, albumId: $albumId) {
      _id
      first_name
      last_name
      numOfFavoriteAlbums
      favorite_albums {
        _id
        title
      }
    }
  }
`;

const UNFAVORITE_ALBUM = gql`
  mutation UnfavoriteAlbum($listenerId: String!, $albumId: String!) {
    unfavoriteAlbum(listenerId: $listenerId, albumId: $albumId) {
      _id
      first_name
      last_name
      numOfFavoriteAlbums
      favorite_albums {
        _id
        title
      }
    }
  }
`;

const queries = {
  GET_ARTISTS,
  GET_ARTIST_BY_ID,
  GET_ALBUMS_BY_ARTIST_ID,
  GET_ARTISTS_BY_LABEL,
  GET_ARTISTS_SIGNED_BETWEEN,
  ADD_ARTIST,
  EDIT_ARTIST,
  DELETE_ARTIST,
  GET_LISTENERS,
  GET_LISTENER_BY_ID,
  GET_LISTENERS_BY_SUBSCRIPTION,
  SEARCH_LISTENERS_BY_LAST_NAME,
  ADD_LISTENER,
  EDIT_LISTENER,
  DELETE_LISTENER,
  GET_ALBUMS,
  GET_ALBUM_BY_ID,
  GET_LISTENERS_BY_ALBUM_ID,
  GET_ALBUMS_BY_GENRE,
  GET_ALBUMS_BY_PROMO_DATE_RANGE,
  ADD_ALBUM,
  EDIT_ALBUM,
  DELETE_ALBUM,
  UPDATE_ALBUM_ARTIST,
  FAVORITE_ALBUM,
  UNFAVORITE_ALBUM,
};

export default queries;
