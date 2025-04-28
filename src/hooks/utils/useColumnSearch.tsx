import { Input, Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useRef, useState } from "react";

type DataIndex = string;
type DataType = Record<string, any>;

export const useColumnSearch = () => {
  const searchInput = useRef<Input>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    enableSort: boolean = true
  ): ColumnsType<DataType>[number] => {
    const columnConfig: ColumnsType<DataType>[number] = {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
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
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              Close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      filterDropdownProps: {
        onOpenChange(open) {
          if (open) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      },
      render: (text: any) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    };

    if (enableSort) {
      columnConfig.sorter = (a, b) => {
        const aVal = a[dataIndex];
        const bVal = b[dataIndex];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return aVal - bVal;
        }

        if (!isNaN(Date.parse(aVal)) && !isNaN(Date.parse(bVal))) {
          return new Date(aVal).getTime() - new Date(bVal).getTime();
        }

        return aVal?.toString().localeCompare(bVal?.toString());
      };

      columnConfig.sortDirections = ["ascend", "descend"];
    }

    return columnConfig;
  };

  return {
    getColumnSearchProps,
  };
};
