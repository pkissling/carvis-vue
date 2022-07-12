import { de } from 'date-fns/locale'
import { formatDistance } from 'date-fns'

export const relativeTimeDifference = (timestamp: string): string => {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true, locale: de })
}
