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

var Shopware = function () {
  function Shopware(options) {
    _classCallCheck(this, Shopware);

    if (!options) {
      console.error('No host, user or api key found.');
    }

    this.host = options.host;
    this.user = options.user;
    this.apiKey = options.apiKey;

    this.request = request.defaults({
      baseUrl: this.host + '/api/',
      timeout: 30000,
      json: true,
      headers: {
        'User-Agent': 'Shopware API Client',
        'Content-Type': 'application/json; charset=utf-8'
      },
      auth: {
        user: this.user,
        pass: this.apiKey,
        sendImmediately: false
      }
    });
  }

  _createClass(Shopware, [{
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
    key: 'getArticles',
    value: function getArticles(params) {
      return this.handleRequest({
        url: 'articles/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getArticle',
    value: function getArticle(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'articles/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'deleteArticle',
    value: function deleteArticle(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'articles/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'deleteArticles',
    value: function deleteArticles(ids) {
      if (!ids) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'articles/',
        method: 'DELETE',
        ids: ids
      });
    }
  }, {
    key: 'createArticle',
    value: function createArticle(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'articles/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateArticle',
    value: function updateArticle(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'articles/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'updateArticles',
    value: function updateArticles(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'articles/',
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'getCategories',
    value: function getCategories(params) {
      return this.handleRequest({
        url: 'categories/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCategory',
    value: function getCategory(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'categories/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createCategory',
    value: function createCategory(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'categories/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateCategory',
    value: function updateCategory(id, body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'categories/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteCategory',
    value: function deleteCategory(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'categories/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getVariants',
    value: function getVariants(params) {
      return this.handleRequest({
        url: 'variants/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getVariant',
    value: function getVariant(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'variants/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'updateVariant',
    value: function updateVariant(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'variants/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'createVariant',
    value: function createVariant(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'variants/' + id,
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'deleteVariant',
    value: function deleteVariant(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'variants/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'deleteVariants',
    value: function deleteVariants(ids) {
      if (!ids) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'variants/',
        method: 'DELETE',
        ids: ids
      });
    }
  }, {
    key: 'generateArticleImages',
    value: function generateArticleImages(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'generateArticleImages/' + id,
        method: 'PUT'
      });
    }
  }, {
    key: 'listMedia',
    value: function listMedia(params) {
      return this.handleRequest({
        url: 'media/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getMedia',
    value: function getMedia(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'media/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createMedia',
    value: function createMedia(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'media/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'deleteMedia',
    value: function deleteMedia(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'media/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getOrders',
    value: function getOrders(params) {
      return this.handleRequest({
        url: 'orders/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getOrder',
    value: function getOrder(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'orders/' + id,
        method: 'GET'
      });
    }
  }, {
    key: 'updateOrder',
    value: function updateOrder(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'orders/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'getAddresses',
    value: function getAddresses(params) {
      return this.handleRequest({
        url: 'addresses/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'createAddress',
    value: function createAddress(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'addresses/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateAddress',
    value: function updateAddress(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'addresses/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteAddress',
    value: function deleteAddress(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'addresses/' + id,
        method: 'DELETE'
      }, 'data');
    }
  }, {
    key: 'getCustomers',
    value: function getCustomers(params) {
      return this.handleRequest({
        url: 'customers/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCustomer',
    value: function getCustomer(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'customers/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createCustomer',
    value: function createCustomer(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'customers/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateCustomer',
    value: function updateCustomer(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'customers/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteCustomer',
    value: function deleteCustomer(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'customers/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getCaches',
    value: function getCaches(params) {
      return this.handleRequest({
        url: 'caches/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCache',
    value: function getCache(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'caches/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'deleteCache',
    value: function deleteCache(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'caches/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'deleteCaches',
    value: function deleteCaches() {
      return this.handleRequest({
        url: 'caches/',
        method: 'DELETE'
      });
    }
  }, {
    key: 'getCountries',
    value: function getCountries(params) {
      return this.handleRequest({
        url: 'countries/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCountry',
    value: function getCountry(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'countries/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createCountry',
    value: function createCountry(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'countries/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateCountry',
    value: function updateCountry(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'countries/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteCountry',
    value: function deleteCountry(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'countries/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getCustomerGroups',
    value: function getCustomerGroups(params) {
      return this.handleRequest({
        url: 'customerGroups/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCustomerGroup',
    value: function getCustomerGroup(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'customerGroups/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createCustomerGroup',
    value: function createCustomerGroup(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'customerGroups/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateCustomerGroup',
    value: function updateCustomerGroup(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'customerGroups/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteCustomerGroup',
    value: function deleteCustomerGroup(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'customerGroups/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getManufacturers',
    value: function getManufacturers(params) {
      return this.handleRequest({
        url: 'manufacturers/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getManufacturer',
    value: function getManufacturer(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'manufacturers/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createManufacturer',
    value: function createManufacturer(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'manufacturers/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateManufacturer',
    value: function updateManufacturer(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'manufacturers/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteManufacturer',
    value: function deleteManufacturer(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'manufacturers/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getPropertyGroups',
    value: function getPropertyGroups(params) {
      return this.handleRequest({
        url: 'propertyGroups/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getPropertyGroup',
    value: function getPropertyGroup(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'propertyGroups/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createPropertyGroup',
    value: function createPropertyGroup(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'propertyGroups/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updatePropertyGroup',
    value: function updatePropertyGroup(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'propertyGroups/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deletePropertyGroup',
    value: function deletePropertyGroup(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'propertyGroups/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getShops',
    value: function getShops(params) {
      return this.handleRequest({
        url: 'shops/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getShop',
    value: function getShop(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'shops/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createShop',
    value: function createShop(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'shops/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateShop',
    value: function updateShop(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'shops/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteShop',
    value: function deleteShop(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'shops/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getTranslations',
    value: function getTranslations(params) {
      return this.handleRequest({
        url: 'translations/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getTranslation',
    value: function getTranslation(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'translations/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createTranslation',
    value: function createTranslation(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'translations/' + id,
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateTranslation',
    value: function updateTranslation(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'translations/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteTranslation',
    value: function deleteTranslation(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'translations/' + id,
        method: 'DELETE'
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

  return Shopware;
}();

module.exports = Shopware;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVlc3QiLCJyZXF1aXJlIiwicXVlcnlTdHJpbmciLCJFUlJPUiIsIk1JU1NJTkdfSUQiLCJjb2RlIiwibWVzc2FnZSIsIk1JU1NJTkdfQk9EWSIsImhhbmRsZUVycm9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJlcnIiLCJTaG9wd2FyZSIsIm9wdGlvbnMiLCJjb25zb2xlIiwiZXJyb3IiLCJob3N0IiwidXNlciIsImFwaUtleSIsImRlZmF1bHRzIiwiYmFzZVVybCIsInRpbWVvdXQiLCJqc29uIiwiaGVhZGVycyIsImF1dGgiLCJwYXNzIiwic2VuZEltbWVkaWF0ZWx5IiwicXVlcnlBcnJheSIsInJlc3VsdFN0cmluZyIsInF1ZXJ5UGFydE5hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsInF1ZXJ5UGFydFZhbHVlcyIsImZvckVhY2giLCJxdWVyeVBhcnRWYWx1ZSIsInF1ZXJ5UGFydEluZGV4IiwicXVlcnlSZXNQcmVmaXgiLCJxdWVyeVBhcnRWYWx1ZUtleSIsImVzY2FwZSIsImNvbmZpZyIsInNlbGVjdG9yIiwicXMiLCJ1cmwiLCJfYnVpbGRRdWVyeVN0cmluZyIsInRoZW4iLCJyZXNwb25zZURhdGEiLCJyZXMiLCJjYXRjaCIsImhhbmRsZVJlcXVlc3QiLCJtZXRob2QiLCJwYXJhbXMiLCJpZCIsImlkcyIsImJvZHkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFNQSxVQUFVQyxRQUFRLHdCQUFSLENBQWhCO0FBQUEsSUFDTUMsY0FBY0QsUUFBUSxhQUFSLENBRHBCOztBQUdBLElBQU1FLFFBQVE7QUFDWkMsY0FBWTtBQUNWQyxVQUFNLFlBREk7QUFFVkMsYUFBUztBQUZDLEdBREE7QUFLWkMsZ0JBQWM7QUFDWkYsVUFBTSxjQURNO0FBRVpDLGFBQVM7QUFGRztBQUxGLENBQWQ7O0FBV0EsSUFBTUUsY0FBYyxTQUFkQSxXQUFjO0FBQUEsU0FBTyxJQUFJQyxP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O0FBR3hCSTtBQUh3QixPQUFuQixDQUFQO0FBS0Q7Ozs7OztBQUlIQyxPQUFPQyxPQUFQLEdBQWlCMUMsUUFBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdC1wcm9taXNlLW5hdGl2ZScpLFxuICAgICAgcXVlcnlTdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuXG5jb25zdCBFUlJPUiA9IHtcbiAgTUlTU0lOR19JRDoge1xuICAgIGNvZGU6ICdtaXNzaW5nX2lkJyxcbiAgICBtZXNzYWdlOiAnTWlzc2luZyBgaWRgIHBhcmFtZXRlcidcbiAgfSxcbiAgTUlTU0lOR19CT0RZOiB7XG4gICAgY29kZTogJ21pc3NpbmdfYm9keScsXG4gICAgbWVzc2FnZTogJ01pc3NpbmcgYSBwcm9wZXIgYGJvZHlgIHBhcmFtZXRlcidcbiAgfVxufVxuXG5jb25zdCBoYW5kbGVFcnJvciA9IGVyciA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZWplY3QoZXJyKSlcblxuY2xhc3MgU2hvcHdhcmUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdObyBob3N0LCB1c2VyIG9yIGFwaSBrZXkgZm91bmQuJylcbiAgICB9XG5cbiAgICB0aGlzLmhvc3QgPSBvcHRpb25zLmhvc3RcbiAgICB0aGlzLnVzZXIgPSBvcHRpb25zLnVzZXJcbiAgICB0aGlzLmFwaUtleSA9IG9wdGlvbnMuYXBpS2V5XG5cbiAgICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0LmRlZmF1bHRzKHtcbiAgICAgIGJhc2VVcmw6IHRoaXMuaG9zdCArICcvYXBpLycsXG4gICAgICB0aW1lb3V0OiAzMDAwMCxcbiAgICAgIGpzb246IHRydWUsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdVc2VyLUFnZW50JzogJ1Nob3B3YXJlIEFQSSBDbGllbnQnLFxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXG4gICAgICB9LFxuICAgICAgYXV0aDoge1xuICAgICAgICB1c2VyOiB0aGlzLnVzZXIsXG4gICAgICAgIHBhc3M6IHRoaXMuYXBpS2V5LFxuICAgICAgICBzZW5kSW1tZWRpYXRlbHk6IGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIF9idWlsZFF1ZXJ5U3RyaW5nIChxdWVyeUFycmF5KSB7XG4gICAgbGV0IHJlc3VsdFN0cmluZyA9ICcnO1xuICAgIGZvciAodmFyIHF1ZXJ5UGFydE5hbWUgaW4gcXVlcnlBcnJheSkge1xuICAgICAgaWYgKHF1ZXJ5QXJyYXkuaGFzT3duUHJvcGVydHkocXVlcnlQYXJ0TmFtZSkpIHtcbiAgICAgICAgY29uc3QgcXVlcnlQYXJ0VmFsdWVzID0gcXVlcnlBcnJheVtxdWVyeVBhcnROYW1lXTtcbiAgICAgICAgc3dpdGNoIChxdWVyeVBhcnROYW1lKSB7XG4gICAgICAgICAgY2FzZSAnZmlsdGVyJzpcbiAgICAgICAgICAgIHF1ZXJ5UGFydFZhbHVlcy5mb3JFYWNoKChxdWVyeVBhcnRWYWx1ZSwgcXVlcnlQYXJ0SW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgcXVlcnlSZXNQcmVmaXggPSBxdWVyeVBhcnROYW1lICsgJ1snICsgcXVlcnlQYXJ0SW5kZXggKyAnXSdcbiAgICAgICAgICAgICAgZm9yICh2YXIgcXVlcnlQYXJ0VmFsdWVLZXkgaW4gcXVlcnlQYXJ0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAocXVlcnlQYXJ0VmFsdWUuaGFzT3duUHJvcGVydHkocXVlcnlQYXJ0VmFsdWVLZXkpKSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHRTdHJpbmcgKz0gKHJlc3VsdFN0cmluZyA9PT0gJycpPyAnJyA6ICcmJztcbiAgICAgICAgICAgICAgICAgIHJlc3VsdFN0cmluZyArPSBxdWVyeVJlc1ByZWZpeCArICdbJyArIHF1ZXJ5UGFydFZhbHVlS2V5ICsgJ109JyArIHF1ZXJ5U3RyaW5nLmVzY2FwZShxdWVyeVBhcnRWYWx1ZVtxdWVyeVBhcnRWYWx1ZUtleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFN0cmluZztcbiAgfVxuXG4gIGhhbmRsZVJlcXVlc3QoY29uZmlnLCBzZWxlY3Rvcikge1xuICAgIGlmIChjb25maWcucXMpIHtcbiAgICAgIGNvbmZpZy51cmwgPSBjb25maWcudXJsICsgJz8nICsgdGhpcy5fYnVpbGRRdWVyeVN0cmluZyhjb25maWcucXMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZXF1ZXN0KGNvbmZpZylcbiAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICBjb25zdCByZXNwb25zZURhdGEgPSBzZWxlY3RvciA/IHJlc1tzZWxlY3Rvcl0gOiByZXNcbiAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlRGF0YSlcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVyci5tZXNzYWdlKVxuICAgICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB2ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAndmVyc2lvbi8nLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldEFydGljbGVzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnYXJ0aWNsZXMvJyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBxczogcGFyYW1zXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0QXJ0aWNsZShpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgYXJ0aWNsZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGRlbGV0ZUFydGljbGUoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGFydGljbGVzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlQXJ0aWNsZXMoaWRzKSB7XG4gICAgaWYgKCFpZHMpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnYXJ0aWNsZXMvJyxcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICBpZHNcbiAgICB9KVxuICB9XG5cbiAgY3JlYXRlQXJ0aWNsZShib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnYXJ0aWNsZXMvJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVBcnRpY2xlKGlkLCBib2R5KSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgYXJ0aWNsZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlQXJ0aWNsZXMoYm9keSkge1xuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2FydGljbGVzLycsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBnZXRDYXRlZ29yaWVzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnY2F0ZWdvcmllcy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRDYXRlZ29yeShpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgY2F0ZWdvcmllcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgY3JlYXRlQ2F0ZWdvcnkoYm9keSkge1xuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2NhdGVnb3JpZXMvJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVDYXRlZ29yeShpZCwgYm9keSkge1xuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGNhdGVnb3JpZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlQ2F0ZWdvcnkoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGNhdGVnb3JpZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBnZXRWYXJpYW50cyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3ZhcmlhbnRzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldFZhcmlhbnQoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHZhcmlhbnRzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICB1cGRhdGVWYXJpYW50KGlkLCBib2R5KSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgdmFyaWFudHMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgY3JlYXRlVmFyaWFudChpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHZhcmlhbnRzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVWYXJpYW50KGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB2YXJpYW50cy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG4gIGRlbGV0ZVZhcmlhbnRzKGlkcykge1xuICAgIGlmICghaWRzKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHZhcmlhbnRzL2AsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgaWRzXG4gICAgfSlcbiAgfVxuXG4gIGdlbmVyYXRlQXJ0aWNsZUltYWdlcyhpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgZ2VuZXJhdGVBcnRpY2xlSW1hZ2VzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICB9KVxuICB9XG5cbiAgbGlzdE1lZGlhKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnbWVkaWEvJyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBxczogcGFyYW1zXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0TWVkaWEoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYG1lZGlhLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBjcmVhdGVNZWRpYShib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnbWVkaWEvJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVNZWRpYShpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgbWVkaWEvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBnZXRPcmRlcnMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdvcmRlcnMvJyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBxczogcGFyYW1zXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0T3JkZXIoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYG9yZGVycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZU9yZGVyKGlkLCBib2R5KSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgb3JkZXJzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIGdldEFkZHJlc3NlcyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2FkZHJlc3Nlcy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBjcmVhdGVBZGRyZXNzKGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdhZGRyZXNzZXMvJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVBZGRyZXNzKGlkLCBib2R5KSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgYWRkcmVzc2VzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIGRlbGV0ZUFkZHJlc3MoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGFkZHJlc3Nlcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0Q3VzdG9tZXJzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnY3VzdG9tZXJzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldEN1c3RvbWVyKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjdXN0b21lcnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGNyZWF0ZUN1c3RvbWVyKGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdjdXN0b21lcnMvJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVDdXN0b21lcihpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGN1c3RvbWVycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVDdXN0b21lcihpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgY3VzdG9tZXJzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZ2V0Q2FjaGVzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnY2FjaGVzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldENhY2hlKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjYWNoZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGRlbGV0ZUNhY2hlKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjYWNoZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBkZWxldGVDYWNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdjYWNoZXMvJyxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZ2V0Q291bnRyaWVzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnY291bnRyaWVzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldENvdW50cnkoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGNvdW50cmllcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgY3JlYXRlQ291bnRyeShib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnY291bnRyaWVzLycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlQ291bnRyeShpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGNvdW50cmllcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVDb3VudHJ5KGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjb3VudHJpZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBnZXRDdXN0b21lckdyb3VwcyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2N1c3RvbWVyR3JvdXBzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldEN1c3RvbWVyR3JvdXAoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGN1c3RvbWVyR3JvdXBzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBjcmVhdGVDdXN0b21lckdyb3VwKGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdjdXN0b21lckdyb3Vwcy8nLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZUN1c3RvbWVyR3JvdXAoaWQsIGJvZHkpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjdXN0b21lckdyb3Vwcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVDdXN0b21lckdyb3VwKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjdXN0b21lckdyb3Vwcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG4gIGdldE1hbnVmYWN0dXJlcnMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdtYW51ZmFjdHVyZXJzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldE1hbnVmYWN0dXJlcihpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgbWFudWZhY3R1cmVycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgY3JlYXRlTWFudWZhY3R1cmVyKGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdtYW51ZmFjdHVyZXJzLycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlTWFudWZhY3R1cmVyKGlkLCBib2R5KSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgbWFudWZhY3R1cmVycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVNYW51ZmFjdHVyZXIoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYG1hbnVmYWN0dXJlcnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBnZXRQcm9wZXJ0eUdyb3VwcyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3Byb3BlcnR5R3JvdXBzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldFByb3BlcnR5R3JvdXAoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHByb3BlcnR5R3JvdXBzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBjcmVhdGVQcm9wZXJ0eUdyb3VwKGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdwcm9wZXJ0eUdyb3Vwcy8nLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZVByb3BlcnR5R3JvdXAoaWQsIGJvZHkpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBwcm9wZXJ0eUdyb3Vwcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVQcm9wZXJ0eUdyb3VwKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBwcm9wZXJ0eUdyb3Vwcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG4gIGdldFNob3BzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnc2hvcHMvJyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBxczogcGFyYW1zXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0U2hvcChpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgc2hvcHMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGNyZWF0ZVNob3AoYm9keSkge1xuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3Nob3BzLycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlU2hvcChpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHNob3BzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIGRlbGV0ZVNob3AoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHNob3BzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZ2V0VHJhbnNsYXRpb25zKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAndHJhbnNsYXRpb25zLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldFRyYW5zbGF0aW9uKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB0cmFuc2xhdGlvbnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGNyZWF0ZVRyYW5zbGF0aW9uKGlkLCBib2R5KSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgdHJhbnNsYXRpb25zLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVUcmFuc2xhdGlvbihpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHRyYW5zbGF0aW9ucy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVUcmFuc2xhdGlvbihpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgdHJhbnNsYXRpb25zLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZ2V0U3VwcGxpZXJzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnc3VwcGxpZXJzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldFN1cHBsaWVyKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBzdXBwbGllcnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGRlbGV0ZVN1cHBsaWVyKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBzdXBwbGllcnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBkZWxldGVTdXBwbGllcnMoaWRzKSB7XG4gICAgaWYgKCFpZHMpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnc3VwcGxpZXJzLycsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgaWRzXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZVN1cHBsaWVyKGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdzdXBwbGllcnMvJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVTdXBwbGllcihpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHN1cHBsaWVycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVTdXBwbGllcnMoYm9keSkge1xuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3N1cHBsaWVycy8nLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaG9wd2FyZVxuIl19