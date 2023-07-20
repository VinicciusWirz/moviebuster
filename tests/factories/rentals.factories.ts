import { faker } from "@faker-js/faker";
import prisma from "../../src/database";
import { RENTAL_LIMITATIONS } from "../../src/services/rentals-service";

export async function createRental(userId: number) {
  const result = await prisma.rental.create({
    data: {
      userId,
      endDate: new Date(
        new Date().getDate() + RENTAL_LIMITATIONS.RENTAL_DAYS_LIMIT
      ),
    },
  });
  return {
    ...result,
    date: result.date.toISOString(),
    endDate: result.endDate.toISOString(),
  };
}



export async function rentMovie(rentalId: number, movieId: number) {
    await prisma.movie.update({
      data: { rentalId },
      where: { id: movieId }
    })
  }