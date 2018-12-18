pragma solidity ^0.4.17;

contract CrudApp {

    struct country {
        string name;
        string leader;
        uint256 population;
    }

    uint[] xs;

    country[] public countries;

    uint256 public totalCountries;

    constructor() public {
        totalCountries = 0;
    }

    event CountryEvent(string countryName, string leader, uint256 population);
    event LeaderUpdated(string countryName, string leader);
    event CountryDelete(string countryName);


    function doInsert(string countryName, string leader, uint256 population) public returns (uint256 total){
        country memory newCountry = country(countryName, leader, population);
        countries.push(newCountry);
        totalCountries++;

        emit CountryEvent(countryName, leader, population);
        return total;
    }

    function doUpdateLeader(string countryName, string newLeader) public returns (bool success){
        for (uint256 i = 0; i < totalCountries; i++) {
            if (compareStrings(countries[i].name, countryName)) {
                countries[i].leader = newLeader;
                emit LeaderUpdated(countryName, newLeader);
                return true;
            }
        }
        return false;
    }

    function doDeleteCountry(string countryName) public returns (bool success){
        require(totalCountries > 0);
        for (uint256 i = 0; i < totalCountries; i++) {
            if (compareStrings(countries[i].name, countryName)) {
                countries[i] = countries[totalCountries - 1];
                delete countries[totalCountries - 1];
                totalCountries--;
                countries.length--;
                emit CountryDelete(countryName);
                return true;
            }
        }
        return false;
    }


    function getOneByCountryName(string countryName) public view returns (string name, string leader, uint256 population){
        for (uint256 i = 0; i < totalCountries; i++) {
            if (compareStrings(countries[i].name, countryName)) {
                return (countries[i].name, countries[i].leader, countries[i].population);
            }
        }
        revert('country not found');
    }

    function getOneById(uint id) public view returns (string name, string leader, uint256 population){
        return (countries[id].name, countries[id].leader, countries[id].population);

    }


    function compareStrings(string a, string b) internal pure returns (bool){
        return keccak256(a) == keccak256(b);
    }


    function getTotalCountries() public view returns (uint256 length){
        return countries.length;
    }

    function A() {
        xs.push(100);
        xs.push(200);
        xs.push(300);
    }

    function getMany() public view returns (uint[]) {
        for (uint256 i = 0; i < totalCountries; i++) {
            xs.push(i);
        }

        return xs;
    }

}
