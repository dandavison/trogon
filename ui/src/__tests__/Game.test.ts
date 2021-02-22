import { mount, Wrapper } from "@vue/test-utils";

import Challenge from "../components/Challenge.vue";
import ChallengeForm from "../components/ChallengeForm.vue";
import ChallengeFormField from "../components/ChallengeFormField.vue";
type ChallengeInstance = InstanceType<typeof Challenge>;
type ChallengeFormInstance = InstanceType<typeof ChallengeForm>;
type ChallengeFormFieldInstance = InstanceType<typeof ChallengeFormField>;

import RevealArea from "../components/RevealArea.vue";
import { ebirdSpecies as ES } from "../ebird";
import { recording, correctSpecies, incorrectFamily } from "./fixtures";

describe("Challenge", () => {
  test("Truth is not revealed on entering incorrect English species name", async () => {
    const challengeWrapper: Wrapper<ChallengeInstance> = factory();
    const challengeFormWrapper = challengeWrapper.findComponent(ChallengeForm) as Wrapper<
      ChallengeFormInstance
    >;
    expect(challengeFormWrapper.exists()).toBe(true);
    const speciesEnFieldWrapper = challengeFormWrapper.findComponent({
      ref: "speciesEnField"
    }) as Wrapper<ChallengeFormFieldInstance>;
    expect(speciesEnFieldWrapper.exists()).toBe(true);
    expect(challengeWrapper.findComponent(RevealArea).exists()).toBe(false);
    speciesEnFieldWrapper.setData({ answer: ES.getSpeciesEn(incorrectFamily) });
    await challengeWrapper.vm.$nextTick();
    expect(challengeWrapper.findComponent(RevealArea).exists()).toBe(false);
  });

  test("Truth is revealed on entering correct English species name", async () => {
    const challengeWrapper: Wrapper<ChallengeInstance> = factory();
    const challengeFormWrapper = challengeWrapper.findComponent(ChallengeForm) as Wrapper<
      ChallengeFormInstance
    >;
    expect(challengeFormWrapper.exists()).toBe(true);
    const speciesEnFieldWrapper = challengeFormWrapper.findComponent({
      ref: "speciesEnField"
    }) as Wrapper<ChallengeFormFieldInstance>;
    expect(speciesEnFieldWrapper.exists()).toBe(true);
    expect(challengeWrapper.findComponent(RevealArea).exists()).toBe(false);
    speciesEnFieldWrapper.setData({ answer: ES.getSpeciesEn(correctSpecies) });
    await challengeWrapper.vm.$nextTick();
    expect(challengeWrapper.findComponent(RevealArea).exists()).toBe(true);
  });
});

function factory(): Wrapper<ChallengeInstance> {
  return mount(Challenge, {
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
