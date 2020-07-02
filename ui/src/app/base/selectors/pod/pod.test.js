import pod from "./pod";

describe("pod selectors", () => {
  it("can get all items", () => {
    const state = {
      pod: {
        items: [{ name: "pod1" }],
      },
    };
    expect(pod.all(state)).toEqual([{ name: "pod1" }]);
  });

  it("can get all KVMs", () => {
    const state = {
      pod: {
        items: [
          { name: "kvm1", type: "virsh" },
          { name: "kvm2", type: "lxd" },
          { name: "rsd1", type: "rsd" },
          { name: "rsd2", type: "rsd" },
        ],
      },
    };
    expect(pod.kvm(state)).toStrictEqual([
      { name: "kvm1", type: "virsh" },
      { name: "kvm2", type: "lxd" },
    ]);
  });

  it("can get all RSDs", () => {
    const state = {
      pod: {
        items: [
          { name: "kvm1", type: "virsh" },
          { name: "kvm2", type: "lxd" },
          { name: "rsd1", type: "rsd" },
          { name: "rsd2", type: "rsd" },
        ],
      },
    };
    expect(pod.rsd(state)).toStrictEqual([
      { name: "rsd1", type: "rsd" },
      { name: "rsd2", type: "rsd" },
    ]);
  });

  it("can get the loading state", () => {
    const state = {
      pod: {
        loading: true,
        items: [],
      },
    };
    expect(pod.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      pod: {
        loaded: true,
        items: [],
      },
    };
    expect(pod.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = {
      pod: {
        saving: true,
        items: [],
      },
    };
    expect(pod.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = {
      pod: {
        saved: true,
        items: [],
      },
    };
    expect(pod.saved(state)).toEqual(true);
  });

  it("can get the selected pod ids", () => {
    const state = {
      pod: {
        selected: [1, 2, 4],
        items: [],
      },
    };
    expect(pod.selectedIDs(state)).toEqual([1, 2, 4]);
  });

  it("can get the selected pods", () => {
    const state = {
      pod: {
        selected: [1, 2],
        items: [
          { id: 1, name: "pod-1" },
          { id: 2, name: "pod-2" },
          { id: 3, name: "pod-3" },
        ],
      },
    };
    expect(pod.selected(state)).toEqual([
      { id: 1, name: "pod-1" },
      { id: 2, name: "pod-2" },
    ]);
  });

  it("can get the errors state", () => {
    const state = {
      pod: {
        errors: "Data is incorrect",
      },
    };
    expect(pod.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a pod by id", () => {
    const state = {
      pod: {
        items: [
          { name: "pod-1", id: 111 },
          { name: "podrick", id: 222 },
        ],
      },
    };
    expect(pod.getById(state, 222)).toStrictEqual({
      name: "podrick",
      id: 222,
    });
  });

  it("can get a pod's host machine", () => {
    const state = {
      controller: {
        items: [{ name: "fat-controller", system_id: "qwerty" }],
      },
      machine: {
        items: [
          { name: "mean-bean-machine", system_id: "abc123" },
          { name: "lean-cuisine-machine", system_id: "def456" },
        ],
      },
      pod: {
        items: [{ host: "abc123", name: "pod-1" }],
      },
    };
    expect(pod.getHost(state, { host: "abc123" })).toStrictEqual({
      name: "mean-bean-machine",
      system_id: "abc123",
    });
  });

  it("can get a pod's host controller", () => {
    const state = {
      controller: {
        items: [
          { name: "playstation-controller", system_id: "abc123" },
          { name: "xbox-controller", system_id: "def456" },
        ],
      },
      machine: {
        items: [],
      },
      pod: {
        items: [{ host: "abc123", name: "pod-1" }],
      },
    };
    expect(pod.getHost(state, { host: "abc123" })).toStrictEqual({
      name: "playstation-controller",
      system_id: "abc123",
    });
  });

  it("can get all pod hosts", () => {
    const state = {
      controller: {
        items: [
          { name: "playstation-controller", system_id: "aaaaaa" },
          { name: "xbox-controller", system_id: "bbbbbb" },
        ],
      },
      machine: {
        items: [
          { name: "mean-bean-machine", system_id: "cccccc" },
          { name: "lean-cuisine-machine", system_id: "dddddd" },
        ],
      },
      pod: {
        items: [
          { host: "aaaaaa", name: "pod-1" },
          { host: "bbbbbb", name: "pod-1" },
          { host: "cccccc", name: "pod-1" },
        ],
      },
    };
    expect(pod.getAllHosts(state)).toStrictEqual([
      {
        name: "playstation-controller",
        system_id: "aaaaaa",
      },
      {
        name: "xbox-controller",
        system_id: "bbbbbb",
      },
      {
        name: "mean-bean-machine",
        system_id: "cccccc",
      },
    ]);
  });
});