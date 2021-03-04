import Challenge from "./Challenge.vue";
type ChallengeType = InstanceType<typeof Challenge>;
import {
  fetchEbirdHotspots,
  fetchLocationSpecies,
  fetchRecentObservations,
  fetchSpeciesImages,
  fetchEbirdHotspotsByLatLng
} from "../ebird";
import {
  ChallengeFamily,
  ChallengeState,
  EbirdHotspot,
  EbirdObservation,
  Species
} from "../types";
import { makeChallengeFamilies, makeImageMaps, makeTaxonMaps } from "../utils";
import eventBus from "../event-bus";

export function makeLocationSpeciesSelectorData() {
  return {
    ebirdLocIds: [] as string[],
    ebirdHotspots: [] as EbirdHotspot[],
    locationSpecies: [] as Species[],
    filteredLocationSpecies: [] as Species[],
    commonSpecies: new Set([]) as Set<string>,
    recentObservations: [] as EbirdObservation[],
    challengeFamilies: new Map([]) as Map<string, ChallengeFamily>,
    selectedFamilies: new Set([]) as Set<string>,
    taxonMaps: makeTaxonMaps([]),
    imageMaps: makeImageMaps([], [])
  };
}

export const LocationSpeciesSelector = {
  async created(this: ChallengeType) {
    if (!this.settings.disableNetworkRequests) {
      await fetchLocationData(this);
    }
    this.state = ChallengeState.HaveLocationData;
    this.taxonMaps = makeTaxonMaps(this.locationSpecies);
    this.commonSpecies = new Set(
      this.recentObservations
        .map((obs: EbirdObservation) =>
          this.taxonMaps.speciesId2SciName.get(obs.speciesCode)
        )
        .filter(Boolean) as any
    );
    this.challengeFamilies = makeChallengeFamilies(this.locationSpecies);
    filterSpecies(this);
    eventBus.$on("family:select", (family: string, selected: boolean) =>
      handleFamilySelection(this, family, selected)
    );
    eventBus.$on("change:species-filters", () => filterSpecies(this));
    this.postCreatedHook && this.postCreatedHook();
  }
};

function handleFamilySelection(
  _this: ChallengeType,
  family: string,
  selected: boolean
): void {
  var challengeFamily = _this.challengeFamilies.get(family);
  if (challengeFamily) {
    challengeFamily.selected = selected;
    // HACK: force re-evaluation of computed properties depending on this
    _this.challengeFamilies = new Map(_this.challengeFamilies);
  }
  filterSpecies(_this);
}

async function fetchLocationData(_this: ChallengeType): Promise<void> {
  try {
    // Determine locations from request parameters
    if (_this.locationRequest.ebirdLocId) {
      _this.ebirdLocIds = [_this.locationRequest.ebirdLocId];
    } else if (_this.locationRequest.latlng) {
      _this.ebirdHotspots = await fetchEbirdHotspotsByLatLng(
        _this.locationRequest.latlng
      );
      _this.ebirdLocIds = _this.ebirdHotspots.map(h => h.locId);
    } else {
      throw "Expected ebird ebirdLocId or coordinates";
    }
    // In parallel: given locations, fetch combined species list, hotspot info, and recent observations.
    [
      _this.locationSpecies,
      _this.ebirdHotspots,
      _this.recentObservations
    ] = await Promise.all([
      fetchLocationSpecies(_this.ebirdLocIds),
      _this.ebirdHotspots.length > 0
        ? Promise.resolve(_this.ebirdHotspots)
        : fetchEbirdHotspots(_this.ebirdLocIds),
      fetchRecentObservations(_this.ebirdLocIds)
    ]);
    fetchSpeciesImages(_this.locationSpecies).then(
      images =>
        (_this.imageMaps = makeImageMaps(images, _this.locationSpecies))
    );
    console.log(`Fetched data for ${_this.ebirdLocIds.length} locIds:`);
    console.log(`hotspots: ${_this.ebirdHotspots.length}`);
    console.log(`species: ${_this.locationSpecies.length}`);
    console.log(`recent observations: ${_this.recentObservations.length}`);
  } catch (err) {
    console.log("Error fetching location species and recordings: ", err);
  }
}

function filterSpecies(_this: ChallengeType): void {
  _this.selectedFamilies = new Set(
    Array.from(_this.challengeFamilies.entries())
      .filter(([_, { selected }]: any) => selected)
      .map(([family, _]: any) => family)
  );
  var species = _this.locationSpecies.filter((sp: any) =>
    _this.selectedFamilies.has(
      _this.taxonMaps.species2familySci.get(sp.speciesSci) || ""
    )
  );
  if (_this.settings.commonSpeciesOnly) {
    species = species.filter((sp: any) =>
      _this.commonSpecies.has(sp.speciesSci)
    );
  }
  _this.filteredLocationSpecies = species;
}
