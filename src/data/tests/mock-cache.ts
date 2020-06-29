import { CacheStore } from "../protocols/cache";
import { SavePurchases } from "@/domain/usecases";

export class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0;
    insertCallsCount = 0;
    deleteKey: string;
    insertKey: string;
    insertValues: Array<SavePurchases.Params> = [];

    insert(key: string, value: any): void {
        this.insertCallsCount++;
        this.insertKey = key;
        this.insertValues = value;
    }

    delete(key: string): void {
        this.deleteCallsCount++;
        this.deleteKey = key;
    }

    simulateDeleteError (): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {throw new Error()})
    }

    simulateInsertError (): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {throw new Error()})
    }
}
