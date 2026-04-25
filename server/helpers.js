import { GraphQLError } from "graphql";

const exportedMethods = {
  //FIX REF FOR OTHERS
 errorCheckString(p_str) {
  let newStr = p_str.trim();
  if (!newStr) throw new GraphQLError("ERROR: String Must Be Provided", {
    extensions: { code: "STRING_NOT_PROVIDED" }
  });
 
  if (typeof newStr !== "string")
    throw new GraphQLError("ERROR: Value Must Be A String", {
      extensions: { code: "INVALID_STRING_TYPE" }
    });

  if (newStr.length === 0)
    throw new GraphQLError("ERROR: No Empty String or Only Spaces", {
      extensions: { code: "EMPTY_STRING_PROVIDED" }
    });

  return newStr;
 },
 errorCheckDates(p_date){
  //All dates below must be valid MM/DD/YYYY strings.
  let newDate = this.errorCheckString(p_date);

   if (!newDate || isNaN(new Date(newDate))) {
        throw new GraphQLError("Invalid date format for date_signed. Please use MM/DD/YYYY format.", {
          extensions: { code: "INVALID_DATE_FORMAT" },
        });
      }

  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
  if (!dateRegex.test(newDate)) {
    throw new GraphQLError("ERROR: Invalid Date Format. Expected MM/DD/YYYY", {
      extensions: { code: "INVALID_DATE_FORMAT" }
    });
  }

  

  return newDate;
 },

 errorCheckDateRange(p_start, p_end) {
  const startDate = new Date(this.errorCheckDates(p_start));
  const endDate = new Date(this.errorCheckDates(p_end));
  if (startDate > endDate) {
    throw new GraphQLError("ERROR: Start date must be before end date", {
      extensions: { code: "INVALID_DATE_RANGE" }
    });
  }
},
 errorCheckEmail (p_email) {
    let newEmail = this.errorCheckString(p_email);
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      throw new GraphQLError("ERROR: Invalid Email Format", {
        extensions: { code: "INVALID_EMAIL_FORMAT" }
      });
    }
    return newEmail;
  },

errorCheckPhoneNumber (p_phone) {
  let newPhone = this.errorCheckString(p_phone);
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  if (!phoneRegex.test(newPhone)) {
    throw new GraphQLError("ERROR: Invalid Phone Number Format", {
      extensions: { code: "INVALID_PHONE_FORMAT" }
    });

  }
  return newPhone;
},

errorCheckTrackCount (p_trackCount) {
  const newTrackCount = p_trackCount;
  if (typeof newTrackCount !== "number" || !Number.isInteger(newTrackCount) || newTrackCount <= 0) {
    throw new GraphQLError("ERROR: Track count must be a positive integer", {
      extensions: { code: "INVALID_TRACK_COUNT" }
    });
  }

  if (newTrackCount < 1 || newTrackCount > 200) {
    throw new GraphQLError("ERROR: Track count must be between 1 and 200", {
      extensions: { code: "TRACK_COUNT_OUT_OF_RANGE" }

    });
  }
  return newTrackCount;
}
};
export default exportedMethods;