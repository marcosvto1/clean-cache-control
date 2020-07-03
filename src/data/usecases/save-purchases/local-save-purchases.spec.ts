import {CacheStore} from '@/data/protocols/cache';
import {LocalSavePurchases} from '@/data/usecases';
import {SavePurchases} from '@/domain/usecases/save-purchases';
import {mockPurchases, CacheStoreSpy} from '@/data/tests';



type SutTypes = {
    sut: LocalSavePurchases,
    cacheStore: CacheStoreSpy
}
const makeSut = (timestamp = new Date()): SutTypes => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore, timestamp);
    
    return {cacheStore, sut};
}

describe('LocalSavePurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const {cacheStore} = makeSut();
        expect(cacheStore.messages).toEqual([])
    })

    test('Should not Insert new Cache if delete fails', async () => {
        const {cacheStore, sut} = makeSut();
        cacheStore.simulateDeleteError();
        const purchases = mockPurchases();

        const promise = sut.save(purchases);
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
        await expect(promise).rejects.toThrow();
    })

    test('Should Insert new Cache if delete success', async () => {
        const timestamp = new Date();
        const {cacheStore, sut} = makeSut();
        const purchases = mockPurchases();
        const promise = await sut.save(purchases);
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.deleteKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(
            {timestamp, value: purchases}
        )

    })

    test('Should throw if insert throws', async () => {
        const {cacheStore, sut} = makeSut();
        cacheStore.simulateInsertError();
        const purchases = mockPurchases();

        const promise = sut.save(purchases);
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        await expect(promise).rejects.toThrow();
    })

})

