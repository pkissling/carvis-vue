type ImageDto = {
    id: string
    url: string
    height: ImageHeight
    expiresAt: Date
}

type ImageHeight = 'ORIGINAL' | '48' | '100' | '200' | '500' | '1080'

type CarDto = {
    id: string
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
    createdAt: string
    createdBy: string
    description?: string
    horsePower: number
    images: string[]
    mileage: number
    modelDetails: string
    modelSeries: string
    modelYear: string
    ownerName?: string
    price?: Float32Array
    shortDescription: string
    transmission: string
    type: string
    updatedAt: string
    updatedBy: string
    vin?: string
}

type RequestDto = {
    id: string
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
    createdAt: string
    createdBy: string
    description?: string
    hasHiddenFields: boolean
    highlights?: string
    horsePower?: number
    mileage?: number
    mustHaves?: string
    noGos?: string
    ownerName?: string
    modelSeries?: string
    modelYear?: string
    modelDetails?: string
    transmission?: string
    type: string
    updatedAt: string
    updatedBy: string
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
