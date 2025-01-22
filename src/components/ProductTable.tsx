"use client";

import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  type Selection,
  type SortDescriptor,
} from "@heroui/react";
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

type Product = {
  id: string;
  createdAt: Date;
  name: string;
  purchased: boolean;
  producer: {
    username: string;
  };
  licenses: {
    id: string;
    price: number;
    licenseOption: {
      name: string;
    };
  }[];
};

const columns: any[] = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "PRODUCER", uid: "producer", sortable: true },
  { name: "LICENSES", uid: "licenses" },
  { name: "PURCHASED", uid: "purchased", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "createdAt",
  "producer",
  "licenses",
  "purchased",
  "actions",
];

// const dummyProducts: Product[] = Array.from({ length: 100 }, (_, index) => ({
//   id: index + 1,
//   name: `Product ${index + 1}`,
//   producer: `Producer ${index + 1}`,
//   licenses: [
//     { id: 1, licenseOption: { name: "Standard" }, price: 100 },
//     { id: 2, licenseOption: { name: "Premium" }, price: 200 },
//   ],
//   purchased: index % 2 === 0,
// }));

export default function ProductTable({ products }: { products: Product[] }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenRows, setIsOpenRows] = React.useState(false);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredProducts = [...products];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredProducts;
  }, [hasSearchFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Product, b: Product) => {
      const first = a[sortDescriptor.column as keyof Product];
      const second = b[sortDescriptor.column as keyof Product];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });

  }, [sortDescriptor, items]);

  const formatDate = (dateString: string, locale: string = "en-US") => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderCell = React.useCallback(
    (product: Product, columnKey: React.Key): React.ReactNode => {
      switch (columnKey) {
        case "id":
          return product.id;
        case "createdAt":
          return formatDate(product.createdAt.toString(), "en-US");
        case "name":
          return product.name;
        case "producer":
          return product.producer.username;
        case "licenses":
          return (
            <div>
              {product.licenses
                .sort((a, b) => a.price - b.price)
                .map((license) => (
                  <div key={license.id}>
                    {license.licenseOption.name} - {license.price}€
                  </div>
                ))}
            </div>
          );
        case "purchased":
          return product.purchased ? "Yes" : "No";
        case "actions":
          return (
            <div className="flex justify-center items-center gap-2">
              <Button isIconOnly radius="full" size="sm" variant="light">
                Edit
              </Button>
              <Button isIconOnly radius="full" size="sm" variant="light">
                Delete
              </Button>
            </div>
          );
        default:
          return null;
      }
    },
    []
  );

  const onSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
  };

  useEffect(() => {
    console.log("Selected keys:", selectedKeys);
  }, [selectedKeys]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%] bg-crust rounded-lg"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <div className="flex flex-row gap-2">
          <Dropdown onOpenChange={setIsOpen}>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                className="bg-crust text-text rounded-lg"
                endContent={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                variant="flat"
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
              className="bg-crust rounded-lg"
              classNames={{
                base: "w-48",
                list: "space-y-1",
              }}
            >
              {columns.map((column) => (
                <DropdownItem
                  key={column.uid}
                  classNames={{
                    base: "rounded-lg hover:bg-text hover:text-crust",
                  }}
                >
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                className="bg-crust text-text rounded-lg"
                endContent={
                  isOpenRows ? <ChevronUpIcon /> : <ChevronDownIcon />
                }
                variant="flat"
              >
                # Rows
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Rows per page"
              closeOnSelect={true}
              selectionMode="single"
              selectedKeys={[rowsPerPage]}
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).map(Number)[0];
                setRowsPerPage(selectedValue);
              }}
              className="bg-crust rounded-lg"
              classNames={{
                base: "w-48",
                list: "space-y-1",
              }}
            >
              <DropdownItem
                key={5}
                classNames={{
                  base: "rounded-lg hover:bg-text hover:text-crust",
                }}
              >
                5
              </DropdownItem>
              <DropdownItem
                key={10}
                classNames={{
                  base: "rounded-lg hover:bg-text hover:text-crust",
                }}
              >
                10
              </DropdownItem>
              <DropdownItem
                key={15}
                classNames={{
                  base: "rounded-lg hover:bg-text hover:text-crust",
                }}
              >
                15
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, isOpen]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys instanceof Set && selectedKeys.size > 0
            ? `${selectedKeys.size} of ${filteredItems.length} selected`
            : `${filteredItems.length} items`}
        </span>
        <Pagination
          unselectable="on"
          page={page}
          total={pages}
          onChange={setPage}
          showControls
          isCompact
          disableAnimation={false}
          disableCursorAnimation={false}
          classNames={{
            base: "bg-crust text-text rounded-lg",
            wrapper: "rounded-lg bg-transparent",
            item: "hover:bg-text hover:text-crust rounded-lg duration-300 data-[active=true]:bg-text data-[active=true]:text-crust",
            chevronNext: "rotate-180",
          }}
        />
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  const isRowSelected = React.useCallback(
    (id: string) => {
      if (selectedKeys === "all") return true;
      if (selectedKeys instanceof Set) return selectedKeys.has(id.toString());
      return false;
    },
    [selectedKeys]
  );

  return (
    <Table
      removeWrapper
      aria-label="Product table"
      isHeaderSticky
      bottomContent={bottomContent}
      classNames={{
        wrapper: "max-h-[382px]",
        th: "bg-crust text-text",
        tr: "bg-surface0",
        table: "rounded-lg",
        base: "rounded-lg",
      }}
      selectedKeys={selectedKeys}
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={onSelectionChange}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            className={
              column.sortable ? "hover:cursor-pointer hover:text-subtext0" : ""
            }
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow
            key={item.id}
            aria-selected={isRowSelected(item.id)}
            className={`hover:bg-surface2 transition-colors ${
              isRowSelected(item.id) ? "border-2 border-blue-500" : ""
            }`}
          >
            {(columnKey) => (
              <TableCell className="truncate" key={columnKey}>
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
