import React from 'react';
import './App.css';
import CheckboxTree from './components/CheckboxTree/CheckboxTree';

const filterDependencies = [
  {
    countries: {
      country1: {
        key: 'country1',
        name: 'Country #1',
        selected: false,
        isExpanded: true,
        isDisabled: false,
        childrenCities: ['city1-country1', 'city2-country1'],
        children: [
          {
            key: 'city1-country1',
            name: 'City 1 of Country 1',
            ancestorCountries: new Set(['country1']),
            selected: false,
            isDisabled: false,
            childrenCompanies: ['company1-city1-country1'],
            children: [],
          },
          {
            key: 'city2-country1',
            name: 'City 2 of Country 1',
            ancestorCountries: new Set(['country1']),
            selected: false,
            isDisabled: false,
            childrenCompanies: [],
            children: [],
          },
        ],
      },
      country2: {
        key: 'country2',
        name: 'Country #2',
        selected: false,
        isExpanded: false,
        isDisabled: false,
        childrenCities: ['city1-country2'],
        children: [
          {
            key: 'city1-country2',
            name: 'City 1 of Country 2',
            ancestorCountries: new Set(['country2']),
            selected: false,
            isDisabled: false,
            childrenCompanies: [],
            children: [],
          },
        ],
      },
    },
    companies: {
      company1: {
        key: 'company1-city1-country1',
        name: 'Company #1',
        selected: false,
        isDisabled: false,
        ancestorCities: new Set(['city1-country1']),
        ancestorCountries: new Set(['country1']),
        childrenBranches: [],
        children: [],
      },
      company2: {
        key: 'company2',
        name: 'Company #2',
        selected: false,
        isDisabled: true,
        ancestorCities: new Set(['city1-country1']),
        ancestorCountries: new Set(['country1']),
        childrenBranches: [],
        children: [],
      },
    },
  },
];

const filterOptions = [
  { key: 'country-city', title: 'Country and Cities' },
  { key: 'company-branch', title: 'Company and Branches' },
];

const filterIds = ['country-city', 'company-branch'];

function App() {
  const handleSave = (data) => {
    console.log('Saved data:', data);
  };

  return (
    <div className="App">
      <CheckboxTree
        filterDependencies={filterDependencies}
        filterIds={filterIds}
        filterOptions={filterOptions}
        onSave={handleSave}
        title="Filter Dependencies"
      />
    </div>
  );
}

export default App;
