const request = require('request-promise-native'),
      queryString = require('querystring');

const ERROR = {
  MISSING_ID: {
    code: 'missing_id',
    message: 'Missing `id` parameter'
  },
  MISSING_BODY: {
    code: 'missing_body',
    message: 'Missing a proper `body` parameter'
  }
}

const handleError = err => new Promise((resolve, reject) => reject(err))

class Pickware {
  constructor(options) {
    if (!options) {
      console.error('No host, user or api key found.')
    }

    this.host = options.host
    this.user = options.user
    this.apiKey = options.apiKey
    this.deviceUuid = options.deviceUuid
    this.apiVersion = options.apiVersion || '2017-06-08'

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
    })
  }

  _buildQueryString (queryArray) {
    let resultString = '';
    for (var queryPartName in queryArray) {
      if (queryArray.hasOwnProperty(queryPartName)) {
        const queryPartValues = queryArray[queryPartName];
        switch (queryPartName) {
          case 'filter':
            queryPartValues.forEach((queryPartValue, queryPartIndex) => {
              const queryResPrefix = queryPartName + '[' + queryPartIndex + ']'
              for (var queryPartValueKey in queryPartValue) {
                if (queryPartValue.hasOwnProperty(queryPartValueKey)) {
                  resultString += (resultString === '')? '' : '&';
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

  handleRequest(config, selector) {
    if (config.qs) {
      config.url = config.url + '?' + this._buildQueryString(config.qs);
    }
    return new Promise((resolve, reject) => {
      this.request(config)
        .then(res => {
          const responseData = selector ? res[selector] : res
          resolve(responseData)
        })
        .catch(err => {
          reject(err.message)
        })
    })
  }

  version() {
    return this.handleRequest({
      url: 'version/',
      method: 'GET'
    }, 'data')
  }

  getWarehouses(params) {
    return this.handleRequest({
      url: 'warehouses/',
      method: 'GET',
      qs: params
    }, 'data')
  }

  getWarehouse(id) {
    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `warehouses/${id}`,
      method: 'GET'
    }, 'data')
  }

  deleteWarehouse(id) {
    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `warehouses/${id}`,
      method: 'DELETE'
    })
  }

  deleteWarehouses(ids) {
    if (!ids) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: 'warehouses/',
      method: 'DELETE',
      ids
    })
  }

  createWarehouse(body) {
    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: 'warehouses/',
      method: 'POST',
      body
    })
  }

  updateWarehouses(id, body) {
    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: `warehouses/${id}`,
      method: 'PUT',
      body
    })
  }

  updateWarehouses(body) {
    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: 'warehouses/',
      method: 'PUT',
      body
    })
  }

  getUsers(params) {
    return this.handleRequest({
      url: 'pickware/users/',
      method: 'GET',
      qs: params
    }, 'data')
  }

  getUser(id) {
    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `pickware/users/${id}`,
      method: 'GET'
    }, 'data')
  }

  getWarehouseBinLocations(warehouseId, params) {
    if (!warehouseId) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `warehouses/${warehouseId}/binLocations`,
      method: 'GET',
      qs: params
    }, 'data')
  }

  getWarehouseBinLocation(warehouseId, id) {
    if (!warehouseId) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `warehouses/${warehouseId}/binLocations/${id}`,
      method: 'GET'
    }, 'data')
  }

  updateWarehouseBinLocation(warehouseId, id, body) {
    if (!warehouseId) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: `warehouses/${warehouseId}/binLocations/${id}`,
      method: 'PUT',
      body
    })
  }

  createWarehouseBinLocation(warehouseId, body) {
    if (!warehouseId) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: `warehouses/${warehouseId}/binLocations`,
      method: 'POST',
      body
    })
  }

  deleteWarehouseBinLocation(warehouseId, id) {
    if (!warehouseId) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `warehouses/${warehouseId}/binLocations/${id}`,
      method: 'DELETE'
    })
  }

  deleteWarehouseBinLocations(warehouseId, ids) {
    if (!warehouseId) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!ids) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `warehouses/${warehouseId}/binLocations/`,
      method: 'DELETE',
      ids
    })
  }

  relocateVariantStock(variantId, body) {
    if (!variantId) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: `variants/${variantId}/relocations/`,
      method: 'POST',
      body
    })
  }

  changeVariantStock(variantId, body) {
    if (!variantId) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: `variants/${variantId}/stock`,
      method: 'POST',
      body
    })
  }

  overwriteVariantStock(variantId, body) {
    if (!variantId) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: `variants/${variantId}/stocktakes`,
      method: 'POST',
      body
    })
  }

  getSuppliers(params) {
    return this.handleRequest({
      url: 'suppliers/',
      method: 'GET',
      qs: params
    }, 'data')
  }

  getSupplier(id) {
    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `suppliers/${id}`,
      method: 'GET'
    }, 'data')
  }

  deleteSupplier(id) {
    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `suppliers/${id}`,
      method: 'DELETE'
    })
  }

  deleteSuppliers(ids) {
    if (!ids) {
      return handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: 'suppliers/',
      method: 'DELETE',
      ids
    })
  }

  createSupplier(body) {
    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: 'suppliers/',
      method: 'POST',
      body
    })
  }

  updateSupplier(id, body) {
    if (!id) {
      return handleError(ERROR.MISSING_ID)
    }

    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: `suppliers/${id}`,
      method: 'PUT',
      body
    })
  }

  updateSuppliers(body) {
    if (!body) {
      return handleError(ERROR.MISSING_BODY)
    }

    return this.handleRequest({
      url: 'suppliers/',
      method: 'PUT',
      body
    })
  }

}

module.exports = Pickware
