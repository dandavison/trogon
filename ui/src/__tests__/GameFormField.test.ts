import { shallowMount } from "@vue/test-utils";

import GameFormField from "../components/GameFormField.vue";
type GameFormFieldInstance = InstanceType<typeof GameFormField>;

describe("GameFormField", () => {
  test("clear() works", () => {
    const initial = "initial-value";
    const wrapper = shallowMount(GameFormField, {
      propsData: { initial, handler: () => null, settings: {} }
    });
    var vm: GameFormFieldInstance = wrapper.vm;
    expect(vm.answer === initial);
    vm.clear();
    expect(vm.answer === "");
  });
});
