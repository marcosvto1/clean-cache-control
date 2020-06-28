export interface SavePurchases {
    save: (purchades: Array<SavePuerchases.Params>) => Promise<void>;
}

namespace SavePuerchases {
    export type Params = {
        id: string,
        date: Date
        value: number
    }
}
