import React from 'react';
import './CheckboxTree.css';

const CheckboxTree = ({ filterDependencies, filterIds, filterOptions, onSave, title }) => {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    setData(filterDependencies);
  }, [filterDependencies]);

  const renderTree = (nodes, level = 0) => {
    if (!nodes) return null;
    const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);

    return nodesArray.map(node => (
      <div key={node.key} style={{ marginLeft: `${level * 20}px` }}>
        <input
          type="checkbox"
          checked={node.selected}
          disabled={node.isDisabled}
          onChange={() => handleCheck(node.key, !node.selected)}
          ref={el => el && (el.indeterminate = node.indeterminate)}
        />
        <span onClick={() => toggleNode(node.key)}>{node.isExpanded ? '[-]' : '[+]'}</span>
        <span>{node.name}</span>
        {node.isExpanded && node.children && renderTree(node.children, level + 1)}
      </div>
    ));
  };

  const toggleNode = (key) => {
    const newData = { ...data };

    const findAndToggle = (nodes) => {
      if (!nodes) return;
      const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);

      for (const node of nodesArray) {
        if (node.key === key) {
          node.isExpanded = !node.isExpanded;
          return;
        }
        if (node.children) {
          findAndToggle(node.children);
        }
      }
    };

    for (const key in newData[0]) {
      findAndToggle(newData[0][key]);
    }

    setData(newData);
  };

  const handleCheck = (key, isSelected) => {
    const newData = { ...data };

    const findAndUpdate = (nodes) => {
      if (!nodes) return;
      const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);

      for (const node of nodesArray) {
        if (node.key === key) {
          node.selected = isSelected;
          if (node.children) {
            selectAllChildren(node.children, isSelected);
          }
          return;
        }
        if (node.children) {
          findAndUpdate(node.children);
        }
      }
    };

    const selectAllChildren = (children, isSelected) => {
      if (!children) return;
      const childrenArray = Array.isArray(children) ? children : Object.values(children);

      for (const child of childrenArray) {
        if (!child.isDisabled) {
          child.selected = isSelected;
          if (child.children) {
            selectAllChildren(child.children, isSelected);
          }
        }
      }
    };

    for (const topLevelKey in newData[0]) {
      findAndUpdate(newData[0][topLevelKey]);
    }

    // TODO: Update parent state and second column
    updateParentState(newData);
    updateSecondColumn(newData);
    setData(newData);
  }

  const updateParentState = (data) => {
    // This function will recursively update the parent's selected state
    // based on the selected state of its children.
    const update = (nodes) => {
        if (!nodes) return [false, false]; // [allSelected, someSelected]
        const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);

        let allSelected = true;
        let someSelected = false;

        for (const node of nodesArray) {
            if (node.children && node.children.length > 0) {
                const [allChildrenSelected, someChildrenSelected] = update(node.children);
                node.selected = allChildrenSelected;
                node.indeterminate = !allChildrenSelected && someChildrenSelected;
            }
            if (node.selected) {
                someSelected = true;
            } else {
                allSelected = false;
            }
        }
        return [allSelected, someSelected];
    };

    for (const topLevelKey in data[0]) {
        update(data[0][topLevelKey]);
    }
  };

  const updateSecondColumn = (data) => {
    // This function will update the second column based on the selections
    // in the first column.
    const selectedCities = new Set();
    const firstColumnKey = filterIds[0].split('-')[0];
    const firstColumn = data[0][firstColumnKey];

    const getSelectedCities = (nodes) => {
        if (!nodes) return;
        const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
        for (const node of nodesArray) {
            if (node.selected && node.key.includes('city')) {
                selectedCities.add(node.key);
            }
            if (node.children) {
                getSelectedCities(node.children);
            }
        }
    };

    getSelectedCities(firstColumn);

    const secondColumnKey = filterIds[1].split('-')[0];
    const secondColumn = data[0][secondColumnKey];

    const updateNodes = (nodes) => {
        if (!nodes) return;
        const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
        for (const node of nodesArray) {
            if (node.ancestorCities && [...node.ancestorCities].some(city => selectedCities.has(city))) {
                node.selected = true;
            } else {
                node.selected = false;
            }
            if (node.children) {
                updateNodes(node.children);
            }
        }
    };
    updateNodes(secondColumn);
  }

  const getTopLevelData = (filterId) => {
    const topLevelKey = filterId.split('-')[0];
    if (data && data.length > 0 && data[0] && data[0][topLevelKey]) {
      return data[0][topLevelKey];
    }
    return [];
  }

  return (
    <div className="checkbox-tree">
      <h2>{title}</h2>
      <div className="columns">
        {filterIds.map(filterId => (
          <div key={filterId} className="column">
            <h3>{filterOptions.find(opt => opt.key === filterId)?.title}</h3>
            {renderTree(getTopLevelData(filterId))}
          </div>
        ))}
      </div>
      <button onClick={() => onSave(data)}>Save</button>
    </div>
  );
};

export default CheckboxTree;
