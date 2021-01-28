import { EbirdSpecies } from "types";

export const ebirdSpecies = {
    getGenus: function (species: EbirdSpecies): string {
        return species.sciName.split(" ")[0] || "";
    },
    getSpecies: function (species: EbirdSpecies): string {
        return species.sciName.split(" ")[1] || "";
    },
    getFamily: function (species: EbirdSpecies): string {
        return species.familyComName;
    },
};
