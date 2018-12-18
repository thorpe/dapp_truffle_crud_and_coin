// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css';

import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract';

import metaCoinArtifact from '../../build/contracts/MetaCoin.json';
import crudAppArtifact from '../../build/contracts/CrudApp.json';

const MetaCoin = contract(metaCoinArtifact);
const CrudApp = contract(crudAppArtifact);

let accounts;
let account;

const App = {
  start: function () {
    const self = this;

    MetaCoin.setProvider(web3.currentProvider);
    CrudApp.setProvider(web3.currentProvider);

    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status');
    status.innerHTML = message;
  },

  refreshBalance: function () {
    const self = this;
    MetaCoin.deployed().then(function (instance) {
      return instance.getBalance.call(account, {from: account});
    }).then(function (value) {
      const balanceElement = document.getElementById('balance');
      balanceElement.innerHTML = value.valueOf();
    }).catch(function (e) {
      console.log(e);
      self.setStatus('Error getting balance; see log.');
    })
  },

  sendCoin: function () {
    const self = this;
    const amount = parseInt(document.getElementById('amount').value);
    const receiver = document.getElementById('receiver').value;
    this.setStatus('Initiating transaction... (please wait)');

    let meta;
    MetaCoin.deployed().then(function (instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account})
    }).then(function () {
      self.setStatus('Transaction complete!');
      self.refreshBalance();
    }).catch(function (e) {
      console.log(e);
      self.setStatus('Error sending coin; see log.');
    })
  },

  doInsert: function () {
    const self = this;
    const countryName = document.getElementById('countryName').value;
    const leader = document.getElementById('leader').value;
    const population = parseInt(document.getElementById('population').value);

    CrudApp.deployed().then(function (instance) {
      instance.doInsert(countryName, leader, population, {from: account});
      return true;
    }).then(function () {
      self.setStatus('Transaction complete!');
    }).catch(function (e) {
      console.log(e);
      self.setStatus('Error sending coin; see log.');
    })
  },

  getOneByCountryName: function () {
    const self = this;
    const countryName = document.getElementById('countryName').value;
    CrudApp.deployed().then(function (instance) {
      instance.getOneByCountryName(countryName, {from: account})
        .then(function (data) {
          console.log(data);
          $("#myTable tbody:last").append("<tr id='row_" + data[0] + "'><td>" + data[0] + "</td><td>" + data[1] + "</td><td>" + data[2].toNumber() + "</td><td><button class=\"btn btn-danger btn-sm\" id=\"getOneByCountryName\" onclick=\"App.doDeleteOneByCountryName('" + data[0] + "')\">-</button></td></tr>'");
        })
    }).then(function () {
      self.setStatus('Transaction complete!');
    }).catch(function (e) {
      console.log(e);
      self.setStatus('Error sending coin; see log.');
    })
  },

  getTotalCountry: function () {
    CrudApp.deployed().then(function (instance) {
      instance.getTotalCountries({from: account}).then(function (data) {
        alert("등록된 나라는 총 : " + data.toNumber() + "개 입니다.");
      });
      console.log(a);
    }).then(function () {
      this.setStatus('Transaction complete!');
    }).catch(function (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    })
  },

  doUpdateOneByCountryName: function () {
    const self = this;
    const countryName = document.getElementById('countryName').value;
    const leader = document.getElementById('leader').value;

    CrudApp.deployed().then(function (instance) {
      instance.doUpdateLeader(countryName, leader, {from: account});
    }).then(function () {
      self.setStatus('Transaction complete!');
    }).catch(function (e) {
      console.log(e);
      self.setStatus('Error sending coin; see log.');
    })
  },
  doDeleteOneByCountryName: function (countryName) {
    const self = this;
    CrudApp.deployed().then(function (instance) {
      instance.doDeleteCountry(countryName, {from: account});
      $("#row_" + countryName).hide();
    }).then(function () {
      self.setStatus('Transaction complete!');
    }).catch(function (e) {
      console.log(e);
      self.setStatus('Error sending coin; see log.');
    })
  },
  getMany: function () {
    const self = this;
    CrudApp.deployed().then(function (instance) {
      instance.getMany({from: account})
        .then(function (item) {
          item.forEach(function(element) {
            instance.getOneById(element, {from: account})
              .then(function (data) {
                $("#myTable tbody:last").append("<tr id='row_" + data[0] + "'><td>" + data[0] + "</td><td>" + data[1] + "</td><td>" + data[2].toNumber() + "</td><td><button class=\"btn btn-danger btn-sm\" id=\"getOneByCountryName\" onclick=\"App.doDeleteOneByCountryName('" + data[0] + "')\">-</button></td></tr>'");
              })
          });
        })
    }).then(function () {
      self.setStatus('Transaction complete!');
    }).catch(function (e) {
      console.log(e);
      self.setStatus('Error sending coin; see log.');
    })
  }
}

window.App = App;

window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
  }
  App.start();
})
