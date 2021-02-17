import { mount, Wrapper } from "@vue/test-utils";

import Game from "../Game.vue";
type GameInstance = InstanceType<typeof Game>;

import RevealArea from "../RevealArea.vue";

describe("Game", () => {
  test("Truth is revealed on entering correct English species name", () => {
    const wrapper = factory();
    expect(wrapper.findComponent(RevealArea).exists()).toBe(false);
  });
});

function factory(): Wrapper<GameInstance> {
  return mount(Game, {
    propsData: {
      locationRequest: { ebirdLocId: "L2697642" },
      settings: {}
    }
  });
}
