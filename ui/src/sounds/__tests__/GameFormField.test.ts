import { shallowMount } from "@vue/test-utils";

import GameFormField from "../GameFormField.vue";
type GameFormFieldInstance = InstanceType<typeof GameFormField>;

describe("GameFormField", () => {
  test("clear() works", () => {
    const initial = "initial-value";
    const wrapper = shallowMount(GameFormField, {
      propsData: { initial }
    });
    var vm: GameFormFieldInstance = wrapper.vm;
    expect(vm.answer === initial);
    vm.clear();
    expect(vm.answer === "");
  });
});
