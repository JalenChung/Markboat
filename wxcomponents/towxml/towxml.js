Component({
  options: {
    styleIsolation: 'shared'
  },
  properties: {
    nodes: {
      type: Object,
      value: {}
    },
    scrollTarget: {
      type: String
    },
    scrollTop: {
      type: Number
    }
  },
  data: {
    someData: {

    }
  },
  methods: {
    towxmlScroll: function (e) {
      this.triggerEvent('towxmlScroll', e.detail);
    }
  }
})