import { mount, Wrapper } from "@vue/test-utils";

import Challenge from "../components/Challenge.vue";
import ChallengeForm from "../components/ChallengeForm.vue";
import ChallengeFormField from "../components/ChallengeFormField.vue";
type ChallengeInstance = InstanceType<typeof Challenge>;
type ChallengeFormInstance = InstanceType<typeof ChallengeForm>;
type ChallengeFormFieldInstance = InstanceType<typeof ChallengeFormField>;
import RevealArea from "../components/RevealArea.vue";
import { ChallengeState } from "../types";
import { recording, correctSpecies, incorrectFamily } from "./fixtures";

describe("Challenge", () => {
  test("Truth is not revealed on entering incorrect English species name", async () => {
    const { challenge, speciesEnField } = (await getComponentWrappers()) as any;
    speciesEnField.setData({ answer: incorrectFamily.speciesEn });
    await challenge.vm.$nextTick();
    expect(challenge.findComponent(RevealArea).exists()).toBe(false);
  });

  test("Truth is revealed on entering correct English species name", async () => {
    const { challenge, speciesEnField } = (await getComponentWrappers()) as any;
    speciesEnField.setData({ answer: correctSpecies.speciesEn });
    await challenge.vm.$nextTick();
    expect(challenge.findComponent(RevealArea).exists()).toBe(true);
  });
});

async function getComponentWrappers(): Promise<Object> {
  // assert challenge ready and truth not revealed
  const challenge: Wrapper<ChallengeInstance> = factory();
  challenge.setData({ state: ChallengeState.StartedChallenge });
  await challenge.vm.$nextTick();
  const challengeForm = challenge.findComponent(ChallengeForm) as Wrapper<
    ChallengeFormInstance
  >;
  expect(challengeForm.exists()).toBe(true);
  const speciesEnField = challengeForm.findComponent({
    ref: "speciesEnField"
  }) as Wrapper<ChallengeFormFieldInstance>;
  expect(speciesEnField.exists()).toBe(true);
  expect(challenge.findComponent(RevealArea).exists()).toBe(false);
  return { challenge, speciesEnField };
}

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
