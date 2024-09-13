const config = require('./config');

Component({
	options: {
		styleIsolation: 'apply-shared'
	},
	properties: {
		nodes: {
			type: Object,
			value: {}
		},
		scrollTarget: {
			type: String
		},
		slideable: {
			type: Boolean,
			default: false
		},
		scrollTop: {
			type: Number
		}
	},
	lifetimes: {
		attached: function () {
			const _ts = this;

			config.events.forEach(item => {
				_ts['_' + item] = function (...arg) {
					if (global._events && typeof global._events[item] === 'function') {
						global._events[item](...arg);
					}
				};
			});

		}
	},
	methods: {
		handleScroll: function (e) {
			this.triggerEvent('decodeScroll', e.detail);
		}
	}
})