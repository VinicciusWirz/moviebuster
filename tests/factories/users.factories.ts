import prisma from "../../src/database";
import { faker } from "@faker-js/faker";

export async function createUser(adult = true) {
  return await prisma.user.create({
    data: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      birthDate: generateBirthdate(adult),
      cpf: faker.internet.ipv4().replace(/\.$/g, ""),
    },
  });
}

function generateBirthdate(adult: boolean) {
  return adult
    ? faker.date.birthdate({ min: 18, mode: "age" })
    : faker.date.birthdate({ min: 10, max: 17, mode: "age" });
}
