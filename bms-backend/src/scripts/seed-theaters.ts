import mongoose from "mongoose";
import dotenv from "dotenv";
import { TheaterModel } from "../modules/theater/theater.model";
import { config } from "../config/config";

dotenv.config();

mongoose
  .connect(config.databaseUrl as string)
  .then(async () => {
    console.log("Connected to MongoDB ✅");

    const cities = [
      {
        name: "BIRTAMODE",
        state: "koshi province",
        areas: ["SAINIK MOD", "MUKTICHOWK", "BHADRAPUR STAND", "BIRTABAZAR"],
      },

      {
      name: "BHADRAPUR",
      state: "koshi province",
      areas: ["BHADRAPUR STAND", "SAGARMATHA CHOWK", "AIRPORT AREA"],
      },
      {
        name: "FIDIM",
        state: "koshi province",
        areas: ["Whitefield", "KANYAM", "Indiranagar", "Marathahalli"],
      },
      {
        name: "JHAPA-5",
        state: "DAMAK",
        areas: ["Banjara Hills", "Gachibowli", "Madhapur", "Ameerpet"],
      },
      {
        name: "koshi province",
        state: "koshi province",
        areas: ["Salt Lake", "New Town", "Park Street", "Gariahat"],
      },
      {
        name: "koshi province",
        state: "jhapa",
        areas: ["Navrangpura", "Maninagar", "Thaltej", "Vastrapur"],
      },
      {
        name: "koshi province",
        state: "sunsari",
        areas: ["Hinjewadi", "Kothrud", "Viman Nagar", "Baner"],
      },
      {
        name: "Jaipur",
        state: "Rajasthan",
        areas: ["Malviya Nagar", "Vaishali Nagar", "C Scheme", "Mansarovar"],
      },
      {
        name: "Bhopal",
        state: "Madhya Pradesh",
        areas: ["MP Nagar", "Arera Colony", "Kolar", "TT Nagar"],
      },
      {
        name: "Patna",
        state: "Bihar",
        areas: ["Boring Road", "Kankarbagh", "Patliputra", "Bailey Road"],
      },
    ];

    const brands = ["PVR", "INOX", "Cinepolis"];
    const logos: Record<string, string> = {
      PVR: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751788726/omht27letnpbbaj2w0op.avif",
      INOX: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751788726/yxjgnxhxlccfdon3fyzg.avif",
      Cinepolis:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751788726/eebu3t34depdmmgxyknq.avif",
    };

    const theatres = [];

    for (const city of cities) {
      const numTheatres = Math.floor(Math.random() * 2) + 3; // 3 or 4 per city
      for (let i = 0; i < numTheatres; i++) {
        const brand = brands[i % brands.length];
        const area = city.areas[i % city.areas.length];
        theatres.push({
          name: `${brand} ${area}`,
          location: `${area}, ${city.name}`,
          city: city.name,
          state: city.state, // ✅ Added here
          logo: logos[brand],
        });
      }
    }

    await TheaterModel.deleteMany({});
    await TheaterModel.insertMany(theatres);

    console.log(`✅ Seeded ${theatres.length} theatres successfully.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });