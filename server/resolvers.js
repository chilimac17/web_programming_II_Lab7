import { GraphQLError } from "graphql";
import methods from "./helpers.js";
import {
  artists as artistsCollection,
  albums as albumsCollection,
  listeners as listenersCollection,
} from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";

const toIdString = (val) => {
  if (val === null || val === undefined) return null;
  if (val instanceof ObjectId) return val.toString();
  return String(val);
};

export const resolvers = {
  Query: {
    artists: async () => {
      const collection = await artistsCollection();
      return await collection.find({}).toArray();
    },

    listeners: async () => {
      const collection = await listenersCollection();
      return await collection.find({}).toArray();
    },

    albums: async () => {
      const collection = await albumsCollection();
      return await collection.find({}).toArray();
    },

    getArtistById: async (_, args) => {
      const id = methods.errorCheckId(args._id, "_id");
      const collection = await artistsCollection();
      const artist = await collection.findOne({ _id: new ObjectId(id) });
      if (!artist) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return artist;
    },

    getListenerById: async (_, args) => {
      const id = methods.errorCheckId(args._id, "_id");
      const collection = await listenersCollection();
      const listener = await collection.findOne({ _id: new ObjectId(id) });
      if (!listener) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return listener;
    },

    getAlbumById: async (_, args) => {
      const id = methods.errorCheckId(args._id, "_id");
      const collection = await albumsCollection();
      const album = await collection.findOne({ _id: new ObjectId(id) });
      if (!album) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return album;
    },

    getAlbumsByArtistId: async (_, args) => {
      const id = methods.errorCheckId(args.artistId, "artistId");
      const artistsCol = await artistsCollection();
      const artist = await artistsCol.findOne({ _id: new ObjectId(id) });
      if (!artist) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      const albumsCol = await albumsCollection();
      return await albumsCol.find({ artist: new ObjectId(id) }).toArray();
    },

    getListenersByAlbumId: async (_, args) => {
      const id = methods.errorCheckId(args.albumId, "albumId");
      const albumsCol = await albumsCollection();
      const album = await albumsCol.findOne({ _id: new ObjectId(id) });
      if (!album) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      const listenersCol = await listenersCollection();
      return await listenersCol
        .find({ favorite_albums: new ObjectId(id) })
        .toArray();
    },

    getAlbumsByGenre: async (_, args) => {
      const genre = methods.errorCheckString(args.genre, "genre");
      const collection = await albumsCollection();
      return await collection
        .find({ genre: { $regex: `^${escapeRegex(genre)}$`, $options: "i" } })
        .toArray();
    },

    getArtistsByLabel: async (_, args) => {
      const label = methods.errorCheckString(args.label, "label");
      const collection = await artistsCollection();
      return await collection
        .find({ label: { $regex: `^${escapeRegex(label)}$`, $options: "i" } })
        .toArray();
    },

    getListenersBySubscription: async (_, args) => {
      const tier = methods.errorCheckSubscriptionTier(args.tier);
      const collection = await listenersCollection();
      return await collection.find({ subscription_tier: tier }).toArray();
    },

    getArtistsSignedBetween: async (_, args) => {
      const { start, end } = methods.errorCheckDateRange(args.start, args.end);
      const startDate = methods.dateFromMDY(start);
      const endDate = methods.dateFromMDY(end);
      const collection = await artistsCollection();
      const all = await collection.find({}).toArray();
      return all.filter((a) => {
        if (!a.date_signed) return false;
        const signed = methods.dateFromMDY(a.date_signed);
        return signed >= startDate && signed <= endDate;
      });
    },

    getAlbumsByPromoDateRange: async (_, args) => {
      const { start, end } = methods.errorCheckDateRange(args.start, args.end);
      const startDate = methods.dateFromMDY(start);
      const endDate = methods.dateFromMDY(end);
      const collection = await albumsCollection();
      const all = await collection.find({}).toArray();
      return all.filter((a) => {
        if (!a.promo_start || !a.promo_end) return false;
        const ps = methods.dateFromMDY(a.promo_start);
        const pe = methods.dateFromMDY(a.promo_end);
        return ps >= startDate && pe <= endDate;
      });
    },

    searchListenersByLastName: async (_, args) => {
      const term = methods.errorCheckString(args.searchTerm, "searchTerm");
      const collection = await listenersCollection();
      return await collection
        .find({ last_name: { $regex: escapeRegex(term), $options: "i" } })
        .toArray();
    },
  },

  Artist: {
    _id: (parent) => toIdString(parent._id),
    albums: async (parent) => {
      const collection = await albumsCollection();
      return await collection
        .find({ artist: new ObjectId(toIdString(parent._id)) })
        .toArray();
    },
    numOfAlbums: async (parent) => {
      const collection = await albumsCollection();
      return await collection.countDocuments({
        artist: new ObjectId(toIdString(parent._id)),
      });
    },
  },

  Listener: {
    _id: (parent) => toIdString(parent._id),
    favorite_albums: async (parent) => {
      if (!parent.favorite_albums || parent.favorite_albums.length === 0) {
        return [];
      }
      const ids = parent.favorite_albums.map((id) => new ObjectId(toIdString(id)));
      const collection = await albumsCollection();
      return await collection.find({ _id: { $in: ids } }).toArray();
    },
    numOfFavoriteAlbums: (parent) => {
      if (!parent.favorite_albums) return 0;
      return parent.favorite_albums.length;
    },
  },

  Album: {
    _id: (parent) => toIdString(parent._id),
    artist: async (parent) => {
      if (!parent.artist) return null;
      const collection = await artistsCollection();
      return await collection.findOne({
        _id: new ObjectId(toIdString(parent.artist)),
      });
    },
    listenersWhoFavorited: async (parent) => {
      const collection = await listenersCollection();
      return await collection
        .find({ favorite_albums: new ObjectId(toIdString(parent._id)) })
        .toArray();
    },
    numOfListenersWhoFavorited: async (parent) => {
      const collection = await listenersCollection();
      return await collection.countDocuments({
        favorite_albums: new ObjectId(toIdString(parent._id)),
      });
    },
  },

  Mutation: {
    addArtist: async (_, args) => {
      const newArtist = {
        stage_name: methods.errorCheckString(args.stage_name, "stage_name"),
        genre: methods.errorCheckString(args.genre, "genre"),
        label: methods.errorCheckString(args.label, "label"),
        management_email: methods.errorCheckEmail(args.management_email),
        management_phone: methods.errorCheckPhoneNumber(args.management_phone),
        home_city: methods.errorCheckString(args.home_city, "home_city"),
        date_signed: methods.errorCheckDateSigned(args.date_signed),
      };

      const collection = await artistsCollection();
      const insertInfo = await collection.insertOne(newArtist);
      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw new GraphQLError("ERROR: Could not add artist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return await collection.findOne({ _id: insertInfo.insertedId });
    },

    editArtist: async (_, args) => {
      const id = methods.errorCheckId(args._id, "_id");
      const updates = {};

      const fields = [
        "stage_name",
        "genre",
        "label",
        "management_email",
        "management_phone",
        "home_city",
        "date_signed",
      ];
      const provided = fields.filter((f) => args[f] !== undefined);
      if (provided.length === 0) {
        throw new GraphQLError(
          "Must provide at least one field besides _id to update",
          { extensions: { code: "BAD_USER_INPUT" } }
        );
      }

      if (args.stage_name !== undefined)
        updates.stage_name = methods.errorCheckString(args.stage_name, "stage_name");
      if (args.genre !== undefined)
        updates.genre = methods.errorCheckString(args.genre, "genre");
      if (args.label !== undefined)
        updates.label = methods.errorCheckString(args.label, "label");
      if (args.management_email !== undefined)
        updates.management_email = methods.errorCheckEmail(args.management_email);
      if (args.management_phone !== undefined)
        updates.management_phone = methods.errorCheckPhoneNumber(args.management_phone);
      if (args.home_city !== undefined)
        updates.home_city = methods.errorCheckString(args.home_city, "home_city");
      if (args.date_signed !== undefined)
        updates.date_signed = methods.errorCheckDateSigned(args.date_signed);

      const collection = await artistsCollection();
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );
      if (!result) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return result;
    },

    removeArtist: async (_, args) => {
      const id = methods.errorCheckId(args._id, "_id");
      const artistsCol = await artistsCollection();
      const albumsCol = await albumsCollection();

      const removed = await artistsCol.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!removed) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      await albumsCol.updateMany(
        { artist: new ObjectId(id) },
        { $set: { artist: null } }
      );

      return removed;
    },

    addListener: async (_, args) => {
      const newListener = {
        first_name: methods.errorCheckString(args.first_name, "first_name"),
        last_name: methods.errorCheckString(args.last_name, "last_name"),
        email: methods.errorCheckEmail(args.email),
        date_of_birth: methods.errorCheckListenerAge(args.date_of_birth),
        subscription_tier: methods.errorCheckSubscriptionTier(args.subscription_tier),
        favorite_albums: [],
      };

      const collection = await listenersCollection();
      const insertInfo = await collection.insertOne(newListener);
      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw new GraphQLError("ERROR: Could not add listener", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return await collection.findOne({ _id: insertInfo.insertedId });
    },

    editListener: async (_, args) => {
      const id = methods.errorCheckId(args._id, "_id");
      const updates = {};

      const fields = [
        "first_name",
        "last_name",
        "email",
        "date_of_birth",
        "subscription_tier",
      ];
      const provided = fields.filter((f) => args[f] !== undefined);
      if (provided.length === 0) {
        throw new GraphQLError(
          "Must provide at least one field besides _id to update",
          { extensions: { code: "BAD_USER_INPUT" } }
        );
      }

      if (args.first_name !== undefined)
        updates.first_name = methods.errorCheckString(args.first_name, "first_name");
      if (args.last_name !== undefined)
        updates.last_name = methods.errorCheckString(args.last_name, "last_name");
      if (args.email !== undefined)
        updates.email = methods.errorCheckEmail(args.email);
      if (args.date_of_birth !== undefined)
        updates.date_of_birth = methods.errorCheckListenerAge(args.date_of_birth);
      if (args.subscription_tier !== undefined)
        updates.subscription_tier = methods.errorCheckSubscriptionTier(args.subscription_tier);

      const collection = await listenersCollection();
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );
      if (!result) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return result;
    },

    removeListener: async (_, args) => {
      const id = methods.errorCheckId(args._id, "_id");
      const collection = await listenersCollection();
      const removed = await collection.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!removed) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return removed;
    },

    addAlbum: async (_, args) => {
      const title = methods.errorCheckString(args.title, "title");
      const genre = methods.errorCheckString(args.genre, "genre");
      const track_count = methods.errorCheckTrackCount(args.track_count);
      const artistId = methods.errorCheckId(args.artist, "artist");
      const release_date = methods.errorCheckDates(args.release_date, "release_date");
      const promo_start = methods.errorCheckDates(args.promo_start, "promo_start");
      const promo_end = methods.errorCheckDates(args.promo_end, "promo_end");
      methods.errorCheckPromoOrder(release_date, promo_start, promo_end);

      const artistsCol = await artistsCollection();
      const artistDoc = await artistsCol.findOne({
        _id: new ObjectId(artistId),
      });
      if (!artistDoc) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const newAlbum = {
        title,
        genre,
        track_count,
        artist: new ObjectId(artistId),
        release_date,
        promo_start,
        promo_end,
      };

      const albumsCol = await albumsCollection();
      const insertInfo = await albumsCol.insertOne(newAlbum);
      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw new GraphQLError("ERROR: Could not add album", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return await albumsCol.findOne({ _id: insertInfo.insertedId });
    },

    editAlbum: async (_, args) => {
      const id = methods.errorCheckId(args._id, "_id");
      const updates = {};

      const fields = [
        "title",
        "genre",
        "track_count",
        "artist",
        "release_date",
        "promo_start",
        "promo_end",
      ];
      const provided = fields.filter((f) => args[f] !== undefined);
      if (provided.length === 0) {
        throw new GraphQLError(
          "Must provide at least one field besides _id to update",
          { extensions: { code: "BAD_USER_INPUT" } }
        );
      }

      if (args.title !== undefined)
        updates.title = methods.errorCheckString(args.title, "title");
      if (args.genre !== undefined)
        updates.genre = methods.errorCheckString(args.genre, "genre");
      if (args.track_count !== undefined)
        updates.track_count = methods.errorCheckTrackCount(args.track_count);
      if (args.release_date !== undefined)
        updates.release_date = methods.errorCheckDates(args.release_date, "release_date");
      if (args.promo_start !== undefined)
        updates.promo_start = methods.errorCheckDates(args.promo_start, "promo_start");
      if (args.promo_end !== undefined)
        updates.promo_end = methods.errorCheckDates(args.promo_end, "promo_end");

      const albumsCol = await albumsCollection();
      const existing = await albumsCol.findOne({ _id: new ObjectId(id) });
      if (!existing) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (args.artist !== undefined) {
        const artistId = methods.errorCheckId(args.artist, "artist");
        const artistsCol = await artistsCollection();
        const artistDoc = await artistsCol.findOne({
          _id: new ObjectId(artistId),
        });
        if (!artistDoc) {
          throw new GraphQLError("Artist not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        updates.artist = new ObjectId(artistId);
      }

      const finalRelease = updates.release_date ?? existing.release_date;
      const finalPromoStart = updates.promo_start ?? existing.promo_start;
      const finalPromoEnd = updates.promo_end ?? existing.promo_end;
      methods.errorCheckPromoOrder(finalRelease, finalPromoStart, finalPromoEnd);

      const result = await albumsCol.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );
      return result;
    },

    removeAlbum: async (_, args) => {
      const id = methods.errorCheckId(args._id, "_id");
      const albumsCol = await albumsCollection();
      const removed = await albumsCol.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!removed) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const listenersCol = await listenersCollection();
      await listenersCol.updateMany(
        { favorite_albums: new ObjectId(id) },
        { $pull: { favorite_albums: new ObjectId(id) } }
      );

      return removed;
    },

    updateAlbumArtist: async (_, args) => {
      const albumId = methods.errorCheckId(args.albumId, "albumId");
      const artistId = methods.errorCheckId(args.artistId, "artistId");

      const albumsCol = await albumsCollection();
      const artistsCol = await artistsCollection();

      const artist = await artistsCol.findOne({ _id: new ObjectId(artistId) });
      if (!artist) {
        throw new GraphQLError("Artist not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const result = await albumsCol.findOneAndUpdate(
        { _id: new ObjectId(albumId) },
        { $set: { artist: new ObjectId(artistId) } },
        { returnDocument: "after" }
      );
      if (!result) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return result;
    },

    favoriteAlbum: async (_, args) => {
      const listenerId = methods.errorCheckId(args.listenerId, "listenerId");
      const albumId = methods.errorCheckId(args.albumId, "albumId");

      const listenersCol = await listenersCollection();
      const albumsCol = await albumsCollection();

      const listener = await listenersCol.findOne({
        _id: new ObjectId(listenerId),
      });
      if (!listener) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      const album = await albumsCol.findOne({ _id: new ObjectId(albumId) });
      if (!album) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const result = await listenersCol.findOneAndUpdate(
        { _id: new ObjectId(listenerId) },
        { $addToSet: { favorite_albums: new ObjectId(albumId) } },
        { returnDocument: "after" }
      );
      return result;
    },

    unfavoriteAlbum: async (_, args) => {
      const listenerId = methods.errorCheckId(args.listenerId, "listenerId");
      const albumId = methods.errorCheckId(args.albumId, "albumId");

      const listenersCol = await listenersCollection();
      const albumsCol = await albumsCollection();

      const listener = await listenersCol.findOne({
        _id: new ObjectId(listenerId),
      });
      if (!listener) {
        throw new GraphQLError("Listener not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      const album = await albumsCol.findOne({ _id: new ObjectId(albumId) });
      if (!album) {
        throw new GraphQLError("Album not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const result = await listenersCol.findOneAndUpdate(
        { _id: new ObjectId(listenerId) },
        { $pull: { favorite_albums: new ObjectId(albumId) } },
        { returnDocument: "after" }
      );
      return result;
    },
  },
};

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
