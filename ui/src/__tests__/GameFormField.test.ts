import { shallowMount } from "@vue/test-utils";

import ChallengeFormField from "../components/ChallengeFormField.vue";
type ChallengeFormFieldInstance = InstanceType<typeof ChallengeFormField>;

describe("ChallengeFormField", () => {
  test("clear() works", () => {
    const initial = "initial-value";
    const wrapper = shallowMount(ChallengeFormField, {
      propsData: { initial, handler: () => null, settings: {} }
    });
    var vm: ChallengeFormFieldInstance = wrapper.vm;
    expect(vm.answer === initial);
    vm.clear();
    expect(vm.answer === "");
  });
});
