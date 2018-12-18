var CrudApp = artifacts.require('./CrudApp.sol')

contract('CrudApp', function () {

  it('should insert new user', function () {
    var crudInstance

    return CrudApp.deployed().then(function (instance) {
      crudInstance = instance

      return crudInstance.insert('USA1', 'Trumpq', 30000000)
      //const country = await crudInstance.getCountry('USA')
      // assert.equal(country[0], 'USA')
      // assert.equal(country[1], 'Trump')
      // assert.equal(country[2].toNumber(), 30000000)
      // await crudInstance.updateLeader('USA', 'Hillary')
      // const country1 = await crudInstance.getCountry('USA')
      // assert.equal(country1[0], 'USA')
      // assert.equal(country1[1], 'Hillary')
      // assert.equal(country1[2].toNumber(), 30000000)
      // await crudInstance.deleteCountry('USA')
      // const total = await crudInstance.getTotalCountries()
      // assert.equal(total, 0)
    })

  })

  it('should get total Country', function () {
    var crudInstance
    var total

    return CrudApp.deployed().then(function (instance) {
      crudInstance = instance

      return total = crudInstance.getTotalCountries()
    })

  })

})
