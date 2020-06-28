import { SavePurchases } from "@/domain/usecases";
import fake from 'faker';
export const mockPurchases = (): Array<SavePurchases.Params> => [
    {   
        id: fake.random.uuid(),
        date: fake.date.recent(),
        value: fake.random.number()
    }
]