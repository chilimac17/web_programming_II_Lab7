import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";

const exportedMethods = {
  errorCheckString(p_str, fieldName = "Field") {
    if (p_str === undefined || p_str === null) {
      throw new GraphQLError(`ERROR: ${fieldName} must be provided`, {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    if (typeof p_str !== "string") {
      throw new GraphQLError(`ERROR: ${fieldName} must be a string`, {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    const newStr = p_str.trim();
    if (newStr.length === 0) {
      throw new GraphQLError(
        `ERROR: ${fieldName} must not be empty or only spaces`,
        {
          extensions: { code: "BAD_USER_INPUT" },
        }
      );
    }
    return newStr;
  },

  errorCheckId(p_id, fieldName = "_id") {
    const newId = this.errorCheckString(p_id, fieldName);
    if (!ObjectId.isValid(newId)) {
      throw new GraphQLError(`ERROR: ${fieldName} is not a valid ObjectId`, {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    return newId;
  },

  errorCheckDates(p_date, fieldName = "Date") {
    const newDate = this.errorCheckString(p_date, fieldName);
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dateRegex.test(newDate)) {
      throw new GraphQLError(
        `ERROR: ${fieldName} must be in MM/DD/YYYY format`,
        {
          extensions: { code: "BAD_USER_INPUT" },
        }
      );
    }
    const [m, d, y] = newDate.split("/").map(Number);
    const dt = new Date(y, m - 1, d);
    if (
      dt.getFullYear() !== y ||
      dt.getMonth() !== m - 1 ||
      dt.getDate() !== d
    ) {
      throw new GraphQLError(`ERROR: ${fieldName} is not a valid calendar date`, {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    return newDate;
  },

  errorCheckDateSigned(p_date) {
    const newDate = this.errorCheckDates(p_date, "date_signed");
    const year = parseInt(newDate.split("/")[2], 10);
    if (year < 1900) {
      throw new GraphQLError("ERROR: date_signed must be year 1900 or later", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (this.dateFromMDY(newDate) > today) {
      throw new GraphQLError("ERROR: date_signed cannot be in the future", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    return newDate;
  },

  dateFromMDY(p_date) {
    const [m, d, y] = p_date.split("/").map(Number);
    return new Date(y, m - 1, d);
  },

  errorCheckDateRange(p_start, p_end) {
    const start = this.errorCheckDates(p_start, "start");
    const end = this.errorCheckDates(p_end, "end");
    if (this.dateFromMDY(start) > this.dateFromMDY(end)) {
      throw new GraphQLError("ERROR: start date must be before end date", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    return { start, end };
  },

  errorCheckEmail(p_email) {
    const newEmail = this.errorCheckString(p_email, "email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new GraphQLError("ERROR: Invalid email format", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    return newEmail;
  },

  errorCheckPhoneNumber(p_phone) {
    const newPhone = this.errorCheckString(p_phone, "phone");
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(newPhone)) {
      throw new GraphQLError(
        "ERROR: Invalid phone format (expected ###-###-####)",
        {
          extensions: { code: "BAD_USER_INPUT" },
        }
      );
    }
    return newPhone;
  },

  errorCheckTrackCount(p_trackCount) {
    if (
      typeof p_trackCount !== "number" ||
      !Number.isInteger(p_trackCount) ||
      p_trackCount < 1 ||
      p_trackCount > 200
    ) {
      throw new GraphQLError(
        "ERROR: track_count must be an integer between 1 and 200",
        {
          extensions: { code: "BAD_USER_INPUT" },
        }
      );
    }
    return p_trackCount;
  },

  errorCheckListenerAge(p_dob) {
    const dob = this.errorCheckDates(p_dob, "date_of_birth");
    const dobDate = this.dateFromMDY(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 13 || age > 120) {
      throw new GraphQLError(
        "ERROR: Listener must be between 13 and 120 years old",
        {
          extensions: { code: "BAD_USER_INPUT" },
        }
      );
    }
    return dob;
  },

  errorCheckSubscriptionTier(p_tier) {
    const newTier = this.errorCheckString(p_tier, "subscription_tier").toUpperCase();
    if (newTier !== "FREE" && newTier !== "PREMIUM") {
      throw new GraphQLError(
        "ERROR: subscription_tier must be either 'FREE' or 'PREMIUM'",
        {
          extensions: { code: "BAD_USER_INPUT" },
        }
      );
    }
    return newTier;
  },

  errorCheckPromoOrder(release_date, promo_start, promo_end) {
    const r = this.dateFromMDY(release_date);
    const ps = this.dateFromMDY(promo_start);
    const pe = this.dateFromMDY(promo_end);
    if (ps < r) {
      throw new GraphQLError(
        "ERROR: promo_start must be on or after release_date",
        {
          extensions: { code: "BAD_USER_INPUT" },
        }
      );
    }
    if (pe <= ps) {
      throw new GraphQLError("ERROR: promo_end must be after promo_start", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
  },
};

export default exportedMethods;
