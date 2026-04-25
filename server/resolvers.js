import { GraphQLError } from "graphql";
import methods from "./helpers.js";
import {
  artists as artistsCollection,
  albums as albumsCollection,
  listeners as listenersCollection,
} from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";

/***
 * 
 * NEED TO FIX 
 * -1 addListener: should trim string input;
 *  X Handled in errorCheckString helper method returns trim string.
 * 
 * -1 addArtist: should trim string input
 *  X Handled in errorCheckString helper method returns trim string.
 * 
 * -1 editArtist: should fail if no fields provided or invalid formats
 *  X Handled in editArtist resolver - checks if all fields are undefined and throws error, also uses helper methods to validate formats.
 * 
 * -2 addAlbum: should fail if artist does not exist;
 * -2 addAlbum: errors out on track count with valid range;
 * 
 * 
 * -2 favoriteAlbum/unfavoriteAlbum: should fail if either ID is invalid/non-existent;
 * -3 using uuidv4 instead of MongoDB's ObjectId for IDs;
 *  X removed to use MongoDB's ObjectId which is auto generated on insert, updated
 * 
 * -4 getAlbumsByArtistId: errors out/fails many test cases;
 * -4 getListenersByAlbumId: errors out/fails many test cases;
 * 
 * -4 getAlbumsByGenre: errors out/fails many test cases;
 * -4 getArtistsByLabel: errors out/fails many test cases;
 * -4 getListenersBySubscription: errors out/fails many test cases;
 * -4 getArtistsSignedBetween: errors out/fails many test cases;
 * -4 getAlbumsByPromoDateRange: errors out/fails many test cases;
 * 
 * 
 * 
 */


export const resolvers = {
  //Queries********************************************************************
  Query: {
    artists: async () => {
      const artists_collection = await artistsCollection();
      const all_artists = await artists_collection.find({}).toArray();
      if (!all_artists) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "ARTIST_NOT_FOUND" },
        });
      }
      return all_artists;
    },

    listeners: async () => {
      const listeners_collection = await listenersCollection();
      const all_listeners = await listeners_collection.find({}).toArray();
      if (!all_listeners) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return all_listeners;
    },

    albums: async () => {
      const albums_collection = await albumsCollection();
      const all_albums = await albums_collection.find({}).toArray();
      if (!all_albums) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "ALBUM_NOT_FOUND" },
        });
      }
      return all_albums;
    },

    getArtistById: async (_, args) => {
      let newID = methods.errorCheckString(args._id);
      const artists_collection = await artistsCollection();
      const artists = await artists_collection.findOne({ _id: new ObjectId(newID) });
      if (!artists) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "ARTIST_NOT_FOUND" },
        });
      }
      return artists;
    },

    getListenerById: async (_, args) => {
      let newID = methods.errorCheckString(args._id);
      const listeners_collection = await listenersCollection();
      const listener = await listeners_collection.findOne({ _id: new ObjectId(newID) });
      if (!listener) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "LISTENER_NOT_FOUND" },
        });
      }
      return listener;
    },

    getAlbumById: async (_, args) => {
      const newID = methods.errorCheckString(args._id);
      const albums_collection = await albumsCollection();
      const albums = await albums_collection.findOne({ _id: new ObjectId(newID) });
      if (!albums) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "ALBUM_NOT_FOUND" },
        });
      }
      return albums;
    },
    //FIXED REF FOR OTHERS
    getAlbumsByArtistId: async (_, args) => {
      const newID = methods.errorCheckString(args.artistId);
      const albums_collection = await albumsCollection();
      const albums = await albums_collection.find({ artist: newID }).toArray();
      if (!albums) {
        throw new GraphQLError("Albums not found", {
          extensions: { code: "ALBUMS_NOT_FOUND" },
        });
      }
      return albums;
    },

    getListenersByAlbumId: async (_, args) => {
      const newID = methods.errorCheckString(args.albumId);

      const listeners_collection = await listenersCollection();
      const album_collection = await albumsCollection();
      const album = await album_collection.findOne({ _id: new ObjectId(newID) });

      if (!album) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "ALBUM_NOT_FOUND" },
        });
      }

      return album.listenersWhoFavorited;
    },

    getAlbumsByGenre: async (_, args) => {
      let newGenre = methods.errorCheckString(args.genre);
      newGenre = newGenre.toLowerCase();
      const albums_collection = await albumsCollection();
      const albums = await albums_collection
        .find({ genre: newGenre })
        .toArray();

      if (!albums || albums.length === 0) {
        throw new GraphQLError("No albums found for the specified genre", {
          extensions: { code: "ALBUMS_NOT_FOUND" },
        });
      }

      return albums;
    },

    getArtistsByLabel: async (_, args) => {
      let newLabel = methods.errorCheckString(args.label);
      newLabel = newLabel.toLowerCase();
      const artists_collection = await artistsCollection();
      const artists = await artists_collection
        .find({ label: newLabel })
        .toArray();

      if (!artists || artists.length === 0) {
        throw new GraphQLError("No artists found for the specified label", {
          extensions: { code: "ARTISTS_NOT_FOUND" },
        });
      }

      return artists;
    },

    getListenersBySubscription: async (_, args) => {
      let newTier = methods.errorCheckString(args.tier);
      newTier = newTier.toUpperCase();
      if (newTier !== "FREE" && newTier !== "PREMIUM") {
        throw new GraphQLError("Invalid subscription tier: must be FREE or PREMIUM", {
          extensions: { code: "INVALID_SUBSCRIPTION_TIER" },
        });
      }
      const listeners_collection = await listenersCollection();
      const listeners = await listeners_collection
        .find({ subscription_tier: newTier })
        .toArray();

      if (!listeners || listeners.length === 0) {
        throw new GraphQLError(
          "No listeners found for the specified subscription tier",
          {
            extensions: { code: "LISTENERS_NOT_FOUND" },
          },
        );
      }

      return listeners;
    },
    getArtistsSignedBetween: async (_, args) => {
      const start = methods.errorCheckDates(args.start);
      const end = methods.errorCheckDates(args.end);
      methods.errorCheckDateRange(start, end);
      const startDate = new Date(start);
      const endDate = new Date(end);
      const artists_collection = await artistsCollection();
      const allArtists = await artists_collection.find({}).toArray();
      const artists = allArtists.filter((a) => {
        const signed = new Date(a.date_signed);
        return signed >= startDate && signed <= endDate;
      });

      if (!artists || artists.length === 0) {
        throw new GraphQLError(
          "No artists found signed between the specified dates",
          {
            extensions: { code: "ARTISTS_NOT_FOUND" },
          },
        );
      }

      return artists;
    },
    getAlbumsByPromoDateRange: async (_, args) => {
      const start = methods.errorCheckDates(args.start);
      const end = methods.errorCheckDates(args.end);
      methods.errorCheckDateRange(start, end);
      const startDate = new Date(start);
      const endDate = new Date(end);

      const albums_collection = await albumsCollection();
      const allAlbums = await albums_collection.find({}).toArray();
      const albums = allAlbums.filter((a) => {
        const promoStart = new Date(a.promo_start);
        const promoEnd = new Date(a.promo_end);
        return promoStart >= startDate && promoEnd <= endDate;
      });

      if (!albums || albums.length === 0) {
        throw new GraphQLError(
          "No albums found for the specified promo date range",
          {
            extensions: { code: "ALBUMS_NOT_FOUND" },
          },
        );
      }

      return albums;
    },

    searchListenersByLastName: async (_, args) => {
      args.searchTerm = methods.errorCheckString(args.searchTerm);

      const listeners_collection = await listenersCollection();
      //Returns listeners whose last name contains the searchTerm (case-insensitive).
      const listeners = await listeners_collection
        .find({
          last_name: { $regex: args.searchTerm, $options: "i" },
        })
        .toArray();

      if (!listeners || listeners.length === 0) {
        throw new GraphQLError(
          "No listeners found with the specified last name",
          {
            extensions: { code: "LISTENERS_NOT_FOUND" },
          },
        );
      }

      return listeners;
    },
  },

  //Type Resolvers********************************************************************

  Artist: {
    albums: async (parentValue) => {
      const albums_collection = await albumsCollection();
      return await albums_collection
        .find({ artist: parentValue._id })
        .toArray();
    },

    numOfAlbums: async (parentValue) => {
      //console.log("parentValue:");
      // console.log(parentValue);
      const albums_collection = await albumsCollection();
      let numOfAlbums = await albums_collection.countDocuments({
        artist: parentValue._id,
      });

      return numOfAlbums;
    },
  },

  Listener: {
    favorite_albums: async (parentValue) => {
      const albums_collection = await albumsCollection();
      if (!parentValue.favorite_albums || parentValue.favorite_albums.length === 0) {
        return [];
      }

      return await albums_collection
        .find({ _id: { $in: parentValue.favorite_albums }})
        .toArray();
    },
    numOfFavoriteAlbums: async (parentValue) => {
      if (!parentValue.favorite_albums || parentValue.favorite_albums.length === 0) {
       return 0;
      }
      const listeners_collection = await listenersCollection();
      const listener = await listeners_collection.findOne({ _id: parentValue._id });
      if (!listener) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "LISTENER_NOT_FOUND" },
        });
      }

      return listener.favorite_albums.length;
    },
  },

  Album: {
    artist: async (parentValue) => {
      const artists_collection = await artistsCollection();
      return await artists_collection.findOne({ _id: parentValue.artist });
    },

    listenersWhoFavorited: async (parentValue) => {
      const listeners_collection = await listenersCollection();
      return await listeners_collection
        .find({ favorite_albums: parentValue._id })
        .toArray();
    },

     numOfListenersWhoFavorited: async (parentValue) => {
      const listeners_collection = await listenersCollection();
      return await listeners_collection.countDocuments({
        favorite_albums: parentValue._id.toString(),
      });
    },
  },

  // Mutations********************************************************************
  Mutation: {
    addArtist: async (_, args) => {
      let {
        stage_name,
        genre,
        label,
        management_email,
        management_phone,
        home_city,
        date_signed,
      } = args;
      stage_name = methods.errorCheckString(stage_name);
      genre = methods.errorCheckString(genre);
      label = methods.errorCheckString(label);
      management_email = methods.errorCheckEmail(management_email);
      management_phone = methods.errorCheckPhoneNumber(management_phone);
      home_city = methods.errorCheckString(home_city);
      date_signed = methods.errorCheckDates(date_signed);

      let newArtist = {

        stage_name: stage_name,
        genre: genre,
        label: label,
        management_email: management_email,
        management_phone: management_phone,
        home_city: home_city,
        date_signed: date_signed,
      };

      const artists_collection = await artistsCollection();
      const insertInfo = await artists_collection.insertOne(newArtist);

      if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw new GraphQLError("ERROR: Could Not Add Artist", {
          extensions: { code: "ARTIST_NOT_ADDED" },
        });

      let newArtistPost = await artists_collection.findOne({ _id: insertInfo.insertedId });

      return newArtistPost;
    },
    editArtist: async (_, args) => {
      let {
        _id,
        stage_name,
        genre,
        label,
        management_email,
        management_phone,
        home_city,
        date_signed,
      } = args;

      _id = methods.errorCheckString(_id);

      if (
        stage_name === undefined &&
        genre === undefined &&
        label === undefined &&
        management_email === undefined &&
        management_phone === undefined &&
        home_city === undefined &&
        date_signed === undefined
      ) {
        throw new GraphQLError(
          "Must provide at least one field to update",
          { extensions: { code: "NO_UPDATE_FIELDS_PROVIDED" } }
        );
      }

      if (stage_name !== undefined) {
        stage_name = methods.errorCheckString(stage_name);
      }

      if (genre !== undefined) {
        genre = methods.errorCheckString(genre);
      }

      if (label !== undefined) {
        label = methods.errorCheckString(label);
      }

      if (management_email !== undefined) {
        management_email = methods.errorCheckEmail(management_email);
      }

      if (management_phone !== undefined) {
        management_phone = methods.errorCheckPhoneNumber(management_phone);
      }

      if (home_city !== undefined) {
        home_city = methods.errorCheckString(home_city);
      }

      if (date_signed !== undefined) {
        date_signed = methods.errorCheckDates(date_signed);
      }
  const artists_collection = await artistsCollection();
      let old_artist = await artists_collection.findOne({ _id: new ObjectId(_id) });

      if (!old_artist) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "ARTIST_NOT_FOUND" },
        });
      }

      //update fields
      old_artist.stage_name = stage_name !== undefined ? stage_name : old_artist.stage_name;
      old_artist.genre = genre !== undefined ? genre : old_artist.genre;
      old_artist.label = label !== undefined ? label : old_artist.label;
      old_artist.management_email = management_email !== undefined ? management_email : old_artist.management_email;
      old_artist.management_phone = management_phone !== undefined ? management_phone : old_artist.management_phone;
      old_artist.home_city = home_city !== undefined ? home_city : old_artist.home_city;
      old_artist.date_signed = date_signed !== undefined ? date_signed : old_artist.date_signed;

    

      const updatedInfo = await artists_collection.findOneAndReplace(
        { _id:  new ObjectId(_id) },
        old_artist,
        { returnDocument: "after" },
      );

      if (!updatedInfo)
        throw new GraphQLError("ERROR: Could Not Update Artist", {
          extensions: { code: "ARTIST_NOT_UPDATED" },
        });

      return updatedInfo;
    },
    removeArtist: async (_, args) => {
      let newID = methods.errorCheckString(args._id);
      // # Deletes an artist from MongoDB.
      const artists_collection = await artistsCollection();
      const albums_collection = await albumsCollection();

      const artist = await artists_collection.findOne({ _id: new ObjectId(newID) });

      const artistToDelete = await artists_collection.findOneAndDelete({
        _id: new ObjectId(newID),
      });

      if (!artistToDelete) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "ARTIST_NOT_FOUND" },
        });
      }
      //# Must also set the artist field of all their albums to null.

      await albums_collection.updateMany(
        { artist: args._id },
        { $set: { artist: null } },
      );

      return artistToDelete;
    },

    addListener: async (_, args) => {
      let first_name = methods.errorCheckString(args.first_name);
      let last_name = methods.errorCheckString(args.last_name);
      let email = methods.errorCheckEmail(args.email);
      let date_of_birth = methods.errorCheckDates(args.date_of_birth);
      let subscription_tier = methods.errorCheckString(args.subscription_tier);
      subscription_tier = subscription_tier.toUpperCase();
      //A listener must be a reasonable age (use min 13, max 120).

      const currentYear = new Date().getFullYear();
      const birthYear = new Date(date_of_birth).getFullYear();
      const age = currentYear - birthYear;

      if (age < 13 || age > 120) {
        throw new GraphQLError(
          "Invalid date_of_birth: Listener must be between 13 and 120 years old.",
          {
            extensions: { code: "INVALID_DATE_OF_BIRTH" },
          },
        );
      }

      
      const validTiers = ["FREE", "PREMIUM"];

      if (!validTiers.includes(subscription_tier)) {
        throw new GraphQLError(
          "Invalid subscription_tier: Must be either 'FREE' or 'PREMIUM'",
          {
            extensions: { code: "INVALID_SUBSCRIPTION_TIER" },
          },
        );
      }

      const listeners_collection = await listenersCollection();

      let newListener = {
    
        first_name: first_name,
        last_name: last_name,
        email: email,
        date_of_birth: date_of_birth,
        subscription_tier: subscription_tier,
      };

      const insertInfo = await listeners_collection.insertOne(newListener);

      if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw new GraphQLError("ERROR: Could Not Add Listener", {
          extensions: { code: "LISTENER_NOT_ADDED" },
        });

        let new_Listener = await listeners_collection.findOne({ _id: insertInfo.insertedId });
        
      return new_Listener;
    },
    editListener: async (_, args) => {
      let {
        _id,
        first_name,
        last_name,
        email,
        date_of_birth,
        subscription_tier,
      } = args;



      _id = methods.errorCheckString(_id);

      if (first_name !== undefined) {

      first_name = methods.errorCheckString(first_name);
      }

      if (last_name !== undefined) {

      last_name = methods.errorCheckString(last_name);
      }
      
      if (email !== undefined) {

      email = methods.errorCheckEmail(email);
      }
      
      if (date_of_birth !== undefined) {
        date_of_birth = methods.errorCheckDates(date_of_birth);
      }

      //A listener must be a reasonable age (use min 13, max 120).

      const currentYear = new Date().getFullYear();
      const birthYear = new Date(date_of_birth).getFullYear();
      const age = currentYear - birthYear;

      if (age < 13 || age > 120) {
        throw new GraphQLError(
          "Invalid date_of_birth: Listener must be between 13 and 120 years old.",
          {
            extensions: { code: "INVALID_DATE_OF_BIRTH" },
          },
        );
      }

      if (subscription_tier !== undefined) {
        subscription_tier = methods.errorCheckString(subscription_tier).toUpperCase();
        const validTiers = ["FREE", "PREMIUM"];

        if (!validTiers.includes(subscription_tier)) {
          throw new GraphQLError(
            "Invalid subscription_tier: Must be either 'FREE' or 'PREMIUM'",
            {
              extensions: { code: "INVALID_SUBSCRIPTION_TIER" },
            },
          );
        }
      }

      //TODO MC - need to validate if id and another fiels is 
      
      const listeners_collection = await listenersCollection();


      let old_listener = await listeners_collection.findOne({ _id: new ObjectId(_id) });

      if (!old_listener) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "LISTENER_NOT_FOUND" },
        });
      }

      // Update fields
      old_listener.first_name = first_name !== undefined ? first_name : old_listener.first_name;
      old_listener.last_name = last_name !== undefined ? last_name : old_listener.last_name;
      old_listener.email = email !== undefined ? email : old_listener.email;
      old_listener.date_of_birth = date_of_birth !== undefined ? date_of_birth : old_listener.date_of_birth;
      old_listener.subscription_tier = subscription_tier !== undefined ? subscription_tier : old_listener.subscription_tier;

    

      const updatedInfo = await listeners_collection.findOneAndReplace(
        { _id: new ObjectId(_id) },
        old_listener,
        { returnDocument: "after" },
      );

      if (!updatedInfo)
        throw new GraphQLError("ERROR: Could Not Update Listener");

      return updatedInfo;
    },
    removeListener: async (_, args) => {
      let newID = methods.errorCheckString(args._id);
      const listeners_collection = await listenersCollection();
      const listenerToDelete = await listeners_collection.findOneAndDelete({
        _id: new ObjectId(newID),
      });

      if (!listenerToDelete) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "LISTENER_NOT_FOUND" },
        });
      }

      return listenerToDelete;
    },
    addAlbum: async (
      _,
     args,
    ) => {
      let {
        title,
        genre,
        track_count,
        artist,
        release_date,
        promo_start,
        promo_end,
      } = args;

      title = methods.errorCheckString(title);
      genre = methods.errorCheckString(genre);
      //todo need to FIX: always validate track_count (don't guard with undefined check for required field)

      track_count = methods.errorCheckTrackCount(track_count);
      artist = methods.errorCheckString(artist);
      release_date = methods.errorCheckDates(release_date);
      promo_start = methods.errorCheckDates(promo_start);
      promo_end = methods.errorCheckDates(promo_end);
      

      if (promo_start >= promo_end) {
        throw new GraphQLError(
          "Invalid promo date range: start date must be before end date",
          {
            extensions: { code: "INVALID_PROMO_DATE_RANGE" },
          },
        );
      }

      const artists_collection = await artistsCollection();
      const artist_doc = await artists_collection.findOne({ _id: new ObjectId(artist) });
      
      if (!artist_doc) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "ARTIST_NOT_FOUND" },
        });
      }
      
      let newAlbum = {
        //mongo auto generates _id, so we don't need to create it ourselves 
        //_id: new ObjectId().toString(),
        title,
        genre,
        track_count,
        artist,
        release_date,
        promo_start,
        promo_end,
      };

  
      
      const albums_collection = await albumsCollection();


      const insertInfo = await albums_collection.insertOne(newAlbum);

      if (!insertInfo.acknowledged || !insertInfo.insertedId) 
        throw new GraphQLError("ERROR: Could Not Add Album", {
          extensions: { code: "ALBUM_NOT_ADDED" },
        });      

        return await albums_collection.findOne({ _id: insertInfo.insertedId });
    },
    editAlbum: async (
      _,
      args,
    ) => {

        let {
          _id,
          title,
          genre,
          track_count,
          artist,
          release_date,
          promo_start,
          promo_end
        } = args;
      if(_id !== undefined){

      _id = methods.errorCheckString(_id);
      }
       if(title !== undefined){
       title = methods.errorCheckString(title);
      }

      if(genre !== undefined){
        genre = methods.errorCheckString(genre);
      }
      if(track_count !== undefined){
      track_count = methods.errorCheckTrackCount(track_count);
      }
      
      if(artist !== undefined){

      artist = methods.errorCheckString(artist);
      }
      if(release_date !== undefined){

      release_date = methods.errorCheckDates(release_date);
      }
      if(promo_start !== undefined){

      promo_start = methods.errorCheckDates(promo_start);
      }
      if(promo_end !== undefined){
      promo_end = methods.errorCheckDates(promo_end);
      }

      if (promo_start !== undefined && promo_end !== undefined && promo_start >= promo_end) {
        throw new GraphQLError(
          "Invalid promo date range: start date must be before end date",
          {
            extensions: { code: "INVALID_PROMO_DATE_RANGE" },
          },
        );
      }
      const albums_collection = await albumsCollection();
      let old_album = await albums_collection.findOne({ _id: new ObjectId(_id) });

      if (!old_album) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "ALBUM_NOT_FOUND" },
        });
      }

      old_album.title = title !== undefined ? title : old_album.title;
      old_album.genre = genre !== undefined ? genre : old_album.genre;
      old_album.track_count = track_count !== undefined ? track_count : old_album.track_count;
      old_album.artist = artist !== undefined ? artist : old_album.artist;
      old_album.release_date = release_date !== undefined ? release_date : old_album.release_date;
      old_album.promo_start = promo_start !== undefined ? promo_start : old_album.promo_start;
      old_album.promo_end = promo_end !== undefined ? promo_end : old_album.promo_end;

      const updatedInfo = await albums_collection.findOneAndReplace(
        { _id: new ObjectId(_id) },
        old_album,
        { returnDocument: "after" },
      );

      if (!updatedInfo) 
        {
        throw new GraphQLError("ERROR: Could Not Update Album");
      }
      return updatedInfo;
    },
    removeAlbum: async (_, args) => {
      let newID = methods.errorCheckString(args._id);
      const albums_collection = await albumsCollection();
      const albumToDelete = await albums_collection.findOneAndDelete({
        _id: new ObjectId(newID),
      });

      if (!albumToDelete) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "ALBUM_NOT_FOUND" },
        });
      }

      //Must also remove this album’s ID from all listeners’ favorite_albums arrays
      const listeners_collection = await listenersCollection();
      await listeners_collection.updateMany(
        { favorite_albums: newID },
        { $pull: { favorite_albums: newID } },
      );

      return albumToDelete;
    },
    updateAlbumArtist: async (_, args) => {
      let newAlbumId = methods.errorCheckString(args.albumId);
      let newArtistId = methods.errorCheckString(args.artistId);
      const albums_collection = await albumsCollection();
      const artists_collection = await artistsCollection();

      let album = await albums_collection.findOne({ _id: new ObjectId(newAlbumId) });
      let artist = await artists_collection.findOne({ _id: new ObjectId(newArtistId) });

      if (!album) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "ALBUM_NOT_FOUND" },
        });
      }
      if (!artist) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "ARTIST_NOT_FOUND" },
        });
      }
      album.artist = artist._id;

      

      const updatedInfo = await albums_collection.findOneAndReplace(
        { _id: new ObjectId(album._id) },
        album,
        { returnDocument: "after" },
      );

      if (!updatedInfo)
        throw new GraphQLError("ERROR: Could Not Update Album", {
          extensions: { code: "ALBUM_NOT_UPDATED" },
        });
      return updatedInfo;
    },
    favoriteAlbum: async (_, args) => {
      let newListenerId = methods.errorCheckString(args.listenerId);
      let newAlbumId = methods.errorCheckString(args.albumId);

      const listeners_collection = await listenersCollection();
      const albums_collection = await albumsCollection();

      let listener = await listeners_collection.findOne({ _id: newListenerId });
      const album = await albums_collection.findOne({ _id: newAlbumId });

      if (!listener) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "LISTENER_NOT_FOUND" },
        });
      }
      if (!album) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "ALBUM_NOT_FOUND" },
        });
      }

 const updatedListener = await listeners_collection.findOneAndUpdate(
    { _id: new ObjectId(newListenerId) },
    { $addToSet: { favorite_albums: newAlbumId } }, 
    { returnDocument: "after" }
  );

  return updatedListener;
    },
    unfavoriteAlbum: async (_, args) => {
      let newListenerId = methods.errorCheckString(args.listenerId);
      let newAlbumId = methods.errorCheckString(args.albumId);

      const listeners_collection = await listenersCollection();

      let listener = await listeners_collection.findOne({ _id: new ObjectId(newListenerId) });
      const album = await albums_collection.findOne({ _id: new ObjectId(newAlbumId) });

      if (!listener) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "LISTENER_NOT_FOUND" },
        });
      }

      if (!album) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "ALBUM_NOT_FOUND" },
        });
      }

      const updatedListener = await listeners_collection.findOneAndUpdate(
    { _id: new ObjectId(newListenerId) },
    { $pull: { favorite_albums: new ObjectId(newAlbumId) } },
    { returnDocument: "after" }
  );

  return updatedListener;
    },
  },
};
