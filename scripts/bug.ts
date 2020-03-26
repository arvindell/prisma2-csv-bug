import { PrismaClient, MaritalStatus, Sex } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient({ log: ["info", "warn"] });
const results = [];

const main = async () => {
  await prisma.connect();

  fs.createReadStream(path.join(__dirname, "./dummy.csv"))
    .pipe(csv())
    .on("data", async data => {
      results.push(data);
    })
    .on("end", () => {
      console.log("FINISHED");
      console.log("Total rows: " + results.length);
      results.forEach(async () => {
        try {
          const newPatient = {
            name: "Alex",
            sex: Sex.MALE,
            birthDate: new Date(),
            maritalStatus: MaritalStatus.MARRIED,
            phoneNumber: "1234",
            createdAt: new Date(),
            user: {
              create: {
                username: "user" + new Date().getTime() + Math.random(),
                password: "user" + new Date().getTime() + Math.random()
              }
            }
          };
          await prisma.patient.create({
            data: newPatient
          });
        } catch (error) {
          console.log(error);
        }
      });
    });
};

main().catch(e => {
  console.error(e);
});
