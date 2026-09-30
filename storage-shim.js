// Async key/value storage backed by localStorage.
// The app (and the archived legacy program) talk to `window.storage`.
(function () {
  if (typeof window === "undefined" || window.storage) return;
  var LS;
  try { LS = window.localStorage; } catch (_e) { LS = null; }
  var mem = {};
  function get(k) { return LS ? LS.getItem(k) : (k in mem ? mem[k] : null); }
  window.storage = {
    list: async function (prefix) {
      var keys = [];
      if (LS) {
        for (var i = 0; i < LS.length; i++) {
          var k = LS.key(i);
          if (k && k.indexOf(prefix) === 0) keys.push(k);
        }
      } else {
        keys = Object.keys(mem).filter(function (k) { return k.indexOf(prefix) === 0; });
      }
      return { keys: keys };
    },
    get: async function (key) {
      var value = get(key);
      return value == null ? null : { value: value };
    },
    set: async function (key, value) { if (LS) LS.setItem(key, value); else mem[key] = value; },
    delete: async function (key) { if (LS) LS.removeItem(key); else delete mem[key]; },
  };
})();
