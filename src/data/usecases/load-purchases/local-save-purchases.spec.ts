import {CacheStore} from '@/data/protocols/cache';
import {LocalLoadPurchases} from '@/data/usecases';
import {SavePurchases} from '@/domain/usecases/save-purchases';
import {mockPurchases, CacheStoreSpy} from '@/data/tests';



type SutTypes = {
    sut: LocalLoadPurchases,
    cacheStore: CacheStoreSpy
}
const makeSut = (timestamp = new Date()): SutTypes => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalLoadPurchases(cacheStore, timestamp);
    
    return {cacheStore, sut};
}

describe('LocalSavePurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const {cacheStore} = makeSut();
        expect(cacheStore.actions).toEqual([])
    })

    test('Should not Insert new Cache if delete fails', async () => {
        const {cacheStore, sut} = makeSut();
        cacheStore.simulateDeleteError();
        const purchases = mockPurchases();

        const promise = sut.save(purchases);
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
        await expect(promise).rejects.toThrow();
    })

    test('Should Insert new Cache if delete success', async () => {
        const timestamp = new Date();
        const {cacheStore, sut} = makeSut();
        const purchases = mockPurchases();
        const promise = sut.save(purchases);
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.deleteKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(
            {timestamp, value: purchases}
        )
        await expect(promise).resolves.toBeFalsy()
    })

    test('Should throw if insert throws', async () => {
        const {cacheStore, sut} = makeSut();
        cacheStore.simulateInsertError();
        const purchases = mockPurchases();

        const promise = sut.save(purchases);
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
        await expect(promise).rejects.toThrow();
    })

})

