'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request-promise-native'),
    queryString = require('querystring');

var ERROR = {
  MISSING_ID: {
    code: 'missing_id',
    message: 'Missing `id` parameter'
  },
  MISSING_BODY: {
    code: 'missing_body',
    message: 'Missing a proper `body` parameter'
  }
};

var handleError = function handleError(err) {
  return new Promise(function (resolve, reject) {
    return reject(err);
  });
};

var Pickware = function () {
  function Pickware(options) {
    _classCallCheck(this, Pickware);

    if (!options) {
      console.error('No host, user or api key found.');
    }

    this.host = options.host;
    this.user = options.user;
    this.apiKey = options.apiKey;
    this.deviceUuid = options.deviceUuid;
    this.apiVersion = options.apiVersion || '2017-06-08';

    this.request = request.defaults({
      baseUrl: this.host + '/api/',
      timeout: 30000,
      json: true,
      headers: {
        'User-Agent': 'Stocking/2.10.2 (iPod touch; iOS 11.0.3; Scale/2.00)',
        'Content-Type': 'application/json; charset=utf-8',
        'pickware-device-uuid': this.deviceUuid,
        'pickware-api-version': this.apiVersion
      },
      auth: {
        user: this.user,
        pass: this.apiKey,
        sendImmediately: false
      }
    });
  }

  _createClass(Pickware, [{
    key: '_buildQueryString',
    value: function _buildQueryString(queryArray) {
      var resultString = '';
      for (var queryPartName in queryArray) {
        if (queryArray.hasOwnProperty(queryPartName)) {
          var queryPartValues = queryArray[queryPartName];
          switch (queryPartName) {
            case 'filter':
              queryPartValues.forEach(function (queryPartValue, queryPartIndex) {
                var queryResPrefix = queryPartName + '[' + queryPartIndex + ']';
                for (var queryPartValueKey in queryPartValue) {
                  if (queryPartValue.hasOwnProperty(queryPartValueKey)) {
                    resultString += resultString === '' ? '' : '&';
                    resultString += queryResPrefix + '[' + queryPartValueKey + ']=' + queryString.escape(queryPartValue[queryPartValueKey]);
                  }
                }
              });
              break;
            default:

          }
        }
      }
      return resultString;
    }
  }, {
    key: 'handleRequest',
    value: function handleRequest(config, selector) {
      var _this = this;

      if (config.qs) {
        config.url = config.url + '?' + this._buildQueryString(config.qs);
      }
      return new Promise(function (resolve, reject) {
        _this.request(config).then(function (res) {
          var responseData = selector ? res[selector] : res;
          resolve(responseData);
        }).catch(function (err) {
          reject(err.message);
        });
      });
    }
  }, {
    key: 'version',
    value: function version() {
      return this.handleRequest({
        url: 'version/',
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'getWarehouses',
    value: function getWarehouses(params) {
      return this.handleRequest({
        url: 'warehouses/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getWarehouse',
    value: function getWarehouse(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'warehouses/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'deleteWarehouse',
    value: function deleteWarehouse(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'warehouses/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'deleteWarehouses',
    value: function deleteWarehouses(ids) {
      if (!ids) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'warehouses/',
        method: 'DELETE',
        ids: ids
      });
    }
  }, {
    key: 'createWarehouse',
    value: function createWarehouse(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'warehouses/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateWarehouses',
    value: function updateWarehouses(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'warehouses/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'updateWarehouses',
    value: function updateWarehouses(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'warehouses/',
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'getUsers',
    value: function getUsers(params) {
      return this.handleRequest({
        url: 'pickware/users/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getUser',
    value: function getUser(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'pickware/users/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'getWarehouseBinLocations',
    value: function getWarehouseBinLocations(warehouseId, params) {
      if (!warehouseId) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'warehouses/' + warehouseId + '/binLocations',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getWarehouseBinLocation',
    value: function getWarehouseBinLocation(warehouseId, id) {
      if (!warehouseId) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'warehouses/' + warehouseId + '/binLocations/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'updateWarehouseBinLocation',
    value: function updateWarehouseBinLocation(warehouseId, id, body) {
      if (!warehouseId) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'warehouses/' + warehouseId + '/binLocations/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'createWarehouseBinLocation',
    value: function createWarehouseBinLocation(warehouseId, body) {
      if (!warehouseId) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'warehouses/' + warehouseId + '/binLocations',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'deleteWarehouseBinLocation',
    value: function deleteWarehouseBinLocation(warehouseId, id) {
      if (!warehouseId) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'warehouses/' + warehouseId + '/binLocations/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'deleteWarehouseBinLocations',
    value: function deleteWarehouseBinLocations(warehouseId, ids) {
      if (!warehouseId) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!ids) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'warehouses/' + warehouseId + '/binLocations/',
        method: 'DELETE',
        ids: ids
      });
    }
  }, {
    key: 'relocateVariantStock',
    value: function relocateVariantStock(variantId, body) {
      if (!variantId) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'variants/' + variantId + '/relocations/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'changeVariantStock',
    value: function changeVariantStock(variantId, body) {
      if (!variantId) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'variants/' + variantId + '/stock',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'overwriteVariantStock',
    value: function overwriteVariantStock(variantId, body) {
      if (!variantId) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'variants/' + variantId + '/stocktakes',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'getSuppliers',
    value: function getSuppliers(params) {
      return this.handleRequest({
        url: 'suppliers/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getSupplier',
    value: function getSupplier(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'suppliers/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'deleteSupplier',
    value: function deleteSupplier(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'suppliers/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'deleteSuppliers',
    value: function deleteSuppliers(ids) {
      if (!ids) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'suppliers/',
        method: 'DELETE',
        ids: ids
      });
    }
  }, {
    key: 'createSupplier',
    value: function createSupplier(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'suppliers/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateSupplier',
    value: function updateSupplier(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'suppliers/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'updateSuppliers',
    value: function updateSuppliers(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'suppliers/',
        method: 'PUT',
        body: body
      });
    }
  }]);

  return Pickware;
}();

module.exports = Pickware;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVlc3QiLCJyZXF1aXJlIiwicXVlcnlTdHJpbmciLCJFUlJPUiIsIk1JU1NJTkdfSUQiLCJjb2RlIiwibWVzc2FnZSIsIk1JU1NJTkdfQk9EWSIsImhhbmRsZUVycm9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJlcnIiLCJQaWNrd2FyZSIsIm9wdGlvbnMiLCJjb25zb2xlIiwiZXJyb3IiLCJob3N0IiwidXNlciIsImFwaUtleSIsImRldmljZVV1aWQiLCJhcGlWZXJzaW9uIiwiZGVmYXVsdHMiLCJiYXNlVXJsIiwidGltZW91dCIsImpzb24iLCJoZWFkZXJzIiwiYXV0aCIsInBhc3MiLCJzZW5kSW1tZWRpYXRlbHkiLCJxdWVyeUFycmF5IiwicmVzdWx0U3RyaW5nIiwicXVlcnlQYXJ0TmFtZSIsImhhc093blByb3BlcnR5IiwicXVlcnlQYXJ0VmFsdWVzIiwiZm9yRWFjaCIsInF1ZXJ5UGFydFZhbHVlIiwicXVlcnlQYXJ0SW5kZXgiLCJxdWVyeVJlc1ByZWZpeCIsInF1ZXJ5UGFydFZhbHVlS2V5IiwiZXNjYXBlIiwiY29uZmlnIiwic2VsZWN0b3IiLCJxcyIsInVybCIsIl9idWlsZFF1ZXJ5U3RyaW5nIiwidGhlbiIsInJlc3BvbnNlRGF0YSIsInJlcyIsImNhdGNoIiwiaGFuZGxlUmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImlkIiwiaWRzIiwiYm9keSIsIndhcmVob3VzZUlkIiwidmFyaWFudElkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTUEsVUFBVUMsUUFBUSx3QkFBUixDQUFoQjtBQUFBLElBQ01DLGNBQWNELFFBQVEsYUFBUixDQURwQjs7QUFHQSxJQUFNRSxRQUFRO0FBQ1pDLGNBQVk7QUFDVkMsVUFBTSxZQURJO0FBRVZDLGFBQVM7QUFGQyxHQURBO0FBS1pDLGdCQUFjO0FBQ1pGLFVBQU0sY0FETTtBQUVaQyxhQUFTO0FBRkc7QUFM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ZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdC1wcm9taXNlLW5hdGl2ZScpLFxuICAgICAgcXVlcnlTdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuXG5jb25zdCBFUlJPUiA9IHtcbiAgTUlTU0lOR19JRDoge1xuICAgIGNvZGU6ICdtaXNzaW5nX2lkJyxcbiAgICBtZXNzYWdlOiAnTWlzc2luZyBgaWRgIHBhcmFtZXRlcidcbiAgfSxcbiAgTUlTU0lOR19CT0RZOiB7XG4gICAgY29kZTogJ21pc3NpbmdfYm9keScsXG4gICAgbWVzc2FnZTogJ01pc3NpbmcgYSBwcm9wZXIgYGJvZHlgIHBhcmFtZXRlcidcbiAgfVxufVxuXG5jb25zdCBoYW5kbGVFcnJvciA9IGVyciA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZWplY3QoZXJyKSlcblxuY2xhc3MgUGlja3dhcmUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdObyBob3N0LCB1c2VyIG9yIGFwaSBrZXkgZm91bmQuJylcbiAgICB9XG5cbiAgICB0aGlzLmhvc3QgPSBvcHRpb25zLmhvc3RcbiAgICB0aGlzLnVzZXIgPSBvcHRpb25zLnVzZXJcbiAgICB0aGlzLmFwaUtleSA9IG9wdGlvbnMuYXBpS2V5XG4gICAgdGhpcy5kZXZpY2VVdWlkID0gb3B0aW9ucy5kZXZpY2VVdWlkXG4gICAgdGhpcy5hcGlWZXJzaW9uID0gb3B0aW9ucy5hcGlWZXJzaW9uIHx8ICcyMDE3LTA2LTA4J1xuXG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdC5kZWZhdWx0cyh7XG4gICAgICBiYXNlVXJsOiB0aGlzLmhvc3QgKyAnL2FwaS8nLFxuICAgICAgdGltZW91dDogMzAwMDAsXG4gICAgICBqc29uOiB0cnVlLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnVXNlci1BZ2VudCc6ICdTdG9ja2luZy8yLjEwLjIgKGlQb2QgdG91Y2g7IGlPUyAxMS4wLjM7IFNjYWxlLzIuMDApJyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgJ3BpY2t3YXJlLWRldmljZS11dWlkJzogdGhpcy5kZXZpY2VVdWlkLFxuICAgICAgICAncGlja3dhcmUtYXBpLXZlcnNpb24nOiB0aGlzLmFwaVZlcnNpb25cbiAgICAgIH0sXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHVzZXI6IHRoaXMudXNlcixcbiAgICAgICAgcGFzczogdGhpcy5hcGlLZXksXG4gICAgICAgIHNlbmRJbW1lZGlhdGVseTogZmFsc2VcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgX2J1aWxkUXVlcnlTdHJpbmcgKHF1ZXJ5QXJyYXkpIHtcbiAgICBsZXQgcmVzdWx0U3RyaW5nID0gJyc7XG4gICAgZm9yICh2YXIgcXVlcnlQYXJ0TmFtZSBpbiBxdWVyeUFycmF5KSB7XG4gICAgICBpZiAocXVlcnlBcnJheS5oYXNPd25Qcm9wZXJ0eShxdWVyeVBhcnROYW1lKSkge1xuICAgICAgICBjb25zdCBxdWVyeVBhcnRWYWx1ZXMgPSBxdWVyeUFycmF5W3F1ZXJ5UGFydE5hbWVdO1xuICAgICAgICBzd2l0Y2ggKHF1ZXJ5UGFydE5hbWUpIHtcbiAgICAgICAgICBjYXNlICdmaWx0ZXInOlxuICAgICAgICAgICAgcXVlcnlQYXJ0VmFsdWVzLmZvckVhY2goKHF1ZXJ5UGFydFZhbHVlLCBxdWVyeVBhcnRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBxdWVyeVJlc1ByZWZpeCA9IHF1ZXJ5UGFydE5hbWUgKyAnWycgKyBxdWVyeVBhcnRJbmRleCArICddJ1xuICAgICAgICAgICAgICBmb3IgKHZhciBxdWVyeVBhcnRWYWx1ZUtleSBpbiBxdWVyeVBhcnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChxdWVyeVBhcnRWYWx1ZS5oYXNPd25Qcm9wZXJ0eShxdWVyeVBhcnRWYWx1ZUtleSkpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdFN0cmluZyArPSAocmVzdWx0U3RyaW5nID09PSAnJyk/ICcnIDogJyYnO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0U3RyaW5nICs9IHF1ZXJ5UmVzUHJlZml4ICsgJ1snICsgcXVlcnlQYXJ0VmFsdWVLZXkgKyAnXT0nICsgcXVlcnlTdHJpbmcuZXNjYXBlKHF1ZXJ5UGFydFZhbHVlW3F1ZXJ5UGFydFZhbHVlS2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0U3RyaW5nO1xuICB9XG5cbiAgaGFuZGxlUmVxdWVzdChjb25maWcsIHNlbGVjdG9yKSB7XG4gICAgaWYgKGNvbmZpZy5xcykge1xuICAgICAgY29uZmlnLnVybCA9IGNvbmZpZy51cmwgKyAnPycgKyB0aGlzLl9idWlsZFF1ZXJ5U3RyaW5nKGNvbmZpZy5xcyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlcXVlc3QoY29uZmlnKVxuICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHNlbGVjdG9yID8gcmVzW3NlbGVjdG9yXSA6IHJlc1xuICAgICAgICAgIHJlc29sdmUocmVzcG9uc2VEYXRhKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICd2ZXJzaW9uLycsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0V2FyZWhvdXNlcyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3dhcmVob3VzZXMvJyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBxczogcGFyYW1zXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0V2FyZWhvdXNlKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB3YXJlaG91c2VzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBkZWxldGVXYXJlaG91c2UoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHdhcmVob3VzZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBkZWxldGVXYXJlaG91c2VzKGlkcykge1xuICAgIGlmICghaWRzKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3dhcmVob3VzZXMvJyxcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICBpZHNcbiAgICB9KVxuICB9XG5cbiAgY3JlYXRlV2FyZWhvdXNlKGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICd3YXJlaG91c2VzLycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlV2FyZWhvdXNlcyhpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHdhcmVob3VzZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlV2FyZWhvdXNlcyhib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnd2FyZWhvdXNlcy8nLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZ2V0VXNlcnMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdwaWNrd2FyZS91c2Vycy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRVc2VyKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBwaWNrd2FyZS91c2Vycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0V2FyZWhvdXNlQmluTG9jYXRpb25zKHdhcmVob3VzZUlkLCBwYXJhbXMpIHtcbiAgICBpZiAoIXdhcmVob3VzZUlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHdhcmVob3VzZXMvJHt3YXJlaG91c2VJZH0vYmluTG9jYXRpb25zYCxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBxczogcGFyYW1zXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0V2FyZWhvdXNlQmluTG9jYXRpb24od2FyZWhvdXNlSWQsIGlkKSB7XG4gICAgaWYgKCF3YXJlaG91c2VJZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB3YXJlaG91c2VzLyR7d2FyZWhvdXNlSWR9L2JpbkxvY2F0aW9ucy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgdXBkYXRlV2FyZWhvdXNlQmluTG9jYXRpb24od2FyZWhvdXNlSWQsIGlkLCBib2R5KSB7XG4gICAgaWYgKCF3YXJlaG91c2VJZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgd2FyZWhvdXNlcy8ke3dhcmVob3VzZUlkfS9iaW5Mb2NhdGlvbnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgY3JlYXRlV2FyZWhvdXNlQmluTG9jYXRpb24od2FyZWhvdXNlSWQsIGJvZHkpIHtcbiAgICBpZiAoIXdhcmVob3VzZUlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB3YXJlaG91c2VzLyR7d2FyZWhvdXNlSWR9L2JpbkxvY2F0aW9uc2AsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlV2FyZWhvdXNlQmluTG9jYXRpb24od2FyZWhvdXNlSWQsIGlkKSB7XG4gICAgaWYgKCF3YXJlaG91c2VJZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB3YXJlaG91c2VzLyR7d2FyZWhvdXNlSWR9L2JpbkxvY2F0aW9ucy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG4gIGRlbGV0ZVdhcmVob3VzZUJpbkxvY2F0aW9ucyh3YXJlaG91c2VJZCwgaWRzKSB7XG4gICAgaWYgKCF3YXJlaG91c2VJZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFpZHMpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgd2FyZWhvdXNlcy8ke3dhcmVob3VzZUlkfS9iaW5Mb2NhdGlvbnMvYCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICBpZHNcbiAgICB9KVxuICB9XG5cbiAgcmVsb2NhdGVWYXJpYW50U3RvY2sodmFyaWFudElkLCBib2R5KSB7XG4gICAgaWYgKCF2YXJpYW50SWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHZhcmlhbnRzLyR7dmFyaWFudElkfS9yZWxvY2F0aW9ucy9gLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIGNoYW5nZVZhcmlhbnRTdG9jayh2YXJpYW50SWQsIGJvZHkpIHtcbiAgICBpZiAoIXZhcmlhbnRJZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgdmFyaWFudHMvJHt2YXJpYW50SWR9L3N0b2NrYCxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBvdmVyd3JpdGVWYXJpYW50U3RvY2sodmFyaWFudElkLCBib2R5KSB7XG4gICAgaWYgKCF2YXJpYW50SWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHZhcmlhbnRzLyR7dmFyaWFudElkfS9zdG9ja3Rha2VzYCxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBnZXRTdXBwbGllcnMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdzdXBwbGllcnMvJyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBxczogcGFyYW1zXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0U3VwcGxpZXIoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHN1cHBsaWVycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZGVsZXRlU3VwcGxpZXIoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHN1cHBsaWVycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG4gIGRlbGV0ZVN1cHBsaWVycyhpZHMpIHtcbiAgICBpZiAoIWlkcykge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdzdXBwbGllcnMvJyxcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICBpZHNcbiAgICB9KVxuICB9XG5cbiAgY3JlYXRlU3VwcGxpZXIoYm9keSkge1xuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3N1cHBsaWVycy8nLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZVN1cHBsaWVyKGlkLCBib2R5KSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgc3VwcGxpZXJzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZVN1cHBsaWVycyhib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnc3VwcGxpZXJzLycsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpY2t3YXJlXG4iXX0=