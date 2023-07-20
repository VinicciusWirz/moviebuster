import { faker } from "@faker-js/faker";
import prisma from "../../src/database";

export async function createMovie(adultsOnly = false) {
  return await prisma.movie.create({
    data: {
      name: faker.commerce.productName(),
      adultsOnly,
    },
  });
}
