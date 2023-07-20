import rentalsService from "../../src/services/rentals-service";
import rentalsRepository from "../../src/repositories/rentals-repository";

describe("Rentals Service Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return rentals", async () => {
    jest.spyOn(rentalsRepository, "getRentals").mockResolvedValueOnce([
      {
        id: 1,
        closed: false,
        date: new Date(),
        endDate: new Date(),
        userId: 1,
      },
      {
        id: 2,
        closed: false,
        date: new Date(),
        endDate: new Date(),
        userId: 1,
      },
    ]);

    const rentals = await rentalsService.getRentals();
    expect(rentals).toHaveLength(2);
  });

  it("should return rentals by id", async () => {
    const body = {
      id: 1,
      closed: false,
      date: new Date(),
      endDate: new Date(),
      userId: 1,
      movies: [],
    };
    jest.spyOn(rentalsRepository, "getRentalById").mockResolvedValueOnce(body);

    const rental = await rentalsService.getRentalById(1);
    expect(rental).toEqual(body);
  });

  it("should return rentals by id", async () => {
    jest.spyOn(rentalsRepository, "getRentalById").mockResolvedValueOnce(null);

    await expect(rentalsService.getRentalById(1)).rejects.toMatchObject({
      message: "Rental not found.",
    });
  });
});
