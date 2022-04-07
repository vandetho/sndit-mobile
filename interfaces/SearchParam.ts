import { EquipmentType } from '@interfaces/EquipmentType';
import { EquipmentBrand } from '@interfaces/EquipmentBrand';
import { EquipmentModel } from '@interfaces/EquipmentModel';
import { EquipmentGasCategory } from '@interfaces/EquipmentGasCategory';

export interface SearchParam {
    type: EquipmentType | undefined;
    brand: EquipmentBrand | undefined;
    model: EquipmentModel | undefined;
    gasCategory: EquipmentGasCategory | undefined;
    search: string;
}
