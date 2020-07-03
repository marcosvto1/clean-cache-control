import {PurchasesModel} from '@/domain/models';

export interface LoadPurchases {
    loadAll: () => Promise<LoadPurchases.Result>;
}

export namespace LoadPurchases {
    export type Result = PurchasesModel;
}
