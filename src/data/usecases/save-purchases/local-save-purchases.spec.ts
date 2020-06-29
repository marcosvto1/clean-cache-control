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
    test('Should not delete cache on sut.init', () => {
        const {cacheStore} = makeSut();
        expect(cacheStore.deleteCallsCount).toBe(0)
    })

    test('Should delete old cache on sut.save', async () => {
        const {cacheStore, sut} = makeSut();
        const purchases = mockPurchases();
        await sut.save(purchases);
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should not Insert new Cache if delete fails', () => {
        const {cacheStore, sut} = makeSut();
        cacheStore.simulateDeleteError();
        const purchases = mockPurchases();

        const promise = sut.save(purchases);
        expect(cacheStore.insertCallsCount).toBe(0)
        expect(promise).rejects.toThrow();
    })

    test('Should Insert new Cache if delete success', async () => {
        const {cacheStore, sut} = makeSut();
        const purchases = mockPurchases();
        const promise = await sut.save(purchases);
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.insertCallsCount).toBe(1)
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases);

    })

    test('Should throw if insert throws', async () => {
        const {cacheStore, sut} = makeSut();
        cacheStore.simulateInsertError();
        const purchases = mockPurchases();

        const promise = sut.save(purchases);
        expect(promise).rejects.toThrow();
    })

})

