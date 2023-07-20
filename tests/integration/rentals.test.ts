import supertest from "supertest";
import app from "../../src/app";
import { RentalFinishInput, RentalInput } from "../../src/protocols";
import { createRental, rentMovie } from "../factories/rentals.factories";
import { createUser } from "../factories/users.factories";
import { createMovie } from "../factories/movies.factories";
import { cleanDb } from "../utils";

const api = supertest(app);

beforeEach(async () => {
  await cleanDb();
});

describe("Rentals Service Integration Tests", () => {
  describe("GET /rentals", () => {
    it("should return rentals", async () => {
      const user = await createUser();
      const rental = await createRental(user.id);
      const { status, body } = await api.get("/rentals");
      expect(status).toBe(200);
      expect(body).toEqual([rental]);
    });
  });
  describe("GET /rentals/:id", () => {
    it("should return rental by rentalId", async () => {
      const user = await createUser();
      const rental = await createRental(user.id);
      const { status, body } = await api.get(`/rentals/${rental.id}`);
      expect(status).toBe(200);
      expect(body).toEqual(rental);
    });

    it("should return 400 when id is not valid", async () => {
      const { status: statusNegative } = await api.get(`/rentals/-1`);
      expect(statusNegative).toBe(400);
      const { status: statusNaN } = await api.get(`/rentals/banana`);
      expect(statusNaN).toBe(400);
    });

    it("should return 404 when rental does not exist", async () => {
      const { status } = await api.get(`/rentals/214748364`);
      expect(status).toBe(404);
    });
  });
  describe("POST /rentals", () => {
    it("should return 422 when body is not valid", async () => {
      const body = {
        moviesId: "banana",
        userId: 1,
      };
      const { status } = await api.post("/rentals").send(body);
      expect(status).toBe(422);
    });
    it("should return 422 when body is not valid", async () => {
      const body = {};
      const { status } = await api.post("/rentals").send(body);
      expect(status).toBe(422);
    });
    it("should return 201 when renting successfully", async () => {
      const user = await createUser();
      const movie = await createMovie();
      const body: RentalInput = {
        userId: user.id,
        moviesId: [movie.id],
      };
      const { status } = await api.post("/rentals").send(body);
      expect(status).toBe(201);
    });
    it("should return 404 when movie does not exist", async () => {
      const user = await createUser();
      const body: RentalInput = {
        userId: user.id,
        moviesId: [5456465],
      };
      const { status } = await api.post("/rentals").send(body);
      expect(status).toBe(404);
    });
    it("should return 404 when user does not exist", async () => {
      const movie = await createMovie();
      const body: RentalInput = {
        userId: 5456465,
        moviesId: [movie.id],
      };
      const { status } = await api.post("/rentals").send(body);
      expect(status).toBe(404);
    });
    it("should return 402 when user already have rental to return", async () => {
      const movie = await createMovie();
      const movie2 = await createMovie();
      const user = await createUser();
      const rental = await createRental(user.id);
      await rentMovie(rental.id, movie.id);
      const body: RentalInput = {
        userId: user.id,
        moviesId: [movie2.id],
      };
      const { status } = await api.post("/rentals").send(body);
      expect(status).toBe(402);
    });
    it("should return 409 when movie is already rented", async () => {
      const movie = await createMovie();
      const user = await createUser();
      const rental = await createRental(user.id);
      await rentMovie(rental.id, movie.id);

      const user2 = await createUser();
      const body: RentalInput = {
        userId: user2.id,
        moviesId: [movie.id],
      };
      const { status } = await api.post("/rentals").send(body);
      expect(status).toBe(409);
    });
    it("should return 401 when a minor is atempting to rental an adults only movie", async () => {
      const movie = await createMovie(true);
      const user = await createUser(false);
      const body: RentalInput = {
        userId: user.id,
        moviesId: [movie.id],
      };
      const { status } = await api.post("/rentals").send(body);
      expect(status).toBe(401);
    });
  });
  describe("POST /rentals/finish", () => {
    it("should return 422 when data is missing", async () => {
      const { status } = await api.post("/rentals/finish").send({});
      expect(status).toBe(422);
    });
    it("should return 200 when finilizing a valid rental", async () => {
      const movie = await createMovie();
      const user = await createUser();
      const { id: rentalId } = await createRental(user.id);
      await rentMovie(rentalId, movie.id);
      const data: RentalFinishInput = { rentalId };
      const { status } = await api.post("/rentals/finish").send(data);
      expect(status).toBe(200);
      
    });

    it("should return 404 when rental doesn't exist", async () => {
      const body: RentalFinishInput = { rentalId: 1 };
      const { status } = await api.post("/renstals/finish").send(body);
      expect(status).toBe(404);
    });
  });
});
