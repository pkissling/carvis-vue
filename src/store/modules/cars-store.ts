import BackendClient from '@/api/cars-api'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { config } from 'vuex-module-decorators'

config.rawError = true

const backendClient = new BackendClient()

@Module({ namespaced: false, name: 'cars' })
export default class CarsStore extends VuexModule {
    cars: CarDto[] = []
    searchTerm = ''

    @Action({ commit: 'setCars' })
    public async fetchAllCars(): Promise<CarDto[]> {
        try {
            return await backendClient.fetchAllCars()
        } catch (err: unknown) {
            this.setCars([])
            throw err
        }
    }

    @Action({ commit: 'put' })
    public async fetchCar(carId: string): Promise<CarDto> {
        return backendClient.fetchCar(carId)
    }

    @Action
    public async createCar(car: CarDto): Promise<void> {
        await backendClient.createCar(car)
        await this.fetchAllCars()
    }

    @Action
    public async updateCar(car: CarDto): Promise<void> {
        await backendClient.updateCar(car.id, car)
        await this.fetchAllCars()
    }

    @Action
    public async deleteCar(carId: string): Promise<void> {
        await backendClient.deleteCar(carId)
        await this.fetchAllCars()
    }

    @Mutation
    public setCars(cars: CarDto[]): void {
        this.cars = cars
    }

    @Mutation
    public put(car: CarDto): void {
        this.cars = [...this.cars.filter((c) => c.id !== car.id), car]
    }

    @Mutation
    public setSearchTerm(searchTerm: string): void {
        this.searchTerm = searchTerm
    }
}
