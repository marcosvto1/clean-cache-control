import {CacheStore} from '@/data/protocols/cache';
import {LocalSavePurchases} from '@/data/usecases';
import {SavePurchases} from '@/domain/usecases/save-purchases';
import {mockPurchases, CacheStoreSpy} from '@/data/tests';



type SutTypes = {
    sut: LocalSavePurchases,
    cacheStore: CacheStoreSpy
}
const makeSut = (): SutTypes => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore);
    
    return {cacheStore, sut};
}

describe('LocalSavePurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const {cacheStore} = makeSut();
        expect(cacheStore.messages).toEqual([])
    })

    test('Should delete old cache on sut.save', async () => {
        const {cacheStore, sut} = makeSut();
        const purchases = mockPurchases();
        await sut.save(purchases);
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should not Insert new Cache if delete fails', () => {
        const {cacheStore, sut} = makeSut();
        cacheStore.simulateDeleteError();
        const purchases = mockPurchases();

        const promise = sut.save(purchases);
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
        expect(promise).rejects.toThrow();
    })

    test('Should Insert new Cache if delete success', async () => {
        const {cacheStore, sut} = makeSut();
        const purchases = mockPurchases();
        const promise = await sut.save(purchases);
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases);

    })

    test('Should throw if insert throws', async () => {
        const {cacheStore, sut} = makeSut();
        cacheStore.simulateInsertError();
        const purchases = mockPurchases();

        const promise = sut.save(purchases);
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(promise).rejects.toThrow();
    })

})

