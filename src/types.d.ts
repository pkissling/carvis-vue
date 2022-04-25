type ImageDto = {
    id: string
    url: string
    height: ImageHeight
    expiresAt: Date
}

type ImageHeight = 'ORIGINAL' | '48' | '100' | '200' | '500' | '1080'

type BaseDto = {
    id: string
    createdAt: string
    createdBy: string
    ownerName?: string
    updatedAt: string
    updatedBy: string
}

type CarDto = BaseDto & {
    ads: string[]
    additionalEquipment?: string
    brand: string
    bodyType: string
    capacity: number
    colorAndMaterialInterior: string
    colorExterior: string
    colorExteriorManufacturer: string
    condition: string
    countryOfOrigin?: string
    description?: string
    horsePower: number
    images: string[]
    mileage: number
    modelDetails: string
    modelSeries: string
    modelYear: string
    price?: Float32Array
    shortDescription: string
    transmission: string
    type: string
    vin?: string
}

type RequestDto = BaseDto & {
    additionalEquipment?: string
    bodyType?: string
    brand: string
    budget?: string
    capacity: number
    countryOfOrigin?: string
    colorExterior?: string
    colorExteriorManufacturer?: string
    colorAndMaterialInterior?: string
    condition?: string
    contactDetails?: {
        company?: string
        email?: string
        freeText?: string
        name?: string
        phone?: string
    }
    description?: string
    hasHiddenFields: boolean
    highlights?: string
    horsePower?: number
    mileage?: number
    mustHaves?: string
    noGos?: string
    modelSeries?: string
    modelYear?: string
    modelDetails?: string
    transmission?: string
    type: string
    vision?: string
}


type HighlightableDataTableHeader = {
    priority: 0 | 1 | 2
    sortable?: boolean
    text?: string
    value: any
    forceShow?: boolean
}

type Role = 'admin' | 'user'

type UserDto = {
    userId: string
    name: string
    company?: string
}