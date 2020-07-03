import {PurchasesModel} from '@/domain/models';

export interface SavePurchases {
    save: (purchades: Array<SavePurchases.Params>) => Promise<void>;
}

export namespace SavePurchases {
    export type Params = PurchasesModel
}
