import { shallowMount } from "@vue/test-utils";

import GameFormField from "../GameFormField.vue";

describe("GameFormField", () => {
  test("clear() works", () => {
    const initial = "initial-value";
    const wrapper = shallowMount(GameFormField, {
      propsData: { initial, handler: () => null, settings: {} }
    });
    var vm: GameFormField = wrapper.vm;
    expect(vm.answer === initial);
    vm.clear();
    expect(vm.answer === "");
  });
});
