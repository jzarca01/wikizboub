export interface WikiEntry {
    "pageid": number,
    "ns": number,
    "title": string,
    "lat": number
    "lon": number
    "dist": number,
    "primary": string
}

export interface WikiResult {
    query: {
        geosearch: WikiEntry[]
    }
}