import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Tree, TreeSelect, Divider, Input, Button } from 'antd';
import CustomizedTreeNode from '@layout/folder_creation';
import { v4 as uuid } from 'uuid';

import './styles.less';
const treeData = [
  {
    title: 'Folder 1',
    value: '0-0',
    users: -1,
    key: uuid(),
    draft: 0,
    children: [
      {
        title: 'Folder 1-1',
        value: '0-0-1',
        key: uuid(),
        users: -1,
        draft: 0
      },
      {
        title: 'Folder 1-2',
        value: '0-0-2',
        key: uuid(),
        users: -1,
        draft: 0
      }
    ]
  },
  {
    title: 'Folder 2',
    value: '0-1',
    key: uuid(),
    users: 0,
    draft: 0
  }
];

// const { TreeNode } = TreeSelect;
const { DirectoryTree } = Tree;
const { Search } = Input;

export type StateType = {
  key: string;
  title: string;
  value: string;
  users?: any;
  draft?: any;
  children?: Array<StateType>;
};

const FolderSelection = () => {
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<Array<StateType>>(treeData);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const onChange = () => {
    setValue(value);
  };


  const addItem = useCallback(() => {
    const uid = uuid();
    const newData = {
      title: 'New Folder',
      value: uid,
      key: uid,
      users: -1,
      draft: 1
    };
    setData([newData, ...data]);
  }, [data]);

  const renderNode = (nodeData: any) => {
    return <CustomizedTreeNode setData={setData} data={data} nodeData={nodeData} />;
  };

  // const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {};

  const onDrop = useCallback(
    (info: any) => {
      // prevent drag a draft folder
      if (info.dragNode.draft === 1) {
        return;
      }
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const loop = (data: any, key: number, callback: any, vis: any) => {
        let parentVis = vis;
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data, parentVis);
          }
          if (data[i].children) {
            loop(data[i].children, key, callback, data[i].users);
          }
        }
      };
      const clonedData = [...data];

      let dragObj: any;
      loop(
        clonedData,
        dragKey,
        (item: any, index: number, arr: Array<StateType>) => {
          arr.splice(index, 1);
          dragObj = item;
        },
        null
      );

      if (!info.dropToGap) {
        loop(
          clonedData,
          dropKey,
          (item: any) => {
            item.children = item.children || [];
            item.children.unshift(dragObj);
          },
          null
        );
      } else if (
        (info.node.props.children || []).length > 0 &&
        info.node.props.expanded &&
        dropPosition === 1
      ) {
        loop(
          clonedData,
          dropKey,
          (item: any) => {
            item.children = item.children || [];
            item.children.unshift(dragObj);
          },
          null
        );
      } else {
        let ar: Array<StateType> = [];
        let i = 0;
        loop(
          clonedData,
          dropKey,
          (item: any, index: number, arr: Array<StateType>) => {
            ar = arr;
            i = index;
          },
          null
        );
        const temp: StateType = { ...dragObj };
        if (dropPosition === -1) {
          ar.splice(i, 0, temp);
        } else {
          ar.splice(i + 1, 0, temp);
        }
      }

      // let parentVis
      const loopChildren = (data: any, callback: any) => {
        for (let i = 0; i < data.length; i++) {
          callback(data[i])
          if (data[i].children) {
            loopChildren(data[i].children, callback);
          }
        }
      };

      loop(
        clonedData,
        dragKey,
        (item: any, index: number, arr: Array<StateType>, parentVis: any) => {
          if (!parentVis) {
            return;
          }
          item.users = parentVis;
          // eslint-disable-next-line
          if (item.children?.length > 0) {
            loopChildren(item.children, (childItem: any) => {
              childItem.users = parentVis;
            });
          }
        },
        null
      );

      setData(clonedData);
    },
    [data]
  );


  const dataList: { key: any; title: any; }[] = [];
  const generateList = (data: string | any[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: key });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(data);
  const getParentKey: any = useCallback((key: any, tree: string | any[]) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: { key: any; }) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  }, []);



  const onSearchChange = useCallback((e: any) => {
    const { value } = e.target;
    setSearchValue(value)
    setAutoExpandParent(true)
  }, []);

  const onSelect = (e: any) => {
  }

  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function myClickHandler() {
      setOpen(!open)
    }
    if (listRef && listRef.current) {
      listRef.current.addEventListener('click', myClickHandler)
    }

    // Passing a function that calls your function
    return () => {
      if (listRef && listRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        listRef.current.removeEventListener('click', myClickHandler)
      }
    }
    // react-hooks/exhaustive-deps
  })


  const searchRes = useMemo(() => {
    const loop = (dataArr: any) =>
      dataArr.map((item: any) => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span>{item.title}</span>
            );
        if (item.children) {
          return { ...item, title, originalTitle: item.title, key: item.key, children: loop(item.children) };
        }

        return {
          ...item,
          title,
          originalTitle: item.title,
          key: item.key,
        };
      });
    return loop(data)
  }, [data, searchValue])
  return (
    <div ref={listRef}
    >
      <TreeSelect
        id="test"
        style={{ width: '30%', marginLeft: '35%' }}
        dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
        placeholder=""
        onChange={onChange}
        value={value || 'Select Folder'}
        onSelect={onSelect}
        open={open}
        dropdownRender={menu => (
          <div>
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
              <Search style={{ paddingRight: '8px' }} placeholder="Search" onChange={onSearchChange} />
              <button
                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer', color: 'green' }}
                onClick={addItem}
              >
                Add New Folder
            </button>
            </div>
            <Divider style={{ margin: '4px 0' }} />
            <DirectoryTree
              multiple
              autoExpandParent={autoExpandParent}
              draggable
              blockNode
              onDrop={onDrop}
              className="draggable-tree"
              treeData={searchRes}
              titleRender={renderNode}
              onSelect={(e: any) => {
                const findInLoop = (data: any, callback: any, val: any) => {
                  for (let i = 0; i < data.length; i++) {
                    if (data[i].key === e[0] && data[i].draft !== 1) {
                      return callback(data[i])
                    }
                    if (data[i].children) {
                      findInLoop(data[i].children, callback, val);
                    }
                  }
                };
                let title = ''
                findInLoop(searchRes, (item: any) => {
                  title = item.originalTitle
                  setOpen(!open)
                }, e)
                setValue(title)
              }}
              key="dsads"
            />
          </div>
        )}
      />
      <div className="btn-action">
        <Button className="btn btn-cancel" type="primary">CANCEL</Button>
        <Button className="btn btn-save" type="primary">SAVE</Button>
      </div>
    </div>
  );
};

export default FolderSelection;
