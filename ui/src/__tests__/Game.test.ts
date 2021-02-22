import { mount, Wrapper } from "@vue/test-utils";

import Game from "../components/Game.vue";
import GameForm from "../components/GameForm.vue";
import GameFormField from "../components/GameFormField.vue";
type GameInstance = InstanceType<typeof Game>;
type GameFormInstance = InstanceType<typeof GameForm>;
type GameFormFieldInstance = InstanceType<typeof GameFormField>;

import RevealArea from "../components/RevealArea.vue";
import { ebirdSpecies as ES } from "../ebird";
import { recording, correctSpecies, incorrectFamily } from "./fixtures";

describe("Game", () => {
  test("Truth is not revealed on entering incorrect English species name", async () => {
    const gameWrapper: Wrapper<GameInstance> = factory();
    const gameFormWrapper = gameWrapper.findComponent(GameForm) as Wrapper<
      GameFormInstance
    >;
    expect(gameFormWrapper.exists()).toBe(true);
    const speciesEnFieldWrapper = gameFormWrapper.findComponent({
      ref: "speciesEnField"
    }) as Wrapper<GameFormFieldInstance>;
    expect(speciesEnFieldWrapper.exists()).toBe(true);
    expect(gameWrapper.findComponent(RevealArea).exists()).toBe(false);
    speciesEnFieldWrapper.setData({ answer: ES.getSpeciesEn(incorrectFamily) });
    await gameWrapper.vm.$nextTick();
    expect(gameWrapper.findComponent(RevealArea).exists()).toBe(false);
  });

  test("Truth is revealed on entering correct English species name", async () => {
    const gameWrapper: Wrapper<GameInstance> = factory();
    const gameFormWrapper = gameWrapper.findComponent(GameForm) as Wrapper<
      GameFormInstance
    >;
    expect(gameFormWrapper.exists()).toBe(true);
    const speciesEnFieldWrapper = gameFormWrapper.findComponent({
      ref: "speciesEnField"
    }) as Wrapper<GameFormFieldInstance>;
    expect(speciesEnFieldWrapper.exists()).toBe(true);
    expect(gameWrapper.findComponent(RevealArea).exists()).toBe(false);
    speciesEnFieldWrapper.setData({ answer: ES.getSpeciesEn(correctSpecies) });
    await gameWrapper.vm.$nextTick();
    expect(gameWrapper.findComponent(RevealArea).exists()).toBe(true);
  });
});

function factory(): Wrapper<GameInstance> {
  return mount(Game, {
    propsData: {
      locationRequest: { ebirdLocId: "L2697642" },
      settings: { disableNetworkRequests: true }
    },
    data() {
      return {
        recording
      };
    }
  });
}
