import ImagesApi from '@/api/images-api'
import S3Api from '@/api/s3-api'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { sentryStore, notificationsStore } from '@/store'
import { config } from 'vuex-module-decorators'

const imagesApi = new ImagesApi()
const s3Api = new S3Api()

config.rawError = true

@Module({ namespaced: true, name: 'images' })
export default class ImagesStore extends VuexModule {
    images: ImageDto[] = []

    @Action
    public async fetchImage(dto: {
        imageId: string
        height: ImageHeight
    }): Promise<ImageDto> {
        await this.purgeExpired()
        const cachedImage = this.images.find(
            (img) => img.id === dto.imageId && img.height === dto.height
        )
        if (!cachedImage) {
            // fetch image and populate cache
            const img = await imagesApi.fetchImage(dto.imageId, dto.height)
            this.put(img)
            return img
        }

        const now = new Date().getTime()
        const expiresAt = new Date(cachedImage.expiresAt).getTime()
        if (expiresAt < now) {
            // evict expired image and populate with new url
            this.evictOne(cachedImage.id, cachedImage.height)
            const img = await imagesApi.fetchImage(dto.imageId, dto.height)
            this.put(img)
            return img
        }

        return cachedImage
    }

    @Action
    public async purgeExpired(): Promise<void> {
        const expiredImages = this.getExpiredImages
        this.evictMany(expiredImages)
    }

    @Action
    public async uploadImage(dto: {
        file: File
        progressCallback: (progress: number) => void
        index: number
    }): Promise<string> {
        const contentType = dto.file.type
        const response = await imagesApi.createUploadUrl(contentType)
        await s3Api.uploadFile(
            response.url.toString(),
            contentType,
            dto.file,
            dto.progressCallback,
            dto.index
        )
        return response.id
    }

    @Action({ commit: 'put' })
    public async reloadImage(dto: {
        imageId: string
        height: ImageHeight
    }): Promise<string> {
        this.evictOne(dto.imageId, dto.height)
        const imageDto = await this.fetchImage({
            imageId: dto.imageId,
            height: dto.height,
        })
        const url = imageDto.url.valueOf()

        const loads = await imageLoads(url)
        if (!loads) {
            notificationsStore.warning(
                'Ein Bild konnte nicht geladen werden. Bitte versuche es später erneut.'
            )
            sentryStore.captureError({
                payload: 'Reloaded url was invalid as well!',
                extras: { url },
            })
            throw new Error(`Cannot resolve image from url: ${url}`)
        }

        return url
    }

    get getExpiredImages(): ImageDto[] {
        const now = new Date()
        return this.images.filter((img) => img.expiresAt < now)
    }

    @Mutation
    public put(image: ImageDto): void {
        // remove otherwise duplicated images in cache
        const duplicatedImages = this.images.filter(
            (img) => img.id === image.id && img.height === image.height
        )
        for (const img of duplicatedImages) {
            this.images.splice(this.images.indexOf(img), 1)
        }

        // populate new entry
        this.images.push(image)
    }

    @Mutation
    public evictOne(imageId: string, height: ImageHeight): void {
        const duplicatedImages = this.images.filter(
            (img) => img.id === imageId && img.height === height
        )
        for (const img of duplicatedImages) {
            this.images.splice(this.images.indexOf(img), 1)
        }
    }

    @Mutation
    public evictMany(images: ImageDto[]): void {
        const duplicatedImages = this.images.filter((img) =>
            images.includes(img)
        )
        for (const img of duplicatedImages) {
            this.images.splice(this.images.indexOf(img), 1)
        }
    }
}

const imageLoads = async (url: string): Promise<boolean> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await new Promise((resolve) => {
        const image = new Image()
        image.onload = resolve
        image.onerror = resolve
        image.src = url
    })

    return result.type === 'load'
}
