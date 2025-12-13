import { Input, Space, Button, InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useRef, useState } from 'react';

export const useColumnSearch = <T extends object>() => {
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<keyof T | ''>('');

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: keyof T,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: keyof T,
    enableSort: boolean = true,
  ): Partial<ColumnType<T>> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button type="link" size="small" onClick={close}>
            Close
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),

    onFilter: (value, record) =>
      String(record[dataIndex] ?? '')
        .toLowerCase()
        .includes(String(value).toLowerCase()),

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? String(text) : ''}
        />
      ) : (
        text
      ),

    ...(enableSort && {
      sorter: (a, b) =>
        String(a[dataIndex] ?? '').localeCompare(String(b[dataIndex] ?? '')),
      sortDirections: ['ascend', 'descend'],
    }),
  });

  return { getColumnSearchProps };
};
