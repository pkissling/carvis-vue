import BaseApi from '@/api/base-api'

export default class CarsApi extends BaseApi {
    public fetchAllCars = (): Promise<CarDto[]> => this.get('/cars')

    public fetchCar = (id: string): Promise<CarDto> => this.get(`/cars/${id}`)

    public createCar = (car: CarDto): Promise<void> => this.post('/cars', car)

    public updateCar = (id: string, car: CarDto): Promise<void> =>
        this.put(`/cars/${id}`, car)

    public deleteCar = (id: string): Promise<void> => this.delete(`/cars/${id}`)
}
